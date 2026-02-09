from rest_framework import serializers, generics, permissions
from .models import Certification, ManagerNotice, LearnerMessage

class CertificationSerializer(serializers.ModelSerializer):
    learner_name = serializers.ReadOnlyField(source='learner.username')
    module_title = serializers.ReadOnlyField(source='module.title')

    class Meta:
        model = Certification
        fields = '__all__'

class ManagerNoticeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ManagerNotice
        fields = '__all__'
        read_only_fields = ['manager', 'created_at']

class LearnerMessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.ReadOnlyField(source='sender.username')
    receiver_name = serializers.ReadOnlyField(source='receiver.username')

    class Meta:
        model = LearnerMessage
        fields = '__all__'
        read_only_fields = ['sender', 'created_at']

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
