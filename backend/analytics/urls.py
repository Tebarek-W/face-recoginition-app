from django.urls import path
from .views import AttendanceAnalyticsView

urlpatterns = [
    path('attendance-analytics/', AttendanceAnalyticsView.as_view(), name='attendance-analytics'),
]