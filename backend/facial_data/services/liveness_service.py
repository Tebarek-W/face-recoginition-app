import cv2
import numpy as np
import onnxruntime as ort
from insightface.app import FaceAnalysis
from typing import Tuple, List, Dict, Optional

class LivenessService:
    def __init__(self, model_path: str):
        """
        Initialize the liveness detection service with model paths.
        """
        self.model_path = model_path
        self.face_analyzer = self._initialize_face_analyzer()
        self.liveness_model = self._initialize_liveness_model()
        
    def _initialize_face_analyzer(self) -> FaceAnalysis:
        """
        Initialize the InsightFace face analyzer.
        """
        app = FaceAnalysis(name='buffalo_l', root=self.model_path)
        app.prepare(ctx_id=0, det_size=(640, 640))
        return app
    
    def _initialize_liveness_model(self) -> ort.InferenceSession:
        """
        Initialize the ONNX liveness detection model.
        """
        model_path = f"{self.model_path}/antispoofing.onnx"
        return ort.InferenceSession(model_path)
    
    def detect_faces(self, frame: np.ndarray) -> List[Dict]:
        """
        Detect faces in a frame using InsightFace.
        """
        return self.face_analyzer.get(frame)
    
    def check_liveness(self, face_img: np.ndarray) -> Tuple[bool, float]:
        """
        Check if a face is live or spoof.
        Returns a tuple of (is_live, confidence_score)
        """
        # Preprocess the face image
        face_img = cv2.resize(face_img, (80, 80))
        face_img = face_img.astype(np.float32) / 255.0
        face_img = np.transpose(face_img, (2, 0, 1))
        face_img = np.expand_dims(face_img, axis=0)
        
        # Run the model
        input_name = self.liveness_model.get_inputs()[0].name
        output_name = self.liveness_model.get_outputs()[0].name
        pred = self.liveness_model.run([output_name], {input_name: face_img})[0]
        
        # Get the confidence score
        confidence = float(pred[0][0])
        is_live = confidence > 0.5  # Threshold can be adjusted
        
        return is_live, confidence
    
    def perform_liveness_check(self, video_path: str) -> Tuple[bool, Dict]:
        """
        Perform liveness check on a video file.
        Returns a tuple of (overall_result, detailed_stats)
        """
        cap = cv2.VideoCapture(video_path)
        frame_count = 0
        live_frames = 0
        total_frames = 0
        detailed_stats = {
            'eye_openness': 0,
            'mouth_movement': 0,
            'head_movement': 0,
            'smile_detected': False,
            'frame_results': []
        }
        
        prev_landmarks = None
        
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
                
            total_frames += 1
            frame_count += 1
            
            # Skip frames for performance (process every 5th frame)
            if frame_count % 5 != 0:
                continue
                
            # Convert to RGB
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            
            # Detect faces
            faces = self.detect_faces(frame_rgb)
            if not faces:
                continue
                
            # Get the first face (assuming one face per video)
            face = faces[0]
            
            # Check liveness
            bbox = face.bbox.astype(int)
            face_img = frame_rgb[bbox[1]:bbox[3], bbox[0]:bbox[2]]
            is_live, confidence = self.check_liveness(face_img)
            
            # Update frame results
            frame_result = {
                'frame_num': frame_count,
                'is_live': is_live,
                'confidence': confidence,
                'landmarks': face.landmark.tolist(),
                'bbox': bbox.tolist()
            }
            detailed_stats['frame_results'].append(frame_result)
            
            if is_live:
                live_frames += 1
                
            # Check facial expressions
            if face.landmark is not None:
                # Eye openness (simple ratio-based check)
                left_eye = face.landmark[36:42]
                right_eye = face.landmark[42:48]
                eye_openness = self._calculate_eye_openness(left_eye, right_eye)
                detailed_stats['eye_openness'] += eye_openness
                
                # Mouth movement
                mouth = face.landmark[48:68]
                mouth_openness = self._calculate_mouth_openness(mouth)
                detailed_stats['mouth_movement'] += mouth_openness
                
                # Smile detection
                if mouth_openness > 0.2:  # Threshold for smile
                    detailed_stats['smile_detected'] = True
                
                # Head movement (compare with previous frame)
                if prev_landmarks is not None:
                    head_movement = self._calculate_head_movement(face.landmark, prev_landmarks)
                    detailed_stats['head_movement'] += head_movement
                prev_landmarks = face.landmark
        
        cap.release()
        
        # Calculate averages
        if total_frames > 0:
            detailed_stats['eye_openness'] /= len(detailed_stats['frame_results'])
            detailed_stats['mouth_movement'] /= len(detailed_stats['frame_results'])
            detailed_stats['head_movement'] /= len(detailed_stats['frame_results'])
        
        # Determine overall result (at least 60% frames should be live)
        overall_result = (live_frames / total_frames) > 0.6
        
        return overall_result, detailed_stats
    
    def _calculate_eye_openness(self, left_eye, right_eye) -> float:
        """Calculate eye openness based on landmarks."""
        # Simple eye aspect ratio (EAR)
        def ear(eye):
            # Vertical distances
            v1 = np.linalg.norm(eye[1] - eye[5])
            v2 = np.linalg.norm(eye[2] - eye[4])
            
            # Horizontal distance
            h = np.linalg.norm(eye[0] - eye[3])
            
            return (v1 + v2) / (2.0 * h)
        
        left_ear = ear(left_eye)
        right_ear = ear(right_eye)
        return (left_ear + right_ear) / 2.0
    
    def _calculate_mouth_openness(self, mouth) -> float:
        """Calculate mouth openness based on landmarks."""
        # Vertical distances
        v1 = np.linalg.norm(mouth[2] - mouth[10])
        v2 = np.linalg.norm(mouth[4] - mouth[8])
        
        # Horizontal distance
        h = np.linalg.norm(mouth[0] - mouth[6])
        
        return (v1 + v2) / (2.0 * h)
    
    def _calculate_head_movement(self, current_landmarks, prev_landmarks) -> float:
        """Calculate head movement between frames."""
        # Calculate average movement of all landmarks
        movement = np.mean(np.linalg.norm(current_landmarks - prev_landmarks, axis=1))
        return movement