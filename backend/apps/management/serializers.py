from rest_framework import serializers
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
