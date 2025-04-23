from django.contrib import admin
from .models import Student

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = (
        'student_id',
        'first_name', 
        'last_name', 
        'email',
        'department',
        'year_of_study',
        'is_verified'
    )
    list_filter = (
        'department',
        'year_of_study',
        'is_verified',
        'gender'
    )
    search_fields = (
        'first_name',
        'last_name',
        'email',
        'student_id'
    )
    list_per_page = 20
    ordering = ('student_id',)
    fieldsets = (
        ('Personal Information', {
            'fields': (
                'first_name',
                'last_name',
                'gender',
                'date_of_birth',
                'email'
            )
        }),
        ('Academic Information', {
            'fields': (
                'student_id',
                'department',
                'year_of_study'
            )
        }),
        ('Verification Status', {
            'fields': (
                'is_verified',
                'verification_step'
            )
        }),
    )
    readonly_fields = ('student_id',)
