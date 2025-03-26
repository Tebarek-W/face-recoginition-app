import React from 'react';
import { List, ListItem, ListItemText, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';

const CourseList = ({ courses, onDelete }) => {
  return (
    <List>
      {courses.map((course) => (
        <ListItem key={course.id} secondaryAction={
          <IconButton edge="end" onClick={() => onDelete(course.id)}>
            <Delete />
          </IconButton>
        }>
          <ListItemText primary={course.name} />
        </ListItem>
      ))}
    </List>
  );
};

export default CourseList;