from django.urls import path
from . import views

urlpatterns = [
    path('', views.AssignmentListCreateView.as_view(), name='assignment_list_create'),
    path('<int:pk>/', views.AssignmentDetailView.as_view(), name='assignment_detail'),
    path('modules/<int:module_id>/submit/', views.SubmissionCreateView.as_view(), name='submission_create'),
    path('modules/<int:module_id>/submissions/', views.SubmissionListView.as_view(), name='submission_list'),
    path('my/', views.AssignmentListCreateView.as_view(), name='my_assignments'),
]
