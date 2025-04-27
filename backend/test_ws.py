import os
import redis
from django.core.management import execute_from_command_line
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import json
from datetime import datetime

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

def setup_django():
    """Initialize Django environment"""
    import django
    django.setup()
    execute_from_command_line(['manage.py', 'check'])

def test_redis_connection():
    """Verify Redis is running and accessible"""
    try:
        r = redis.Redis(host='127.0.0.1')
        return r.ping()
    except redis.ConnectionError:
        return False

def test_channel_layer():
    """Test channel layer functionality"""
    try:
        layer = get_channel_layer()
        
        # Test direct message
        async_to_sync(layer.send)('test_channel', {'type': 'test.message'})
        
        # Test group message
        async_to_sync(layer.group_send)(
            "notifications",
            {"type": "send.notification", "content": {"test": "value"}}
        )
        
        return True
    except Exception as e:
        print(f"Channel layer error: {str(e)}")
        return False

def monitor_redis_messages():
    """Live monitor Redis pub/sub for notifications"""
    r = redis.Redis(host='127.0.0.1')
    pubsub = r.pubsub()
    pubsub.subscribe('notifications')
    
    print("\n[Redis Monitor] Listening for notifications... (Ctrl+C to stop)")
    print("Open a WebSocket connection in your browser to test")
    
    try:
        for message in pubsub.listen():
            if message['type'] == 'message':
                print(f"\n[Redis] Received at {datetime.now().isoformat()}:")
                try:
                    print(json.dumps(json.loads(message['data']), indent=2))
                except:
                    print(message['data'])
    except KeyboardInterrupt:
        print("\nStopping monitor...")

def run_diagnostic():
    print("=== WebSocket Notification Diagnostic ===")
    print("1. Testing Redis connection...")
    redis_ok = test_redis_connection()
    print(f"✓ Redis connection: {'OK' if redis_ok else 'FAILED'}")
    
    if not redis_ok:
        print("❌ Redis not running. Start Redis first.")
        return
    
    print("\n2. Initializing Django...")
    setup_django()
    print("✓ Django initialized")
    
    print("\n3. Testing Channel Layer...")
    layer_ok = test_channel_layer()
    print(f"✓ Channel layer: {'OK' if layer_ok else 'FAILED'}")
    
    if layer_ok:
        print("\n4. Starting Redis message monitor...")
        monitor_redis_messages()
    else:
        print("❌ Channel layer failed. Check CHANNEL_LAYERS in settings.py")

if __name__ == "__main__":
    run_diagnostic()