import cv2
import numpy as np
from .liveness import LivenessDetector
from django.core.files.storage import default_storage
from datetime import datetime


def process_liveness_images(images_dict):
    """
    Process liveness verification from uploaded images
    Returns dict with verification results
    """
    detector = LivenessDetector()
    ordered_images = []

    # Get images in correct order
    for step in ['neutral', 'blink', 'smile', 'turnLeft', 'turnRight']:
        key = f'liveness_{step}'
        if key in images_dict:
            img_file = images_dict[key]
            img = cv2.imdecode(
                np.frombuffer(img_file.read(), np.uint8),
                cv2.IMREAD_COLOR
            )
            ordered_images.append(img)

    if len(ordered_images) < 3:
        return {
            'is_verified': False,
            'error': 'Insufficient frames (minimum 3 required)'
        }

    # Analyze frames for liveness
    result = detector.analyze_frames(ordered_images)
    return {
        'is_verified': result,
        'error': None if result else 'Liveness check failed'
    }


def analyze_video_file(video_file):
    """
    Process video file for liveness verification
    """
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    temp_path = f"temp_video_{timestamp}.webm"

    with default_storage.open(temp_path, 'wb+') as destination:
        for chunk in video_file.chunks():
            destination.write(chunk)

    try:
        detector = LivenessDetector()
        result = detector.analyze_video(default_storage.path(temp_path))
        return {
            'is_verified': result,
            'error': None if result else 'Liveness check failed'
        }
    finally:
        if default_storage.exists(temp_path):
            default_storage.delete(temp_path)
