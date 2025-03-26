from django.contrib import admin
from .models import AttendanceRecord

class AttendanceRecordAdmin(admin.ModelAdmin):
    list_display = ('student', 'schedule', 'status', 'attendance_time')
    list_filter = ('status', 'schedule__course')  # Filter by status and course
    search_fields = ('student__user__username', 'schedule__course__name')  # Search by student or course

admin.site.register(AttendanceRecord, AttendanceRecordAdmin)