from rest_framework import generics, permissions
from django.db import models
from .models import Certification, ManagerNotice, LearnerMessage
from .serializers import CertificationSerializer, ManagerNoticeSerializer, LearnerMessageSerializer

class CertificationListCreateView(generics.ListCreateAPIView):
    serializer_class = CertificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'learner':
            return Certification.objects.filter(learner=user)
        return Certification.objects.all()

    def perform_create(self, serializer):
        serializer.save()

class ManagerNoticeListCreateView(generics.ListCreateAPIView):
    serializer_class = ManagerNoticeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ManagerNotice.objects.all().order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(manager=self.request.user)

class LearnerMessageListCreateView(generics.ListCreateAPIView):
    serializer_class = LearnerMessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return LearnerMessage.objects.filter(
            models.Q(sender=user) | models.Q(receiver=user)
        ).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)
