from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FacialDataViewSet

router = DefaultRouter()
router.register(r'facial-data', FacialDataViewSet)

urlpatterns = [
    path('', include(router.urls)),
]