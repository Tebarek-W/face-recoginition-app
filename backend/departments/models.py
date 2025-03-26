from django.db import models
from users.models import User

class Department(models.Model):
    name = models.CharField(max_length=100, unique=True, verbose_name="Department Name")
    head_of_department = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        limit_choices_to={'role': 'HEAD'},
        related_name='headed_departments',
        verbose_name="Head of Department"
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Created At")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Updated At")

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']
        verbose_name = "Department"
        verbose_name_plural = "Departments"