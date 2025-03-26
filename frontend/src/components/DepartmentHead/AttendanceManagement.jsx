import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  CardHeader, 
  Grid, 
  Paper, 
  Typography 
} from '@mui/material';
import AttendanceRulesDialog from './dialogs/AttendanceRulesDialog';
import AttendanceChart from './shared/AttendanceChart';
import  useAttendance  from '../../hooks/useAttendance';

const AttendanceManagement = () => {
  const [openRulesDialog, setOpenRulesDialog] = useState(false);
  const { rules, analytics, loading, error, updateRules } = useAttendance();

  const handleUpdateRules = (newRules) => {
    updateRules(newRules);
    setOpenRulesDialog(false);
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
            >
              Configure Rules
            </Button>
          }
        />
        <CardContent>
          {loading ? (
            <Box textAlign="center" py={4}>
              <Typography>Loading attendance data...</Typography>
            </Box>
          ) : error ? (
            <Box textAlign="center" py={4}>
              <Typography color="error">Error: {error}</Typography>
            </Box>
          ) : (
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
                <AttendanceChart 
                  type="bar" 
                  data={analytics}
                  height={200}
                  showLegend={false}
                />
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>

      <AttendanceRulesDialog 
        open={openRulesDialog} 
        onClose={() => setOpenRulesDialog(false)} 
        onSubmit={handleUpdateRules} 
        initialRules={rules}
      />
    </>
  );
};

export default AttendanceManagement;