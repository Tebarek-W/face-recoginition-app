// components/DepartmentHead/dialogs/AddStudentDialog/StepLivenessVerification.jsx
import React from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  CircularProgress
} from '@mui/material';
import { VerifiedUser } from '@mui/icons-material';
import LivenessCameraBox from './LivenessCameraBox';
import useLivenessDetection from './useLivenessDetection';

const StepLivenessVerification = ({
  livenessData,
  setLivenessData,
  onComplete,
  isVerifying
}) => {
  const {
    currentLivenessStep,
    captureProgress,
    cameraReady,
    startCurrentAction,
    allLivenessStepsCompleted,
    LivenessInstructions,
    webcamRef
  } = useLivenessDetection(livenessData, setLivenessData);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        p: 2
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        Liveness Verification
      </Typography>

      <Typography
        variant="body1"
        sx={{ mb: 3, textAlign: 'center', fontWeight: 500 }}
      >
        {LivenessInstructions[currentLivenessStep]}
      </Typography>

      <LivenessCameraBox
        cameraReady={cameraReady}
        captureProgress={captureProgress}
        webcamRef={webcamRef}
      />

      <Grid container spacing={2} sx={{ mb: 3, maxWidth: 300 }}>
        {Object.entries(livenessData).map(([key, value]) => (
          <Grid item xs={4} key={key}>
            <Box
              sx={{
                width: '60px',
                height: '60px',
                borderRadius: '4px',
                border: '1px solid',
                borderColor: value ? 'success.main' : 'divider',
                overflow: 'hidden',
                position: 'relative',
                bgcolor: value ? 'transparent' : 'background.paper'
              }}
            >
              {value ? (
                <Box
                  component="img"
                  src={value}
                  alt={`${key} snapshot`}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    color: 'text.secondary',
                    textAlign: 'center',
                    px: 0.5
                  }}
                >
                  <Typography variant="caption">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </Typography>
                </Box>
              )}

              {value && (
                <VerifiedUser
                  color="success"
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    fontSize: '16px',
                    bgcolor: 'background.paper',
                    borderRadius: '50%'
                  }}
                />
              )}
            </Box>
          </Grid>
        ))}
      </Grid>

      {!allLivenessStepsCompleted() ? (
        <Button
          variant="contained"
          onClick={startCurrentAction}
          size="large"
          sx={{ width: 200 }}
          disabled={!cameraReady || captureProgress > 0}
        >
          {captureProgress > 0 ? 'Capturing...' : 'Start Verification'}
        </Button>
      ) : (
        <Button
          variant="contained"
          onClick={onComplete}
          size="large"
          sx={{ width: 200 }}
          disabled={isVerifying}
        >
          {isVerifying ? <CircularProgress size={24} /> : 'Complete Verification'}
        </Button>
      )}
    </Box>
  );
};

export default StepLivenessVerification;
