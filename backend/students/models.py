from django.db import models
from users.models import User  # Assuming User model is in authentication app
from departments.models import Department  # Assuming Department model is in departments app
from facial_data.models import FacialData  # Assuming FacialData model is in facial_data app

class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student')
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='students')
    facial_data = models.OneToOneField(FacialData, on_delete=models.SET_NULL, null=True, blank=True, related_name='student')
    roll_number = models.CharField(max_length=20, unique=True)
    year_of_study = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} ({self.roll_number})"