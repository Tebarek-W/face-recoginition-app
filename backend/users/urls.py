from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import UserViewSet

router = DefaultRouter()
router.register(r'', UserViewSet, basename='user')

urlpatterns = [
    path('heads/', UserViewSet.as_view({'get': 'get_heads'}), name='user-heads'),
] + router.urls