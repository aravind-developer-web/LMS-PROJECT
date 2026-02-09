from rest_framework import generics, permissions, views, response
from .models import Note
from .serializers import NoteSerializer
from apps.modules.models import Module

class NoteRetrieveUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        module_id = self.kwargs.get('module_id')
        try:
            note = Note.objects.get(user=self.request.user, module_id=module_id)
        except Note.DoesNotExist:
            # If note doesn't exist, Create one automatically or return None?
            # Better to create one if PUT, or return 404 for GET?
            # Actually, let's create it if it doesn't exist for convenience
            module = Module.objects.get(id=module_id)
            note = Note.objects.create(user=self.request.user, module=module)
        return note

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class NoteListView(generics.ListAPIView):
    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Return all notes for current user that are not empty
        return Note.objects.filter(user=self.request.user).exclude(content='').order_by('-updated_at')
