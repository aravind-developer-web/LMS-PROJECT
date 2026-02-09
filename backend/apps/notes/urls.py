from django.urls import path
from . import views

urlpatterns = [
    path('', views.NoteListView.as_view(), name='note_list'),
    path('<int:module_id>/', views.NoteRetrieveUpdateView.as_view(), name='note_detail'),
]
