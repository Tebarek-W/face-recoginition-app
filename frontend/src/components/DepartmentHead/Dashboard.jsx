import React from 'react';
import { Grid } from '@mui/material';
import SummaryCard from './shared/SummaryCard';
import AttendanceChart from './shared/AttendanceChart';
import QuickActions from './shared/QuickActions';

const Dashboard = () => {
  const summaryData = [
    { title: 'Total Courses', value: '12', icon: 'school', color: 'primary' },
    { title: 'Total Students', value: '450', icon: 'people', color: 'secondary' },
    { title: 'Total Instructors', value: '15', icon: 'assignment', color: 'success' },
    { title: 'Avg. Attendance', value: '87%', icon: 'calendar', color: 'warning' }
  ];

  return (
    <Grid container spacing={3}>
      {summaryData.map((item, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <SummaryCard {...item} />
        </Grid>
      ))}

      <Grid item xs={12} md={8}>
        <AttendanceChart 
          type="bar" 
          title="Attendance Analytics"
          data={[
            { name: 'Jan', present: 400, absent: 240, late: 100 },
            { name: 'Feb', present: 300, absent: 139, late: 80 },
            { name: 'Mar', present: 200, absent: 300, late: 120 },
            { name: 'Apr', present: 278, absent: 190, late: 90 },
            { name: 'May', present: 189, absent: 100, late: 50 },
            { name: 'Jun', present: 239, absent: 180, late: 70 },
          ]}
        />
      </Grid>
      
      <Grid item xs={12} md={4}>
        <AttendanceChart 
          type="pie" 
          title="Attendance Distribution"
          data={[
            { name: 'Present', value: 75 },
            { name: 'Absent', value: 15 },
            { name: 'Late', value: 10 }
          ]}
        />
      </Grid>

      <Grid item xs={12}>
        <QuickActions />
      </Grid>
    </Grid>
  );
};

export default Dashboard;