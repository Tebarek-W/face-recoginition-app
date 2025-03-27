from django.urls import path
from . import views

urlpatterns = [
    path('attendance/analytics/', views.AttendanceAnalyticsView.as_view(), name='attendance-analytics'),
    path('attendance/rules/', views.AttendanceRulesView.as_view(), name='attendance-rules'),
]