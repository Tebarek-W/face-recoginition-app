import React, { useState } from 'react';
import { Typography, Box, Button, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const ManageInstructorsPage = () => {
  const [courses, setCourses] = useState(['Math', 'Science', 'History']);
  const [instructors, setInstructors] = useState(['John Doe', 'Jane Smith']);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedInstructor, setSelectedInstructor] = useState('');

  const handleAssign = () => {
    alert(`Assigned ${selectedInstructor} to ${selectedCourse}`);
    setSelectedCourse('');
    setSelectedInstructor('');
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Manage Instructors
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
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
        <FormControl fullWidth>
          <InputLabel>Instructor</InputLabel>
          <Select
            value={selectedInstructor}
            onChange={(e) => setSelectedInstructor(e.target.value)}
            label="Instructor"
          >
            {instructors.map((instructor, index) => (
              <MenuItem key={index} value={instructor}>
                {instructor}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" onClick={handleAssign}>
          Assign
        </Button>
      </Box>
    </Box>
  );
};

export default ManageInstructorsPage;