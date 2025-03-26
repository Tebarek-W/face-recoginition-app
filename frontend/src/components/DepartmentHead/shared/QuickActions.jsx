import React from 'react';
import { Grid, Button } from '@mui/material';
import {
  CalendarToday,
  People,
  School,
  Assignment,
  Schedule,
  Settings
} from '@mui/icons-material';

const actions = [
  { label: 'Students', icon: <People />, tab: 1 },
  { label: 'Courses', icon: <School />, tab: 2 },
  { label: 'Instructors', icon: <Assignment />, tab: 3 },
  { label: 'Attendance', icon: <CalendarToday />, tab: 4 },
  { label: 'Schedule', icon: <Schedule />, tab: 5 },
  { label: 'Settings', icon: <Settings />, tab: 6 }
];

const QuickActions = () => {
  return (
    <Grid container spacing={2}>
      {actions.map((action, index) => (
        <Grid item xs={6} sm={4} md={2} key={index}>
          <Button
            fullWidth
            variant="contained"
            startIcon={action.icon}
            onClick={() => {}}
            sx={{
              height: '100%',
              py: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              '& .MuiButton-startIcon': {
                margin: 0,
                mb: 1
              }
            }}
          >
            {action.label}
          </Button>
        </Grid>
      ))}
    </Grid>
  );
};

export default QuickActions;