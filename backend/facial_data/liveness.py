import cv2
import numpy as np
from collections import deque


class LivenessDetector:
    def __init__(self):
        # Initialize detectors with tuned parameters
        self.face_cascade = cv2.CascadeClassifier(
            cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        self.eye_cascade = cv2.CascadeClassifier(
            cv2.data.haarcascades + 'haarcascade_eye.xml')
        
        # Buffers to track eye state and face movement
        self.blink_history = deque(maxlen=3)
        self.face_positions = deque(maxlen=5)

        # Detection thresholds
        self.MOVEMENT_THRESHOLD = 10  # pixels
        self.TEXTURE_THRESHOLD = 100   # Laplacian variance
        self.MIN_BLINKS = 1
        self.MIN_MOVEMENT = 1
        self.LIVENESS_THRESHOLD = 0.7  # 70% frames must pass checks

    def analyze_frames(self, frames):
        """Analyze a list of image frames for liveness signals."""
        results = {
            'blink_count': 0,
            'movement_score': 0,
            'frames_processed': 0,
            'frame_details': [],
            'is_verified': False
        }

        for frame in frames:
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            faces = self.face_cascade.detectMultiScale(gray, 1.1, 4)

            if len(faces) > 0:
                x, y, w, h = faces[0]
                self.face_positions.append((x, y))
                face_roi = gray[y:y+h, x:x+w]

                eyes = self.eye_cascade.detectMultiScale(face_roi)
                self.blink_history.append(len(eyes) >= 2)

                if (len(self.blink_history) == 3 and
                    all(self.blink_history[i] for i in [0, 2]) and
                    not self.blink_history[1]):
                    results['blink_count'] += 1

                if len(self.face_positions) > 1:
                    dx = abs(self.face_positions[-1][0] - self.face_positions[0][0])
                    dy = abs(self.face_positions[-1][1] - self.face_positions[0][1])
                    if dx > self.MOVEMENT_THRESHOLD or dy > self.MOVEMENT_THRESHOLD:
                        results['movement_score'] += 1

                laplacian_var = cv2.Laplacian(face_roi, cv2.CV_64F).var()
                is_live_frame = laplacian_var > self.TEXTURE_THRESHOLD

                results['frame_details'].append({
                    'frame_size': frame.shape,
                    'face_bbox': (x, y, w, h),
                    'eyes_detected': len(eyes),
                    'movement': (dx, dy) if 'dx' in locals() else (0, 0),
                    'texture_score': laplacian_var,
                    'is_live_frame': is_live_frame
                })
            else:
                results['frame_details'].append({
                    'face_detected': False
                })

            results['frames_processed'] += 1

        # Compute final verification
        live_frames = sum(1 for f in results['frame_details'] if f.get('is_live_frame', False))
        results['liveness_score'] = live_frames / max(1, results['frames_processed'])

        results['is_verified'] = (
            results['liveness_score'] >= self.LIVENESS_THRESHOLD and
            results['blink_count'] >= self.MIN_BLINKS and
            results['movement_score'] >= self.MIN_MOVEMENT
        )

        return results['is_verified']

    def analyze_video(self, video_path):
        """Analyze a video file for liveness."""
        results = {
            'blink_count': 0,
            'movement_score': 0,
            'frames_processed': 0,
            'frame_details': [],
            'is_verified': False
        }

        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            raise ValueError("Could not open video file")

        try:
            while cap.isOpened():
                ret, frame = cap.read()
                if not ret:
                    break

                gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                faces = self.face_cascade.detectMultiScale(gray, 1.1, 4)

                if len(faces) > 0:
                    x, y, w, h = faces[0]
                    self.face_positions.append((x, y))
                    face_roi = gray[y:y+h, x:x+w]

                    eyes = self.eye_cascade.detectMultiScale(face_roi)
                    self.blink_history.append(len(eyes) >= 2)

                    if (len(self.blink_history) == 3 and
                        all(self.blink_history[i] for i in [0, 2]) and
                        not self.blink_history[1]):
                        results['blink_count'] += 1

                    if len(self.face_positions) > 1:
                        dx = abs(self.face_positions[-1][0] - self.face_positions[0][0])
                        dy = abs(self.face_positions[-1][1] - self.face_positions[0][1])
                        if dx > self.MOVEMENT_THRESHOLD or dy > self.MOVEMENT_THRESHOLD:
                            results['movement_score'] += 1

                    laplacian_var = cv2.Laplacian(face_roi, cv2.CV_64F).var()
                    is_live_frame = laplacian_var > self.TEXTURE_THRESHOLD

                    results['frame_details'].append({
                        'frame_size': frame.shape,
                        'face_bbox': (x, y, w, h),
                        'eyes_detected': len(eyes),
                        'movement': (dx, dy),
                        'texture_score': laplacian_var,
                        'is_live_frame': is_live_frame
                    })
                else:
                    results['frame_details'].append({
                        'face_detected': False
                    })

                results['frames_processed'] += 1
        finally:
            cap.release()

        live_frames = sum(1 for f in results['frame_details'] if f.get('is_live_frame', False))
        results['liveness_score'] = live_frames / max(1, results['frames_processed'])

        results['is_verified'] = (
            results['liveness_score'] >= self.LIVENESS_THRESHOLD and
            results['blink_count'] >= self.MIN_BLINKS and
            results['movement_score'] >= self.MIN_MOVEMENT
        )

        return results
