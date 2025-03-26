from django.db import models
from users.models import User  # Assuming User model is in authentication app
from departments.models import Department  # Assuming Department model is in departments app

class Instructor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='instructor')
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='instructors')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user.username