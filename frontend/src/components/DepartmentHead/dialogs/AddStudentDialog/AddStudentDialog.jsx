import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stepper,
  Step,
  StepLabel,
  Box,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import StepPersonalDetails from './StepPersonalDetails';
import StepAccountSetup from './StepAccountSetup';
import StepLivenessVerification from './StepLivenessVerification';
import { useStudents } from '../../../../hooks/useStudents';
import LivenessCameraBox from './LivenessCameraBox';  // Import the LivenessCameraBox component

const STEPS = ['Personal Details', 'Account Setup', 'Liveness Verification'];

const AddStudentDialog = ({ open, onClose, onSuccess }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const { registerStudent, isRegistering, verifyLiveness, isVerifying } = useStudents();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    gender: 'M',
    date_of_birth: null,
    email: '',
    password: ''
  });

  const [livenessData, setLivenessData] = useState({
    neutral: null,
    blink: null,
    smile: null,
    turnLeft: null,
    turnRight: null
  });

  const webcamRef = useRef(null); // Reference to the webcam for capturing frames

  const handleCaptureFrame = (frameData) => {
    // You can store or process the frame data as per your needs (e.g., saving images or extracting features)
    setLivenessData((prevState) => ({
      ...prevState,
      neutral: frameData.neutral || prevState.neutral,
      blink: frameData.blink || prevState.blink,
      smile: frameData.smile || prevState.smile,
      turnLeft: frameData.turnLeft || prevState.turnLeft,
      turnRight: frameData.turnRight || prevState.turnRight
    }));
  };

  const handleSubmit = async () => {
    setError(null);
    try {
      // First register the student
      const student = await registerStudent({
        studentData: formData,
        livenessData
      });
      setRegistrationSuccess(true);
      
      // Then verify liveness with video or image frames
      await verifyLiveness({ 
        studentId: student.student_id, // Use the actual student ID from registration
        livenessData 
      });
      
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Registration failed. Please try again.');
    }
  };

  const handleNext = () => {
    if (activeStep === STEPS.length - 1) {
      handleSubmit();
    } else {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (registrationSuccess) {
      setRegistrationSuccess(false);
    }
    setActiveStep(prev => prev - 1);
  };

  const isStepValid = () => {
    if (activeStep === 0) {
      return formData.first_name && formData.last_name && formData.gender && formData.date_of_birth;
    }
    if (activeStep === 1) {
      return formData.email && formData.password;
    }
    return true;
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          minHeight: '500px',
          maxHeight: '90vh',
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{ 
        bgcolor: 'background.paper',
        color: 'text.primary',
        py: 2,
        borderBottom: '1px solid',
        borderColor: 'divider',
        textAlign: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 1
      }}>
        <Typography fontWeight={600}>
          New Student Registration
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ 
        py: 2,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <Stepper 
          activeStep={activeStep} 
          sx={{ 
            px: 2,
            py: 2,
            '& .MuiStepLabel-label': {
              fontWeight: 500,
              fontSize: '0.875rem'
            }
          }}
        >
          {STEPS.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mx: 2,
              my: 1
            }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        <Box sx={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          px: 2,
          pb: 2
        }}>
          {activeStep === 0 && (
            <StepPersonalDetails 
              formData={formData} 
              setFormData={setFormData} 
            />
          )}
          {activeStep === 1 && (
            <StepAccountSetup 
              formData={formData} 
              setFormData={setFormData} 
            />
          )}
          {activeStep === 2 && (
            <StepLivenessVerification 
              livenessData={livenessData}
              setLivenessData={setLivenessData}
              onComplete={handleSubmit}
              isVerifying={isVerifying || isRegistering}
            >
              {/* Liveness Camera Box is shown here */}
              <LivenessCameraBox 
                cameraReady={true} 
                captureProgress={false} 
                webcamRef={webcamRef}
                onCaptureFrame={handleCaptureFrame} // Pass capture frame handler
              />
            </StepLivenessVerification>
          )}
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ 
        px: 2, 
        py: 1, 
        borderTop: '1px solid',
        borderColor: 'divider',
        justifyContent: 'space-between',
        position: 'sticky',
        bottom: 0,
        bgcolor: 'background.paper',
        zIndex: 1
      }}>
        <Button 
          onClick={handleBack}
          disabled={(activeStep === 0) || isRegistering || isVerifying}
          variant="text"
          size="medium"
          sx={{ minWidth: '100px' }}
        >
          Back
        </Button>
        
        {activeStep !== 2 ? (
          <Button
            onClick={handleNext}
            variant="contained"
            size="medium"
            disabled={!isStepValid() || isRegistering || isVerifying}
            sx={{ minWidth: '100px' }}
          >
            Continue
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleSubmit}
            size="medium"
            disabled={isRegistering || isVerifying}
            endIcon={(isRegistering || isVerifying) ? <CircularProgress size={20} /> : null}
            sx={{ minWidth: '100px' }}
          >
            {(isRegistering || isVerifying) ? 'Processing...' : 'Complete Registration'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AddStudentDialog;
