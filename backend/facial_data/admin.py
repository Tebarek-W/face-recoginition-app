from django.contrib import admin
from .models import FacialData

@admin.register(FacialData)
class FacialDataAdmin(admin.ModelAdmin):
    list_display = (
        'student',
        'is_verified',
        'created_at'
    )
    list_filter = (
        'is_verified',
        'created_at'
    )
    search_fields = (
        'student__first_name',
        'student__last_name',
        'student__email'
    )
    readonly_fields = (
        'created_at',
        'updated_at',
        'analysis_results'
    )
    fieldsets = (
        ('Student Information', {
            'fields': ('student',)
        }),
        ('Verification Data', {
            'fields': (
                'video',
                'is_verified',
                'analysis_results'
            )
        }),
        ('Metadata', {
            'fields': (
                'created_at',
                'updated_at'
            )
        }),
    )