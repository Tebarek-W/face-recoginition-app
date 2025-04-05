from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, LoginView, LogoutView

router = DefaultRouter()
router.register(r'', UserViewSet, basename='user')

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('heads/', UserViewSet.as_view({'get': 'get_heads'}), name='user-heads'),
] + router.urls
