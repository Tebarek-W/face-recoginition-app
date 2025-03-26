from django.urls import path
from .views import RegisterView, LoginView, LogoutView, UserListView, UserUpdateView, UserDeleteView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('users/', UserListView.as_view(), name='user-list'),  # List all users
    path('users/<int:user_id>/', UserUpdateView.as_view(), name='user-update'),  # Update a user
    path('users/<int:user_id>/delete/', UserDeleteView.as_view(), name='user-delete'),  # Delete a user
]