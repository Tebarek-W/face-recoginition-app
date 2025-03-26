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
  Alert
} from '@mui/material';
import useInstructors from "../../../hooks/useInstructors";

const EditCourseDialog = ({ open, onClose, onSubmit, course }) => {
  const [courseData, setCourseData] = useState({
    code: '',
    name: '',
    description: '',
    instructor: ''
  });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { instructors, loading: instructorsLoading } = useInstructors();

  // Initialize form when course prop changes
  useEffect(() => {
    if (course) {
      setCourseData({
        code: course.code || '',
        name: course.name || '',
        description: course.description || '',
        instructor: course.instructor?.id || ''
      });
    }
  }, [course]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    
    try {
      await onSubmit(course.id, courseData);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update course');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Course</DialogTitle>
      <DialogContent dividers>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <TextField
          autoFocus
          margin="dense"
          label="Course Code"
          name="code"
          fullWidth
          variant="outlined"
          value={courseData.code}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        
        <TextField
          margin="dense"
          label="Course Name"
          name="name"
          fullWidth
          variant="outlined"
          value={courseData.name}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        
        <TextField
          margin="dense"
          label="Description"
          name="description"
          fullWidth
          variant="outlined"
          multiline
          rows={4}
          value={courseData.description}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="instructor-select-label">Instructor</InputLabel>
          <Select
            labelId="instructor-select-label"
            label="Instructor"
            name="instructor"
            value={courseData.instructor}
            onChange={handleChange}
          >
            <MenuItem value="">Select Instructor</MenuItem>
            {instructorsLoading ? (
              <MenuItem disabled>Loading instructors...</MenuItem>
            ) : (
              instructors.map((instructor) => (
                <MenuItem key={instructor.id} value={instructor.id}>
                  {instructor.name}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={submitting || !courseData.code || !courseData.name}
        >
          {submitting ? <CircularProgress size={24} /> : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditCourseDialog;