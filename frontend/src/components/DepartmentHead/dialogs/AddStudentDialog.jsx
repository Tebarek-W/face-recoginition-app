import React, { useState } from 'react';
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
import useCourses from "../../../hooks/useCourses";

const AddStudentDialog = ({ open, onClose, onSubmit }) => {
  const [studentData, setStudentData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    studentId: '',
    courseIds: []
  });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { courses, loading: coursesLoading, error: coursesError } = useCourses();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCourseSelect = (e) => {
    setStudentData(prev => ({
      ...prev,
      courseIds: e.target.value
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    
    try {
      await onSubmit({
        ...studentData,
        name: `${studentData.firstName} ${studentData.lastName}`
      });
      setStudentData({
        firstName: '',
        lastName: '',
        email: '',
        studentId: '',
        courseIds: []
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to add student');
    } finally {
      setSubmitting(false);
    }
  };

  // Safe courses data handling
  const safeCourses = Array.isArray(courses) ? courses : [];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New Student</DialogTitle>
      <DialogContent dividers>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {coursesError && <Alert severity="error" sx={{ mb: 2 }}>Failed to load courses: {coursesError.message}</Alert>}
        
        <TextField
          autoFocus
          margin="dense"
          label="First Name"
          name="firstName"
          fullWidth
          variant="outlined"
          value={studentData.firstName}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        
        <TextField
          margin="dense"
          label="Last Name"
          name="lastName"
          fullWidth
          variant="outlined"
          value={studentData.lastName}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        
        <TextField
          margin="dense"
          label="Email"
          name="email"
          type="email"
          fullWidth
          variant="outlined"
          value={studentData.email}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        
        <TextField
          margin="dense"
          label="Student ID"
          name="studentId"
          fullWidth
          variant="outlined"
          value={studentData.studentId}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="courses-label">Courses</InputLabel>
          <Select
            labelId="courses-label"
            label="Courses"
            multiple
            value={studentData.courseIds}
            onChange={handleCourseSelect}
          >
            {coursesLoading ? (
              <MenuItem disabled>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Loading courses...
              </MenuItem>
            ) : coursesError ? (
              <MenuItem disabled>Failed to load courses</MenuItem>
            ) : safeCourses.length === 0 ? (
              <MenuItem disabled>No courses available</MenuItem>
            ) : (
              safeCourses.map((course) => (
                <MenuItem key={course.id} value={course.id}>
                  {course.name} ({course.code})
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
          disabled={submitting || !studentData.firstName || !studentData.lastName || !studentData.email}
        >
          {submitting ? <CircularProgress size={24} /> : 'Add Student'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddStudentDialog;