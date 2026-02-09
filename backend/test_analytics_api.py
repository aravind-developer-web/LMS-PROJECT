import os
import sys
import django

sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

# Now import DRF and app components
from rest_framework.test import APIRequestFactory, force_authenticate
from apps.analytics.views import TeamStatsView, StuckLearnersView, ModuleStatsView, TeamVelocityView
from apps.authapp.models import User

def test_view(view_class, name):
    print(f"\n--- Testing {name} ---")
    factory = APIRequestFactory()
    try:
        user = User.objects.get(username='manager2')
        view = view_class.as_view()
        request = factory.get('/')
        force_authenticate(request, user=user)
        response = view(request)
        print(f"Status Code: {response.status_code}")
        print(f"Data: {response.data}")
    except User.DoesNotExist:
        print(f"Error: User manager2 does not exist.")
    except Exception as e:
        print(f"Error executing {name}: {e}")

try:
    test_view(TeamStatsView, "TeamStatsView")
    test_view(StuckLearnersView, "StuckLearnersView")
    test_view(ModuleStatsView, "ModuleStatsView")
    test_view(TeamVelocityView, "TeamVelocityView")
except Exception as e:
    print(f"Global Error: {e}")
