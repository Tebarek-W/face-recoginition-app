from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API endpoints
    path('api/users/', include('users.urls')),               # User management
    path('api/', include('students.urls')),      # Student-related endpoints
    path('api/', include('courses.urls')),
    path('api/', include('instructors.urls')), 
    path('api/', include('schedules.urls')),  
    path('api/attendance/', include('attendance.urls')),  
    path('api/', include('departments.urls')),
    path('api/analytics/', include('analytics.urls')),      # Analytics and reporting
    path('api/facial/', include('facial_data.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)