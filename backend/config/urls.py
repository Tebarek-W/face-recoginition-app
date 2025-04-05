from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/students/', include('students.urls')),
    path('api/departments/', include('departments.urls')),
     path('api/', include('courses.urls')),
    path('api/', include('instructors.urls')), 
    path('api/schedules/', include('schedules.urls')),
    path('api/attendance/', include('attendance.urls')),
    path('api/facial-data/', include('facial_data.urls')),
    path('api/analytics/', include('analytics.urls')),
    path('api/users/', include('users.urls')),
   
]