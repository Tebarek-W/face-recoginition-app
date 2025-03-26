import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  CardHeader, 
  Grid, 
  TextField,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import useDepartment from '../../hooks/useDepartment';

const Settings = () => {
  const { department, loading, error, updateDepartment } = useDepartment();
  const [formData, setFormData] = useState({
    departmentName: '',
    departmentHead: '',
    contactEmail: '',
    academicYear: '',
    semester: ''
  });

  // Initialize form with department data
  useEffect(() => {
    if (department) {
      setFormData({
        departmentName: department.name || '',
        departmentHead: department.head || '',
        contactEmail: department.email || '',
        academicYear: department.academicYear || '',
        semester: department.semester || ''
      });
    }
  }, [department]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      await updateDepartment({
        name: formData.departmentName,
        head: formData.departmentHead,
        email: formData.contactEmail,
        academicYear: formData.academicYear,
        semester: formData.semester
      });
    } catch (err) {
      // Error is already handled by the hook
    }
  };

  return (
    <Card>
      <CardHeader 
        title="Department Settings" 
        titleTypographyProps={{ variant: 'h5', fontWeight: 600 }}
      />
      <CardContent>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading && !department ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Department Information
              </Typography>
              <TextField
                fullWidth
                label="Department Name"
                name="departmentName"
                value={formData.departmentName}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                disabled={loading}
              />
              <TextField
                fullWidth
                label="Department Head"
                name="departmentHead"
                value={formData.departmentHead}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                disabled={loading}
              />
              <TextField
                fullWidth
                label="Contact Email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                System Preferences
              </Typography>
              <TextField
                fullWidth
                label="Academic Year"
                name="academicYear"
                value={formData.academicYear}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                disabled={loading}
              />
              <TextField
                fullWidth
                label="Semester"
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                disabled={loading}
              />
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  variant="contained" 
                  onClick={handleSubmit}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                  {loading ? 'Saving...' : 'Save Settings'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        )}
      </CardContent>
    </Card>
  );
};

export default Settings;