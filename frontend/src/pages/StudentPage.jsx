import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardHeader, 
  Avatar, 
  IconButton, 
  Divider, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  LinearProgress,
  Badge,
  Chip,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { CircularProgress } from '@mui/material';
import {
  Today as TodayIcon,
  Schedule as ScheduleIcon,
  Face as FaceIcon,
  Notifications as NotificationsIcon,
  BarChart as BarChartIcon,
  CameraAlt as CameraAltIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock data - replace with real API calls
const attendanceData = [
  { name: 'Jan', attendance: 85 },
  { name: 'Feb', attendance: 92 },
  { name: 'Mar', attendance: 78 },
  { name: 'Apr', attendance: 88 },
  { name: 'May', attendance: 95 },
  { name: 'Jun', attendance: 90 },
];

const scheduleData = [
  { id: 1, course: 'Mathematics', time: '09:00 - 10:30', room: 'A101', date: '2023-07-20' },
  { id: 2, course: 'Physics', time: '11:00 - 12:30', room: 'B205', date: '2023-07-20' },
  { id: 3, course: 'Computer Science', time: '14:00 - 15:30', room: 'C302', date: '2023-07-21' },
];

const notifications = [
  { id: 1, message: 'Your attendance in Mathematics is below 75%', severity: 'warning', read: false },
  { id: 2, message: 'Physics class moved to room B207 tomorrow', severity: 'info', read: true },
  { id: 3, message: 'Facial recognition updated successfully', severity: 'success', read: true },
];

const attendanceHistory = [
  { id: 1, course: 'Mathematics', date: '2023-07-18', status: 'Present' },
  { id: 2, course: 'Physics', date: '2023-07-17', status: 'Present' },
  { id: 3, course: 'Computer Science', date: '2023-07-16', status: 'Absent' },
];

const StudentPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [openLivenessDialog, setOpenLivenessDialog] = useState(false);
  const [openAttendanceDialog, setOpenAttendanceDialog] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [attendanceMarked, setAttendanceMarked] = useState(false);

  const handleLivenessRegistration = () => {
    setOpenLivenessDialog(true);
    // In a real app, you would initialize camera here
    setTimeout(() => setCameraActive(true), 500);
  };

  const handleMarkAttendance = () => {
    setOpenAttendanceDialog(true);
    // In a real app, you would initialize camera here
    setTimeout(() => setCameraActive(true), 500);
  };

  const handleCloseDialog = () => {
    setOpenLivenessDialog(false);
    setOpenAttendanceDialog(false);
    setCameraActive(false);
    setAttendanceMarked(false);
  };

  const completeLivenessCheck = () => {
    // Mock completion
    setCameraActive(false);
    setTimeout(() => {
      handleCloseDialog();
      // Show success notification
    }, 1000);
  };

  const markAttendance = () => {
    // Mock attendance marking
    setCameraActive(false);
    setAttendanceMarked(true);
    setTimeout(() => {
      handleCloseDialog();
      // Show success notification
    }, 1500);
  };

  return (
    <Box sx={{ p: isMobile ? 1 : 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Student Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Attendance Analytics */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title="Attendance Analytics"
              avatar={
                <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                  <BarChartIcon />
                </Avatar>
              }
            />
            <CardContent>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="attendance" 
                      stroke={theme.palette.primary.main} 
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Your overall attendance: 87%
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={87} 
                  sx={{ height: 10, borderRadius: 5, mt: 1 }} 
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Class Schedules */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title="Upcoming Classes"
              avatar={
                <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>
                  <ScheduleIcon />
                </Avatar>
              }
              action={
                <Button size="small" color="primary">
                  View All
                </Button>
              }
            />
            <CardContent>
              <List>
                {scheduleData.map((item) => (
                  <React.Fragment key={item.id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: theme.palette.success.light }}>
                          <TodayIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={item.course}
                        secondary={`${item.date} | ${item.time} | ${item.room}`}
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Liveness-Check Registration */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title="Liveness-Check Registration"
              avatar={
                <Avatar sx={{ bgcolor: theme.palette.info.main }}>
                  <FaceIcon />
                </Avatar>
              }
            />
            <CardContent>
              <Typography variant="body1" paragraph>
                Register your facial data for attendance verification.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<CameraAltIcon />}
                onClick={handleLivenessRegistration}
                fullWidth
              >
                Register Now
              </Button>
              <Box sx={{ mt: 2 }}>
                <Chip
                  icon={<CheckCircleIcon />}
                  label="Registration Complete"
                  color="success"
                  variant="outlined"
                  sx={{ display: 'none' }} // Hide if not registered
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Facial Recognition Attendance */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title="Facial Recognition Attendance"
              avatar={
                <Avatar sx={{ bgcolor: theme.palette.warning.main }}>
                  <FaceIcon />
                </Avatar>
              }
            />
            <CardContent>
              <Typography variant="body1" paragraph>
                Mark your attendance using facial recognition.
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<CameraAltIcon />}
                onClick={handleMarkAttendance}
                fullWidth
              >
                Mark Attendance
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Notifications */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <NotificationsIcon sx={{ mr: 1 }} />
                  Notifications
                  <Badge 
                    badgeContent={notifications.filter(n => !n.read).length} 
                    color="error" 
                    sx={{ ml: 2 }}
                  />
                </Box>
              }
            />
            <CardContent>
              <List>
                {notifications.map((notification) => (
                  <ListItem
                    key={notification.id}
                    sx={{
                      bgcolor: notification.read ? 'inherit' : theme.palette.action.hover,
                      borderRadius: 1
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ 
                        bgcolor: notification.severity === 'warning' 
                          ? theme.palette.warning.main 
                          : notification.severity === 'info'
                            ? theme.palette.info.main
                            : theme.palette.success.main
                      }}>
                        <WarningIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={notification.message}
                      secondary={notification.read ? 'Read' : 'New'}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Attendance History and Threshold Alerts */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title="Attendance History"
              avatar={
                <Avatar sx={{ bgcolor: theme.palette.error.main }}>
                  <TodayIcon />
                </Avatar>
              }
              action={
                <Chip
                  icon={<WarningIcon />}
                  label="Low Attendance"
                  color="error"
                  variant="outlined"
                />
              }
            />
            <CardContent>
              <List>
                {attendanceHistory.map((record) => (
                  <React.Fragment key={record.id}>
                    <ListItem>
                      <ListItemText
                        primary={`${record.course} - ${record.date}`}
                        secondary={record.status}
                      />
                      <Chip
                        label={record.status}
                        color={record.status === 'Present' ? 'success' : 'error'}
                        variant="outlined"
                        size="small"
                      />
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="error">
                  Warning: Your attendance in Mathematics is below 75%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Liveness Check Dialog */}
      <Dialog
        open={openLivenessDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <FaceIcon sx={{ mr: 1 }} />
            Liveness Check Registration
            <Box flexGrow={1} />
            <IconButton onClick={handleCloseDialog}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {cameraActive ? (
            <Box
              sx={{
                height: 400,
                bgcolor: 'background.paper',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                border: `1px dashed ${theme.palette.divider}`,
                borderRadius: 1,
                mb: 2
              }}
            >
              <Typography variant="h6" color="text.secondary">
                Camera Feed Would Appear Here
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                (In a real implementation, this would show the camera feed)
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                height: 400,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <CircularProgress size={60} />
              <Typography variant="h6" sx={{ mt: 2 }}>
                Initializing Camera...
              </Typography>
            </Box>
          )}
          <Typography paragraph>
            Please follow these instructions:
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="1. Position your face in the frame" />
            </ListItem>
            <ListItem>
              <ListItemText primary="2. Make sure there's good lighting" />
            </ListItem>
            <ListItem>
              <ListItemText primary="3. Follow the on-screen prompts" />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={completeLivenessCheck}
            variant="contained"
            color="primary"
            disabled={!cameraActive}
          >
            Complete Registration
          </Button>
        </DialogActions>
      </Dialog>

      {/* Attendance Marking Dialog */}
      <Dialog
        open={openAttendanceDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <FaceIcon sx={{ mr: 1 }} />
            Mark Attendance
            <Box flexGrow={1} />
            <IconButton onClick={handleCloseDialog}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {attendanceMarked ? (
            <Box
              sx={{
                height: 400,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <CheckCircleIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
              <Typography variant="h5">
                Attendance Marked Successfully!
              </Typography>
            </Box>
          ) : cameraActive ? (
            <>
              <Box
                sx={{
                  height: 400,
                  bgcolor: 'background.paper',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  border: `1px dashed ${theme.palette.divider}`,
                  borderRadius: 1,
                  mb: 2
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  Camera Feed Would Appear Here
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  (In a real implementation, this would show the camera feed)
                </Typography>
              </Box>
              <Typography paragraph>
                Please look directly at the camera to mark your attendance.
              </Typography>
            </>
          ) : (
            <Box
              sx={{
                height: 400,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <CircularProgress size={60} />
              <Typography variant="h6" sx={{ mt: 2 }}>
                Initializing Camera...
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={markAttendance}
            variant="contained"
            color="primary"
            disabled={!cameraActive || attendanceMarked}
          >
            {attendanceMarked ? 'Completed' : 'Mark Attendance'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentPage;