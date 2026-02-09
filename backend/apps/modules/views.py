from rest_framework import generics, permissions
from .models import Module, Resource
from .serializers import ModuleSerializer, ResourceSerializer, ModuleProgressSerializer

class ModuleListCreateView(generics.ListCreateAPIView):
    queryset = Module.objects.all()
    serializer_class = ModuleSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Only admin should create. Check user role if needed.
        serializer.save()

class ModuleDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Module.objects.all()
    serializer_class = ModuleSerializer
    permission_classes = [permissions.IsAuthenticated]

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
from .models import ModuleProgress, ResourceProgress

class ModuleProgressView(generics.RetrieveAPIView):
    serializer_class = ModuleProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        module_id = self.kwargs['pk']
        module = generics.get_object_or_404(Module, pk=module_id)
        progress, created = ModuleProgress.objects.get_or_create(user=self.request.user, module=module)
        return progress

class UpdateResourceProgressView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, module_id, resource_id):
        # 1. Mark resource as completed
        resource = generics.get_object_or_404(Resource, pk=resource_id, module_id=module_id)
        res_progress, created = ResourceProgress.objects.get_or_create(user=request.user, resource=resource)
        
        if not res_progress.completed:
            res_progress.completed = True
            res_progress.completed_at = timezone.now()
            res_progress.save()

        # 2. Check if Module is completed
        # logical check: if all resources in module are completed -> mark module complete
        module = generics.get_object_or_404(Module, pk=module_id)
        total_resources = module.resources.count()
        completed_resources = ResourceProgress.objects.filter(
            user=request.user, 
            resource__module=module, 
            completed=True
        ).count()

        mod_progress, _ = ModuleProgress.objects.get_or_create(user=request.user, module=module)
        
        if mod_progress.status == 'not_started':
            mod_progress.status = 'in_progress'
            mod_progress.save()
        else:
            mod_progress.save() # Update last_accessed

        # ONLY COMPLETE IF:
        # 1. All resources are done
        # 2. Module has NO quiz OR quiz is already passed
        # 3. Module has NO assignment OR assignment is already submitted
        
        resources_done = total_resources > 0 and completed_resources >= total_resources
        
        quiz_requirements_met = True
        if module.has_quiz:
            from apps.quiz.models import QuizAttempt, Quiz
            quiz = Quiz.objects.filter(module=module).first()
            if quiz:
                quiz_requirements_met = QuizAttempt.objects.filter(user=request.user, quiz=quiz, passed=True).exists()
            else:
                quiz_requirements_met = False

        assignment_requirements_met = True
        if module.has_assignment:
            from apps.assignments.models import Assignment, Submission
            assignment = Assignment.objects.filter(user=request.user, module=module).first()
            if assignment:
                assignment_requirements_met = Submission.objects.filter(assignment=assignment).exists()
            else:
                assignment_requirements_met = False

        if resources_done and quiz_requirements_met and assignment_requirements_met:
            mod_progress.status = 'completed'
            mod_progress.completed_at = timezone.now()
            mod_progress.save()
            
            # Status update for the assignment enrollment record too
            from apps.assignments.models import Assignment
            Assignment.objects.filter(user=request.user, module=module).update(
                status='completed', completed_at=timezone.now()
            )

        return Response({"status": "updated", "module_status": mod_progress.status})

class UpdateVideoProgressView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, module_id, resource_id):
        # Update watch time and position
        resource = generics.get_object_or_404(Resource, pk=resource_id, module_id=module_id)
        progress, created = ResourceProgress.objects.get_or_create(user=request.user, resource=resource)
        
        watch_time = request.data.get('watch_time')
        last_position = request.data.get('last_position')
        
        if watch_time is not None:
            progress.watch_time_seconds = watch_time
        if last_position is not None:
            progress.last_position_seconds = last_position
            
        progress.save()

        # Update ModuleProgress last_accessed
        mod_progress, _ = ModuleProgress.objects.get_or_create(user=request.user, module_id=module_id)
        mod_progress.save() # auto_now updates timestamp

        return Response({"status": "progress_updated"})
