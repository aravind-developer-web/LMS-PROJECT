from django.db import models
from django.conf import settings
from apps.modules.models import Module

class Note(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='notes', on_delete=models.CASCADE)
    module = models.ForeignKey(Module, related_name='notes', on_delete=models.CASCADE)
    content = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'module')

    def __str__(self):
        return f"Note by {self.user.username} on {self.module.title}"
