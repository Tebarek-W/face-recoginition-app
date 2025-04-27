import { useState, useRef, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import { LivenessSteps, LivenessInstructions } from './livenessConstants';

const useLivenessDetection = (livenessData, setLivenessData) => {
  const [currentLivenessStep, setCurrentLivenessStep] = useState(LivenessSteps.NEUTRAL);
  const [captureProgress, setCaptureProgress] = useState(0);
  const [cameraReady, setCameraReady] = useState(false);
  const webcamRef = useRef(null);
  const captureInterval = useRef(null);

  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
          faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
          faceapi.nets.faceExpressionNet.loadFromUri('/models')
        ]);
        setCameraReady(true);
      } catch (error) {
        console.error('Error loading face-api.js models:', error);
      }
    };

    loadModels();
  }, []);

  useEffect(() => {
    if (cameraReady) {
      setCurrentLivenessStep(LivenessSteps.NEUTRAL);
    }
  }, [cameraReady]);

  const startCaptureInterval = () => {
    stopCaptureInterval();
    let framesCaptured = 0;
    const totalFrames = 10;

    captureInterval.current = setInterval(async () => {
      if (!webcamRef.current?.video || webcamRef.current.video.readyState !== 4) {
        console.warn('Webcam not ready');
        return;
      }

      framesCaptured++;
      setCaptureProgress((framesCaptured / totalFrames) * 100);

      if (framesCaptured >= totalFrames) {
        stopCaptureInterval();
        await captureFrame();

        const nextStep = getNextLivenessStep(currentLivenessStep);
        if (nextStep) {
          setCurrentLivenessStep(nextStep);
        }
        setCaptureProgress(0);
      }
    }, 300);
  };

  const stopCaptureInterval = () => {
    if (captureInterval.current) {
      clearInterval(captureInterval.current);
      captureInterval.current = null;
    }
  };

  const getNextLivenessStep = (currentStep) => {
    const steps = Object.values(LivenessSteps);
    const index = steps.indexOf(currentStep);
    return index >= 0 && index < steps.length - 1 ? steps[index + 1] : null;
  };

  const captureFrame = async () => {
    const video = webcamRef.current?.video;
    if (!video || video.readyState !== 4) {
      console.warn('Webcam not ready');
      return;
    }

    try {
      const detections = await faceapi
        .detectAllFaces(video)
        .withFaceLandmarks()
        .withFaceExpressions();

      if (detections.length === 0) {
        console.warn('No face detected');
        return;
      }

      const { expressions } = detections[0];

      if (currentLivenessStep === LivenessSteps.SMILE && expressions.happy > 0.6) {
        console.log('Smile verified');
      }

      if (currentLivenessStep === LivenessSteps.BLINK) {
        console.log('Assuming blink occurred (needs custom logic)');
      }

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageSrc = canvas.toDataURL('image/png');

      if (imageSrc) {
        setLivenessData(prev => ({
          ...prev,
          [currentLivenessStep]: imageSrc,
          ...(currentLivenessStep === LivenessSteps.NEUTRAL ? { selfie: imageSrc } : {})
        }));
        console.log(`Captured image for ${currentLivenessStep}`);
      }

    } catch (error) {
      console.error('Face detection failed:', error);
    }
  };

  const startCurrentAction = () => {
    if (!cameraReady) {
      console.warn('Camera not ready');
      return;
    }
    startCaptureInterval();
  };

  const allLivenessStepsCompleted = () => {
    return Object.values(LivenessSteps).every(step => !!livenessData[step]);
  };

  return {
    currentLivenessStep,
    captureProgress,
    cameraReady,
    startCurrentAction,
    allLivenessStepsCompleted,
    LivenessInstructions,
    webcamRef
  };
};

export default useLivenessDetection;
