# asgi.py

import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from schedules.consumers import ScheduleNotificationConsumer

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'facial_attendance_system.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter({
            "ws/schedule_notifications/": ScheduleNotificationConsumer.as_asgi(),
        })
    ),
})
