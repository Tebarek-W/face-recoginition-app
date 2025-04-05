import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Grid
} from '@mui/material';
import useDepartment from "../../../hooks/useDepartment";

const EditCourseDialog = ({ open, onClose, onSubmit, course }) => {
  const [courseData, setCourseData] = useState({
    code: '',
    name: '',
    credit_hours: 3,
    department: null
  });
  
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const { departments, loading: departmentsLoading, error: departmentsError } = useDepartment();

  // Initialize form when course prop changes
  useEffect(() => {
    if (course) {
      setCourseData({
        code: course.code || '',
        name: course.name || '',
        credit_hours: course.credit_hours || 3,
        department: course.department?.id || null
      });
      setErrors({});
      setSubmitError(null);
    }
  }, [course]);

  const validate = () => {
    const newErrors = {};
    if (!courseData.code.trim()) newErrors.code = 'Course code is required';
    if (!courseData.name.trim()) newErrors.name = 'Course name is required';
    if (courseData.credit_hours < 1 || courseData.credit_hours > 6) {
      newErrors.credit_hours = 'Credits must be between 1-6';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData(prev => ({
      ...prev,
      [name]: value === '' ? null : value
    }));
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    
    setSubmitting(true);
    setSubmitError(null);
    
    try {
      // Prepare the submission data with proper field names
      const submissionData = {
        code: courseData.code.trim(),
        name: courseData.name.trim(),
        credit_hours: Number(courseData.credit_hours),
        ...(courseData.department !== undefined && { 
          department_id: courseData.department || null 
        })
      };
  
      console.log('Submitting data:', submissionData); // Debug log
      
      await onSubmit(course.id, submissionData);
      onClose();
    } catch (error) {
      console.error('Update error details:', {
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      setSubmitError(
        error.response?.data?.message || 
        error.response?.data?.detail || 
        'Failed to update course. Please check the data and try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      aria-labelledby="edit-course-dialog-title"
    >
      <DialogTitle id="edit-course-dialog-title">Edit Course</DialogTitle>
      <DialogContent dividers>
        {submitError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {submitError}
          </Alert>
        )}

        {departmentsError && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {departmentsError}
          </Alert>
        )}

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Course Code *"
              name="code"
              value={courseData.code}
              onChange={handleChange}
              error={!!errors.code}
              helperText={errors.code || 'e.g., CS101'}
              margin="normal"
              inputProps={{ maxLength: 20 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Course Name *"
              name="name"
              value={courseData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              margin="normal"
              inputProps={{ maxLength: 100 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Credit Hours *"
              name="credit_hours"
              type="number"
              value={courseData.credit_hours}
              onChange={handleChange}
              error={!!errors.credit_hours}
              helperText={errors.credit_hours || 'Typically 1-6 credits'}
              margin="normal"
              inputProps={{ min: 1, max: 6, step: 1 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Department (Optional)</InputLabel>
              <Select
                name="department"
                value={courseData.department || ''}
                onChange={handleChange}
                label="Department (Optional)"
                disabled={departmentsLoading}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {Array.isArray(departments) && departments.map((department) => (
                  <MenuItem key={department.id} value={department.id}>
                    {department.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button 
          onClick={onClose} 
          disabled={submitting}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={submitting}
          startIcon={submitting ? <CircularProgress size={20} /> : null}
        >
          {submitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditCourseDialog;