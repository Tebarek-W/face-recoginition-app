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
import LivenessCameraBox from './LivenessCameraBox';

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
    year_of_study: 1,
    email: '',
    password: '',
    student_id: ''
  });

  const [livenessData, setLivenessData] = useState({
    neutral: null,
    blink: null,
    smile: null,
    turnLeft: null,
    turnRight: null
  });

  const webcamRef = useRef(null);

  const handleCaptureFrame = (frameData) => {
    setLivenessData((prevState) => ({
      ...prevState,
      neutral: frameData.neutral || prevState.neutral,
      blink: frameData.blink || prevState.blink,
      smile: frameData.smile || prevState.smile,
      turnLeft: frameData.turnLeft || prevState.turnLeft,
      turnRight: frameData.turnRight || prevState.turnRight
    }));
  };

  const handleRegisterStudent = async () => {
    setError(null);
    try {
      const response = await registerStudent({
        studentData: formData
      });
      
      setFormData(prev => ({
        ...prev,
        student_id: response.student_id
      }));
      
      setRegistrationSuccess(true);
      setActiveStep(2); // Move directly to Liveness Verification after registration
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Registration failed. Please try again.');
    }
  };

  const handleVerifyLiveness = async () => {
    setError(null);
    try {
      await verifyLiveness({ 
        studentId: formData.student_id,
        livenessData
      });

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Liveness verification failed. Please try again.');
    }
  };

  const handleNext = () => {
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const isStepValid = () => {
    switch (activeStep) {
      case 0:
        return formData.first_name && formData.last_name && formData.gender && formData.date_of_birth;
      case 1:
        return formData.email && formData.password;
      case 2:
        return livenessData.neutral && livenessData.blink && livenessData.smile && 
               livenessData.turnLeft && livenessData.turnRight;
      default:
        return true;
    }
  };

  const getStepContent = () => {
    switch (activeStep) {
      case 0:
        return <StepPersonalDetails formData={formData} setFormData={setFormData} />;
      case 1:
        return <StepAccountSetup formData={formData} setFormData={setFormData} />;
      case 2:
        return (
          <StepLivenessVerification 
            livenessData={livenessData}
            setLivenessData={setLivenessData}
            isVerifying={isVerifying}
          >
            <LivenessCameraBox 
              cameraReady={true} 
              captureProgress={false} 
              webcamRef={webcamRef}
              onCaptureFrame={handleCaptureFrame}
            />
          </StepLivenessVerification>
        );
      default:
        return null;
    }
  };

  const getActionButton = () => {
    switch (activeStep) {
      case 0:
        return (
          <Button
            onClick={handleNext}
            variant="contained"
            size="medium"
            disabled={!isStepValid()}
            sx={{ minWidth: '100px' }}
          >
            Continue
          </Button>
        );
      case 1:
        return (
          <Button
            onClick={handleRegisterStudent}
            variant="contained"
            size="medium"
            disabled={!isStepValid() || isRegistering}
            endIcon={isRegistering ? <CircularProgress size={20} /> : null}
            sx={{ minWidth: '100px' }}
          >
            {isRegistering ? 'Registering...' : 'Register'}
          </Button>
        );
      case 2:
        return (
          <Button
            onClick={handleVerifyLiveness}
            variant="contained"
            size="medium"
            disabled={!isStepValid() || isVerifying}
            endIcon={isVerifying ? <CircularProgress size={20} /> : null}
            sx={{ minWidth: '100px' }}
          >
            {isVerifying ? 'Verifying...' : 'Complete Registration'}
          </Button>
        );
      default:
        return null;
    }
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
          {getStepContent()}
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
          disabled={activeStep === 0 || isRegistering || isVerifying}
          variant="text"
          size="medium"
          sx={{ minWidth: '100px' }}
        >
          Back
        </Button>
        
        {getActionButton()}
      </DialogActions>
    </Dialog>
  );
};

export default AddStudentDialog;