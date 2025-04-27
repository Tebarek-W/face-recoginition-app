// src/pages/InstructorPage.jsx
import React, { useState } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Modal } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie } from 'recharts'; // For analytics charts
import { useNavigate } from 'react-router-dom';

const InstructorPage = () => {
  const navigate = useNavigate();
  const [attendancePolicies, setAttendancePolicies] = useState({
    lateTolerance: 10, // in minutes
    minAttendancePercentage: 75, // in percentage
  });
  const [isTracking, setIsTracking] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState([
    { id: 1, name: 'John Doe', status: 'Present', time: '09:00 AM' },
    { id: 2, name: 'Jane Smith', status: 'Late', time: '09:05 AM' },
    { id: 3, name: 'Alice Johnson', status: 'Absent', time: '--' },
  ]);
  const [classSchedule, setClassSchedule] = useState([
    { day: 'Monday', time: '09:00 AM - 11:00 AM', subject: 'Mathematics' },
    { day: 'Wednesday', time: '09:00 AM - 11:00 AM', subject: 'Physics' },
    { day: 'Friday', time: '09:00 AM - 11:00 AM', subject: 'Chemistry' },
  ]);
  const [openPolicyModal, setOpenPolicyModal] = useState(false);

  const handleLogout = () => {
    // Perform logout logic here
    navigate('/login');
  };

  const handleSetPolicies = () => {
    setOpenPolicyModal(true);
  };

  const handleSavePolicies = () => {
    // Save policies logic here
    setOpenPolicyModal(false);
  };

  const handleStartTracking = () => {
    setIsTracking(true);
    // Start attendance tracking logic here
  };

  const handleStopTracking = () => {
    setIsTracking(false);
    // Stop attendance tracking logic here
  };

  // Sample data for attendance analytics
  const attendanceData = [
    { name: 'Present', value: 20 },
    { name: 'Late', value: 5 },
    { name: 'Absent', value: 3 },
  ];

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: 'calc(100vh - 128px)', // Account for Navbar and Footer height
        padding: 3,
        backgroundColor: '#f5f5f5', // Light background for contrast
      }}
    >
      <Typography variant="h4" gutterBottom>
        Instructor Dashboard
      </Typography>


      {/* Set Attendance Policies */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Attendance Policies
        </Typography>
        <Button variant="outlined" onClick={handleSetPolicies}>
          Set Policies
        </Button>
        <Modal
          open={openPolicyModal}
          onClose={() => setOpenPolicyModal(false)}
          aria-labelledby="policy-modal-title"
          aria-describedby="policy-modal-description"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" id="policy-modal-title" gutterBottom>
              Set Attendance Policies
            </Typography>
            <TextField
              label="Late Tolerance (minutes)"
              type="number"
              value={attendancePolicies.lateTolerance}
              onChange={(e) =>
                setAttendancePolicies({
                  ...attendancePolicies,
                  lateTolerance: e.target.value,
                })
              }
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Minimum Attendance Percentage"
              type="number"
              value={attendancePolicies.minAttendancePercentage}
              onChange={(e) =>
                setAttendancePolicies({
                  ...attendancePolicies,
                  minAttendancePercentage: e.target.value,
                })
              }
              fullWidth
              sx={{ mb: 2 }}
            />
            <Button variant="contained" onClick={handleSavePolicies}>
              Save Policies
            </Button>
          </Box>
        </Modal>
      </Box>

      {/* Initiate/Cease Attendance Tracking */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Attendance Tracking
        </Typography>
        {isTracking ? (
          <Button variant="contained" color="error" onClick={handleStopTracking}>
            Stop Tracking
          </Button>
        ) : (
          <Button variant="contained" color="primary" onClick={handleStartTracking}>
            Start Tracking
          </Button>
        )}
      </Box>

      {/* View Student Attendance Records */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Student Attendance Records
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attendanceRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.id}</TableCell>
                  <TableCell>{record.name}</TableCell>
                  <TableCell>{record.status}</TableCell>
                  <TableCell>{record.time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* View Class Schedule */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Class Schedule
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Day</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Subject</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {classSchedule.map((schedule, index) => (
                <TableRow key={index}>
                  <TableCell>{schedule.day}</TableCell>
                  <TableCell>{schedule.time}</TableCell>
                  <TableCell>{schedule.subject}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* View Attendance Analytics */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Attendance Analytics
        </Typography>
        <Box sx={{ display: 'flex', gap: 4 }}>
          <Paper sx={{ p: 2, flex: 1 }}>
            <Typography variant="subtitle1" gutterBottom>
              Attendance Distribution
            </Typography>
            <BarChart width={400} height={300} data={attendanceData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </Paper>
          <Paper sx={{ p: 2, flex: 1 }}>
            <Typography variant="subtitle1" gutterBottom>
              Attendance Percentage
            </Typography>
            <PieChart width={400} height={300}>
              <Pie
                data={attendanceData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#82ca9d"
                label
              />
              <Tooltip />
            </PieChart>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default InstructorPage;