// components/DepartmentHead/dialogs/AddStudentDialog/StepAccountSetup.jsx
import React from 'react';
import { Box, TextField } from '@mui/material';

const StepAccountSetup = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      gap: 3,
      maxWidth: '500px',
      margin: '0 auto',
      width: '100%',
      p: 2
    }}>
      <TextField
        name="email"
        label="Email Address"
        type="email"
        value={formData.email}
        onChange={handleChange}
        fullWidth
        required
        variant="outlined"
      />
      
      <TextField
        name="password"
        label="Password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        fullWidth
        required
        variant="outlined"
        helperText="Minimum 8 characters with at least one number and special character"
      />
    </Box>
  );
};

export default StepAccountSetup;