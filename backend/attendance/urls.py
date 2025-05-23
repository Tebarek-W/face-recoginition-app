from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AttendanceRecordViewSet

router = DefaultRouter()
router.register(r'attendance-records', AttendanceRecordViewSet)

urlpatterns = [
    path('', include(router.urls)),
]