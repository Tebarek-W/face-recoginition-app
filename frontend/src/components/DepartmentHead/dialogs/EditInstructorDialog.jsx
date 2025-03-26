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
  Avatar,
  Box
} from '@mui/material';
import  useCourses  from '../../../hooks/useCourses';

const EditInstructorDialog = ({ open, onClose, onSubmit, instructor }) => {
  const [instructorData, setInstructorData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    courseIds: []
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { courses, loading: coursesLoading } = useCourses();

  useEffect(() => {
    if (instructor) {
      setInstructorData({
        firstName: instructor.first_name || '',
        lastName: instructor.last_name || '',
        email: instructor.email || '',
        courseIds: instructor.courses?.map(c => c.id) || []
      });
      setAvatarPreview(instructor.avatar || null);
    }
  }, [instructor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInstructorData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCourseSelect = (e) => {
    setInstructorData(prev => ({
      ...prev,
      courseIds: e.target.value
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setInstructorData(prev => ({
        ...prev,
        avatar: file
      }));
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('first_name', instructorData.firstName);
      formData.append('last_name', instructorData.lastName);
      formData.append('email', instructorData.email);
      instructorData.courseIds.forEach(courseId => {
        formData.append('courses', courseId);
      });
      if (instructorData.avatar) {
        formData.append('avatar', instructorData.avatar);
      }

      await onSubmit(instructor.id, formData);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update instructor');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Instructor</DialogTitle>
      <DialogContent dividers>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            src={avatarPreview}
            sx={{ width: 64, height: 64, mr: 2 }}
          >
            {instructorData.firstName.charAt(0)}{instructorData.lastName.charAt(0)}
          </Avatar>
          <Button
            variant="outlined"
            component="label"
          >
            Change Photo
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleAvatarChange}
            />
          </Button>
        </Box>
        
        <TextField
          autoFocus
          margin="dense"
          label="First Name"
          name="firstName"
          fullWidth
          variant="outlined"
          value={instructorData.firstName}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        
        <TextField
          margin="dense"
          label="Last Name"
          name="lastName"
          fullWidth
          variant="outlined"
          value={instructorData.lastName}
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
          value={instructorData.email}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="courses-label">Assigned Courses</InputLabel>
          <Select
            labelId="courses-label"
            label="Assigned Courses"
            multiple
            value={instructorData.courseIds}
            onChange={handleCourseSelect}
          >
            {coursesLoading ? (
              <MenuItem disabled>Loading courses...</MenuItem>
            ) : (
              courses.map((course) => (
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
          disabled={submitting || !instructorData.firstName || !instructorData.lastName || !instructorData.email}
        >
          {submitting ? <CircularProgress size={24} /> : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditInstructorDialog;