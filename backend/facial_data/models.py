from django.db import models
from users.models import User  # Assuming User model is in authentication app

class FacialData(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='facial_data')
    facial_features = models.BinaryField()  # Stores facial embeddings
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Facial Data for {self.user.username}"