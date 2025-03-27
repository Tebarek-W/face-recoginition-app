from django.db import models
from departments.models import Department
from instructors.models import Instructor

class Course(models.Model):
    department = models.ForeignKey(
        Department, 
        on_delete=models.CASCADE, 
        related_name='courses'
    )
    instructor = models.ForeignKey(
        Instructor,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='courses'
    )
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=10, unique=True)
    description = models.TextField(blank=True, default='')
    credit_hours = models.PositiveSmallIntegerField(default=3)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['code']
        verbose_name_plural = 'Courses'

    def __str__(self):
        return f"{self.code} - {self.name} ({self.department.code})"