from django.contrib import admin
from .models import Department
from courses.models import Course

class CourseInline(admin.TabularInline):  # Or admin.StackedInline
    model = Course
    extra = 1  # Number of empty forms to display

class DepartmentAdmin(admin.ModelAdmin):
    inlines = [CourseInline]  # Add CourseInline to Department admin

admin.site.register(Department, DepartmentAdmin)