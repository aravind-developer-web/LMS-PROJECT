import os
import sys
import django

sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from apps.modules.models import ModuleProgress, ResourceProgress
from apps.quiz.models import QuizAttempt

User = get_user_model()

print(f"Total Users: {User.objects.count()}")
print(f"Learners: {User.objects.filter(role='learner').count()}")
print(f"Managers: {User.objects.filter(role='manager').count()}")
print(f"Admins: {User.objects.filter(role='admin').count()}")

print("\nLearner Usernames:")
for u in User.objects.filter(role='learner'):
    print(f"- {u.username} (ID: {u.id})")

print(f"\nTotal ModuleProgress: {ModuleProgress.objects.count()}")
print(f"Total ResourceProgress: {ResourceProgress.objects.count()}")
print(f"Total QuizAttempts: {QuizAttempt.objects.count()}")

print("\nRecent ModuleProgress Status Groups:")
from django.db.models import Count
print(ModuleProgress.objects.values('status').annotate(count=Count('id')))
