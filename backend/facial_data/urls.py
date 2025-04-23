from django.urls import path
from .views import LivenessVerificationAPI

urlpatterns = [
    path('verify/', LivenessVerificationAPI.as_view(), name='liveness-verify'),
]