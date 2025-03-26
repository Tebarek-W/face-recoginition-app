import React, { useState } from 'react';
import { Typography, Box, Button, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const EnrollStudentsPage = () => {
  const [courses, setCourses] = useState(['Math', 'Science', 'History']);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [studentName, setStudentName] = useState('');

  const handleEnroll = () => {
    alert(`Enrolled ${studentName} in ${selectedCourse}`);
    setStudentName('');
    setSelectedCourse('');
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Enroll Students
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label="Student Name"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          fullWidth
        />
        <FormControl fullWidth>
          <InputLabel>Course</InputLabel>
          <Select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            label="Course"
          >
            {courses.map((course, index) => (
              <MenuItem key={index} value={course}>
                {course}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" onClick={handleEnroll}>
          Enroll
        </Button>
      </Box>
    </Box>
  );
};

export default EnrollStudentsPage;