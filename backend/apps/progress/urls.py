from django.urls import path
from .views import ProgressUpdateView

urlpatterns = [
    path('<int:module_id>/', ProgressUpdateView.as_view(), name='progress_update'),
]
