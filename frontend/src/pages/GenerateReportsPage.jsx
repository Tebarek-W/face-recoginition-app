import React from 'react';
import { Typography, Box } from '@mui/material';

const GenerateReportsPage = () => {
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Generate Attendance Reports
      </Typography>
      <Typography variant="body1">
        Generate and download attendance reports.
      </Typography>
    </Box>
  );
};

export default GenerateReportsPage;