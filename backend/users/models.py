from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.text import slugify

class User(AbstractUser):
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    ]
    
    ROLE_CHOICES = [
        ('ADMIN', 'Admin'),
        ('HEAD', 'Head of Department'),
        ('INSTRUCTOR', 'Instructor'),
        ('STUDENT', 'Student'),
    ]
    
    role = models.CharField(max_length=50, choices=ROLE_CHOICES, default='INSTRUCTOR')
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, blank=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.username and self.first_name and self.last_name:
            # Generate username from first_name and last_name
            base_username = f"{slugify(self.first_name)}.{slugify(self.last_name)}"
            username = base_username
            counter = 1
            
            while User.objects.filter(username=username).exists():
                username = f"{base_username}{counter}"
                counter += 1
                
            self.username = username
        
        # Set email as username if not provided
        if self.email and not self.username:
            self.username = self.email
            
        super().save(*args, **kwargs)

    def __str__(self):
        return self.username