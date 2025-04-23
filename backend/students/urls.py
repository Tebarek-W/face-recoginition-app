from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import StudentViewSet

router = DefaultRouter()
router.register(r'students', StudentViewSet, basename='student')

urlpatterns = [
    # This registers the 'verify_liveness' action with the correct viewset method
    path('students/<str:student_id>/verify_liveness/', 
         StudentViewSet.as_view({'post': 'verify_liveness'}), 
         name='student-verify-liveness'),
] + router.urls
