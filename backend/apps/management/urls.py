from django.urls import path
from .views import CertificationListCreateView, ManagerNoticeListCreateView, LearnerMessageListCreateView

urlpatterns = [
    path('certifications/', CertificationListCreateView.as_view(), name='certifications'),
    path('notices/', ManagerNoticeListCreateView.as_view(), name='notices'),
    path('messages/', LearnerMessageListCreateView.as_view(), name='messages'),
]
