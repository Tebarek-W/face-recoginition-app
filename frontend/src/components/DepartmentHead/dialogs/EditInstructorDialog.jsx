import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, FormControl, InputLabel,
  Select, MenuItem, CircularProgress, Alert,
  Avatar, Box, Typography
} from '@mui/material';
import useCourses from '../../../hooks/useCourses';

const EditInstructorDialog = ({ 
  open, 
  onClose, 
  onSubmit, 
  instructor,
  loading,
  departments = []  // Ensure default is empty array
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    gender: '',
    departmentId: null,
    courseIds: [],
    avatar: null
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { courses: coursesData = [], loading: coursesLoading } = useCourses();

  // Safely get departments array
  const departmentOptions = Array.isArray(departments) ? departments : [];
  
  // Safely get courses array - handle both direct array and object with courses property
  const courses = Array.isArray(coursesData) 
    ? coursesData 
    : Array.isArray(coursesData?.courses) 
      ? coursesData.courses 
      : [];

  useEffect(() => {
    if (instructor) {
      setFormData({
        firstName: instructor.user?.first_name || instructor.first_name || '',
        lastName: instructor.user?.last_name || instructor.last_name || '',
        email: instructor.user?.email || instructor.email || '',
        gender: instructor.user?.gender || instructor.gender || '',
        departmentId: instructor.department?.id || null,
        courseIds: Array.isArray(instructor.courses) 
          ? instructor.courses.map(c => c.id) 
          : [],
        avatar: null
      });
      setAvatarPreview(instructor.user?.avatar || instructor.avatar || null);
    }
  }, [instructor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCourseSelect = (e) => {
    setFormData(prev => ({
      ...prev,
      courseIds: e.target.value
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError('File size should be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
      setFormData(prev => ({
        ...prev,
        avatar: file
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      setError('First name, last name, and email are required');
      return;
    }
  
    setSubmitting(true);
    setError(null);
    
    try {
      // Prepare the payload with proper field names and data types
      const payload = {
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        email: formData.email.trim(),
        ...(formData.gender && { gender: formData.gender }),
        ...(formData.departmentId && { department_id: Number(formData.departmentId) }),
        // Only include courses if they've been modified
        ...(formData.courseIds && { courses: formData.courseIds.map(Number) })
      };
  
      let result;
      if (formData.avatar instanceof File) {
        const formDataPayload = new FormData();
        
        // Append all fields to FormData
        Object.entries(payload).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            // For arrays (like courses), append each item separately
            value.forEach(item => formDataPayload.append(key, item.toString()));
          } else if (value !== null && value !== undefined) {
            formDataPayload.append(key, value);
          }
        });
        
        // Append avatar file if it exists
        if (formData.avatar) {
          formDataPayload.append('avatar', formData.avatar);
        }
        
        result = await onSubmit(formDataPayload);
      } else {
        // For non-file updates, send as JSON
        result = await onSubmit(payload);
      }
  
      onClose();
      return result;
    } catch (err) {
      console.error('Update error:', err);
      
      // Enhanced error handling
      const backendError = err.response?.data;
      let errorMessage = 'Failed to update instructor.';
      
      if (backendError) {
        if (backendError.non_field_errors) {
          errorMessage = backendError.non_field_errors.join(', ');
        } else if (typeof backendError === 'object') {
          errorMessage = Object.entries(backendError)
            .map(([field, errors]) => {
              const fieldName = field.replace(/_/g, ' ');
              return `${fieldName}: ${Array.isArray(errors) ? errors.join(', ') : errors}`;
            })
            .join('\n');
        } else if (typeof backendError === 'string') {
          errorMessage = backendError;
        }
      }
      
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Instructor</DialogTitle>
      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            src={avatarPreview}
            sx={{ width: 64, height: 64, mr: 2 }}
          >
            {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
          </Avatar>
          <Box>
            <Button variant="outlined" component="label">
              Change Photo
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleAvatarChange}
              />
            </Button>
            <Typography variant="caption" display="block" color="text.secondary">
              JPG, PNG (Max 2MB)
            </Typography>
          </Box>
        </Box>
        
        <TextField
          autoFocus
          margin="dense"
          label="First Name"
          name="firstName"
          fullWidth
          variant="outlined"
          value={formData.firstName}
          onChange={handleChange}
          required
          sx={{ mb: 2 }}
        />
        
        <TextField
          margin="dense"
          label="Last Name"
          name="lastName"
          fullWidth
          variant="outlined"
          value={formData.lastName}
          onChange={handleChange}
          required
          sx={{ mb: 2 }}
        />
        
        <TextField
          margin="dense"
          label="Email"
          name="email"
          type="email"
          fullWidth
          variant="outlined"
          value={formData.email}
          onChange={handleChange}
          required
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Gender</InputLabel>
          <Select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            label="Gender"
          >
            <MenuItem value="M">Male</MenuItem>
            <MenuItem value="F">Female</MenuItem>
            <MenuItem value="O">Other</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Department</InputLabel>
          <Select
            name="departmentId"
            value={formData.departmentId || ''}
            onChange={handleChange}
            label="Department"
            disabled={loading}
          >
            {departmentOptions.map(dept => (
              <MenuItem key={dept.id} value={dept.id}>
                {dept.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="courses-label">Assigned Courses</InputLabel>
          <Select
            labelId="courses-label"
            label="Assigned Courses"
            multiple
            value={formData.courseIds}
            onChange={handleCourseSelect}
            disabled={loading || coursesLoading}
          >
            {courses.map((course) => (
              <MenuItem key={course.id} value={course.id}>
                {course.name} ({course.code})
              </MenuItem>
            ))}
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
          disabled={submitting || loading}
        >
          {submitting ? (
            <>
              <CircularProgress size={24} sx={{ mr: 1 }} />
              Saving...
            </>
          ) : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditInstructorDialog;