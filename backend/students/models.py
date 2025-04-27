from django.db import models
from django.contrib.auth.models import AbstractUser
from users.models import User
from departments.models import Department
import uuid

class Student(models.Model):
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
    ]

    YEAR_CHOICES = [
        (1, 'First Year'),
        (2, 'Second Year'),
        (3, 'Third Year'),
        (4, 'Fourth Year'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, 
    blank=True, related_name='student')
    student_id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100, blank=True)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    email = models.EmailField(unique=True, blank=True)
    password = models.CharField(max_length=255, blank=True)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, blank=True, null=True)
    year_of_study = models.IntegerField(choices=YEAR_CHOICES, default=1)
    is_verified = models.BooleanField(default=False)
    verification_step = models.PositiveSmallIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.student_id})"