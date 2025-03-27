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
  Grid,
  CircularProgress,
  Alert,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import useInstructors from "../../../hooks/useInstructors";

const AddCourseDialog = ({ open, onClose, onSubmit }) => {
  const [courseData, setCourseData] = useState({
    code: '',
    name: '',
    description: '',
    credit_hours: 3,
    instructor: '',
    is_active: true
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const { instructors, loading: instructorsLoading, error: instructorsError } = useInstructors();

  // Reset form when opening/closing dialog
  useEffect(() => {
    if (open) {
      setCourseData({
        code: '',
        name: '',
        description: '',
        credit_hours: 3,
        instructor: '',
        is_active: true
      });
      setErrors({});
      setSubmitError(null);
    }
  }, [open]);

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
    const { name, value, type, checked } = e.target;
    setCourseData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    
    setSubmitting(true);
    setSubmitError(null);
    
    try {
      await onSubmit({
        ...courseData,
        code: courseData.code.trim(),
        name: courseData.name.trim(),
        description: courseData.description.trim()
      });
      onClose();
    } catch (error) {
      console.error('Failed to add course:', error);
      setSubmitError(error.message || 'Failed to add course. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Safe instructor list handling
  const instructorList = Array.isArray(instructors) ? instructors : [];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Course</DialogTitle>
      <DialogContent dividers>
        {submitError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {submitError}
          </Alert>
        )}
        
        {instructorsError && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Could not load instructors: {instructorsError.message}
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
            <FormControl fullWidth margin="normal" error={!!errors.instructor}>
              <InputLabel>Instructor</InputLabel>
              <Select
                name="instructor"
                value={courseData.instructor}
                onChange={handleChange}
                label="Instructor"
                disabled={instructorsLoading || instructorsError}
              >
                <MenuItem value="">None</MenuItem>
                {instructorsLoading ? (
                  <MenuItem disabled>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Loading instructors...
                  </MenuItem>
                ) : instructorList.length === 0 ? (
                  <MenuItem disabled>No instructors available</MenuItem>
                ) : (
                  instructorList.map((instructor) => (
                    <MenuItem key={instructor.id} value={instructor.id}>
                      {instructor.name} ({instructor.email})
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              multiline
              rows={4}
              value={courseData.description}
              onChange={handleChange}
              margin="normal"
              inputProps={{ maxLength: 500 }}
              helperText={`${courseData.description.length}/500 characters`}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  name="is_active"
                  checked={courseData.is_active}
                  onChange={handleChange}
                  color="primary"
                />
              }
              label="Active Course"
            />
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
          {submitting ? 'Adding Course...' : 'Add Course'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCourseDialog;