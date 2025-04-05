import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  CardHeader, 
  Grid, 
  Paper, 
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import AttendanceRulesDialog from './dialogs/AttendanceRulesDialog';
import AttendanceChart from './shared/AttendanceChart';
import useAttendance from '../../hooks/useAttendance';

const AttendanceManagement = () => {
  const [openRulesDialog, setOpenRulesDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { 
    rules, 
    analytics, 
    loading, 
    error, 
    updateRules,
    refetch
  } = useAttendance();

  const handleUpdateRules = async (newRules) => {
    try {
      const success = await updateRules(newRules);
      if (success) {
        setSuccessMessage('Attendance rules updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
        setOpenRulesDialog(false);
        refetch(); // Refresh data after successful update
      }
    } catch (err) {
      // Error is already handled in the useAttendance hook
    }
  };

  return (
    <>
      <Card>
        <CardHeader
          title="Attendance Rules & Analytics"
          titleTypographyProps={{ variant: 'h5', fontWeight: 600 }}
          action={
            <Button
              variant="contained"
              onClick={() => setOpenRulesDialog(true)}
              disabled={loading}
            >
              Configure Rules
            </Button>
          }
        />
        <CardContent>
          {loading && !rules ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          ) : null}

          {successMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {successMessage}
            </Alert>
          )}

          {rules && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Current Rules
                </Typography>
                <Paper sx={{ p: 2, mb: 3 }}>
                  <Box mb={2}>
                    <Typography>
                      <strong>Minimum Attendance:</strong> {rules.minimumAttendance}% to pass
                    </Typography>
                  </Box>
                  <Box mb={2}>
                    <Typography>
                      <strong>Late Policy:</strong> {rules.latePolicy} lates = 1 absence
                    </Typography>
                  </Box>
                  <Box mb={2}>
                    <Typography>
                      <strong>Notification Threshold:</strong> Email sent at {rules.notificationThreshold}% attendance
                    </Typography>
                  </Box>
                  <Box>
                    <Typography>
                      <strong>Grace Period:</strong> {rules.gracePeriod} minutes
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Attendance Statistics
                </Typography>
                {analytics ? (
                  <AttendanceChart 
                    type="bar" 
                    data={analytics}
                    height={200}
                    showLegend={false}
                  />
                ) : (
                  <Box textAlign="center" py={4}>
                    <Typography>No attendance data available</Typography>
                  </Box>
                )}
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>

      {rules && (
        <AttendanceRulesDialog 
          open={openRulesDialog} 
          onClose={() => setOpenRulesDialog(false)} 
          onSubmit={handleUpdateRules} 
          initialRules={rules}
          isLoading={loading}
        />
      )}
    </>
  );
};

export default AttendanceManagement;