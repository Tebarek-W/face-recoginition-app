import React, { useState } from 'react';
import { Typography, Box, Button, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const SetSchedulePage = () => {
  const [courses, setCourses] = useState(['Math', 'Science', 'History']);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [schedule, setSchedule] = useState('');

  const handleSaveSchedule = () => {
    alert(`Saved schedule for ${selectedCourse}: ${schedule}`);
    setSelectedCourse('');
    setSchedule('');
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Set Schedule
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
        <TextField
          label="Schedule"
          value={schedule}
          onChange={(e) => setSchedule(e.target.value)}
          fullWidth
        />
        <Button variant="contained" onClick={handleSaveSchedule}>
          Save Schedule
        </Button>
      </Box>
    </Box>
  );
};

export default SetSchedulePage;