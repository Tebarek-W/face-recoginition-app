# tasks.py

from my_celery import shared_task
from datetime import timedelta
from django.utils import timezone
from channels.layers import get_channel_layer
from .models import Schedule

@shared_task
def send_schedule_notification():
    now = timezone.now()
    schedules = Schedule.objects.filter(start_time__lte=now + timedelta(minutes=30), status='Active')
    for schedule in schedules:
        channel_layer = get_channel_layer()
        message = f"Class '{schedule.name}' is about to start in 30 minutes!"
        channel_layer.group_send(
            'schedule_notifications', 
            {
                'type': 'schedule_notification',
                'message': message,
            }
        )
