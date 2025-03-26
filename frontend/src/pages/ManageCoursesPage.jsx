import React, { useState } from 'react';
import { Typography, Box, Button, TextField, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';

const ManageCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState('');

  const handleAddCourse = () => {
    if (newCourse.trim()) {
      setCourses([...courses, { id: Date.now(), name: newCourse }]);
      setNewCourse('');
    }
  };

  const handleDeleteCourse = (id) => {
    setCourses(courses.filter((course) => course.id !== id));
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Manage Courses
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label="New Course"
          value={newCourse}
          onChange={(e) => setNewCourse(e.target.value)}
          fullWidth
        />
        <Button variant="contained" onClick={handleAddCourse} startIcon={<Add />}>
          Add Course
        </Button>
      </Box>
      <List>
        {courses.map((course) => (
          <ListItem key={course.id} secondaryAction={
            <IconButton edge="end" onClick={() => handleDeleteCourse(course.id)}>
              <Delete />
            </IconButton>
          }>
            <ListItemText primary={course.name} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ManageCoursesPage;