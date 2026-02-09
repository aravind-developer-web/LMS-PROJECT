from rest_framework import generics, permissions
from .models import Assignment
from .serializers import AssignmentSerializer, SubmissionSerializer

class AssignmentListCreateView(generics.ListCreateAPIView):
    serializer_class = AssignmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Assignment.objects.all()
        return Assignment.objects.filter(user=user)

    def perform_create(self, serializer):
        # Admin assigns module to user
        serializer.save(assigned_by=self.request.user)

class AssignmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Assignment.objects.all()
        return Assignment.objects.filter(user=user)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from .models import Submission

class SubmissionCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, module_id):
        assignment = generics.get_object_or_404(Assignment, user=request.user, module_id=module_id)
        
        serializer = SubmissionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(assignment=assignment)
            
            # Check for Module Completion
            from apps.modules.models import Module, ModuleProgress, ResourceProgress
            module = assignment.module
            total_resources = module.resources.count()
            completed_resources = ResourceProgress.objects.filter(
                user=request.user, 
                resource__module=module, 
                completed=True
            ).count()
            
            resources_done = total_resources > 0 and completed_resources >= total_resources
            
            quiz_requirements_met = True
            if module.has_quiz:
                from apps.quiz.models import QuizAttempt, Quiz
                quiz = Quiz.objects.filter(module=module).first()
                if quiz:
                    quiz_requirements_met = QuizAttempt.objects.filter(user=request.user, quiz=quiz, passed=True).exists()
                else:
                    quiz_requirements_met = False
            
            if resources_done and quiz_requirements_met:
                mod_progress, _ = ModuleProgress.objects.get_or_create(user=request.user, module=module)
                mod_progress.status = 'completed'
                mod_progress.completed_at = timezone.now()
                mod_progress.save()
                
                assignment.status = 'completed'
                assignment.completed_at = timezone.now()
                assignment.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SubmissionListView(generics.ListAPIView):
    serializer_class = SubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        module_id = self.kwargs.get('module_id')
        return Submission.objects.filter(assignment__user=self.request.user, assignment__module_id=module_id)
