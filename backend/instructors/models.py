from django.db import models
from users.models import User
from departments.models import Department

class Instructor(models.Model):
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE, 
        related_name='instructor'
    )
    department = models.ForeignKey(
        Department, 
        on_delete=models.CASCADE, 
        related_name='instructors'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name}"  # More readable than username

    @property
    def email(self):
        return self.user.email

    @property
    def full_name(self):
        return f"{self.user.first_name} {self.user.last_name}"