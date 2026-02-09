from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterView, MyTokenObtainPairView, UserDetailView, LearnerManagementView, LearnerDeleteView

urlpatterns = [
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('me/', UserDetailView.as_view(), name='auth_me'),
    path('learners/', LearnerManagementView.as_view(), name='learner_management'),
    path('learners/<int:pk>/', LearnerDeleteView.as_view(), name='learner_delete'),
]
