import React from 'react';
import { Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const ViewSchedulePage = () => {
  const schedules = [
    { course: 'Math', schedule: 'Mon 10:00 AM - 12:00 PM' },
    { course: 'Science', schedule: 'Tue 1:00 PM - 3:00 PM' },
    { course: 'History', schedule: 'Wed 9:00 AM - 11:00 AM' },
  ];

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        View Class Schedule
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Course</TableCell>
              <TableCell>Schedule</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schedules.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.course}</TableCell>
                <TableCell>{row.schedule}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ViewSchedulePage;