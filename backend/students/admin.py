from django.contrib import admin
from .models import Student

class StudentAdmin(admin.ModelAdmin):
    list_display = ('user', 'department', 'roll_number', 'year_of_study')  # Fields to display
    list_filter = ('department', 'year_of_study')  # Add filters
    search_fields = ('user__username', 'roll_number')  # Add search functionality

admin.site.register(Student, StudentAdmin)