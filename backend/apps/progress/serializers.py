from rest_framework import serializers
from .models import ModuleProgress

class ModuleProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ModuleProgress
        fields = '__all__'
        read_only_fields = ('user',)
