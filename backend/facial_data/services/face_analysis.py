import os
import cv2
import numpy as np
import onnxruntime as ort
from insightface.app import FaceAnalysis
from django.conf import settings
from typing import Tuple, List, Dict

class FaceAnalysisService:
    def __init__(self):
        self.model_config = settings.INSIGHTFACE_MODEL_CONFIG
        self.face_analyzer = self._init_face_analyzer()
        self.liveness_model = self._init_liveness_model()

    def _init_face_analyzer(self) -> FaceAnalysis:
        """Initialize the InsightFace face analyzer"""
        app = FaceAnalysis(
            name=self.model_config['model_name'],
            root=self.model_config['root_path'],
            providers=self.model_config['providers']
        )
        app.prepare(ctx_id=0, det_size=(640, 640))
        return app

    def _init_liveness_model(self) -> ort.InferenceSession:
        """Initialize the anti-spoofing model"""
        model_path = os.path.join(
            self.model_config['root_path'],
            self.model_config['model_name'],
            'antispoofing.onnx'
        )
        return ort.InferenceSession(model_path, providers=self.model_config['providers'])

    def detect_faces(self, image: np.ndarray) -> List[Dict]:
        """Detect faces in an image"""
        return self.face_analyzer.get(image)

    def verify_liveness(self, face_image: np.ndarray) -> Tuple[bool, float]:
        """
        Verify if a face is real or spoof
        Returns: (is_real, confidence_score)
        """
        # Preprocess image
        face_image = cv2.resize(face_image, (80, 80))
        face_image = face_image.astype(np.float32) / 255.0
        face_image = np.transpose(face_image, (2, 0, 1))
        face_image = np.expand_dims(face_image, axis=0)

        # Run inference
        input_name = self.liveness_model.get_inputs()[0].name
        output_name = self.liveness_model.get_outputs()[0].name
        pred = self.liveness_model.run([output_name], {input_name: face_image})[0]
        
        confidence = float(pred[0][0])
        is_real = confidence > 0.5  # Adjust threshold as needed
        
        return is_real, confidence

    def extract_embeddings(self, face_image: np.ndarray) -> np.ndarray:
        """Extract face embeddings"""
        faces = self.face_analyzer.get(face_image)
        if faces:
            return faces[0].embedding
        return None