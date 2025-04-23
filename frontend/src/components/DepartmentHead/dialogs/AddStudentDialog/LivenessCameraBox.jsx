// components/DepartmentHead/dialogs/AddStudentDialog/LivenessCameraBox.jsx
import React from 'react';
import Webcam from 'react-webcam';
import { Box, CircularProgress } from '@mui/material';

const LivenessCameraBox = ({ cameraReady, captureProgress, webcamRef }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '260px',
        height: '260px',
        borderRadius: '8px',
        overflow: 'hidden',
        border: '2px solid',
        borderColor: 'divider',
        mb: 2,
        bgcolor: 'background.default'
      }}
    >
      {cameraReady ? (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{
              facingMode: 'user',
              width: 500,
              height: 500
            }}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            mirrored={true}
          />
          {captureProgress && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                bgcolor: 'rgba(0, 0, 0, 0.4)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <CircularProgress color="inherit" />
            </Box>
          )}
        </>
      ) : (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%'
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export default LivenessCameraBox;
