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
  Alert,
  Avatar,
  Box,
  Typography,
  FormHelperText
} from '@mui/material';
import useCourses from '../../../hooks/useCourses';
import useDepartment from '../../../hooks/useDepartment';

const AddInstructorDialog = ({ open, onClose, onSubmit }) => {
  const [instructorData, setInstructorData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    gender: '',
    password: '',
    department_id: null,
    courses: []
  });

  const [errors, setErrors] = useState({});
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  const { 
    departments = [],
    loading: deptLoading, 
    error: deptError
  } = useDepartment();
  
  const { 
    courses = [],
    loading: coursesLoading, 
    error: coursesError 
  } = useCourses();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInstructorData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCourseSelect = (e) => {
    setInstructorData(prev => ({
      ...prev,
      courses: e.target.value
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, avatar: 'File size should be less than 2MB' }));
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
    setInstructorData(prev => ({ ...prev, avatar: file }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!instructorData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!instructorData.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!instructorData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(instructorData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!instructorData.gender) newErrors.gender = 'Gender is required';
    if (!instructorData.password) {
      newErrors.password = 'Password is required';
    } else if (instructorData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
  
    setSubmitting(true);
    
    try {
      // Prepare the payload with correct field names
      const payload = {
        first_name: instructorData.first_name,
        last_name: instructorData.last_name,
        email: instructorData.email,
        gender: instructorData.gender,
        password: instructorData.password,
        department_id: instructorData.department_id || null, // Ensure null instead of empty string
        courses: instructorData.courses || [], // Match backend expectation
        ...(instructorData.avatar && { avatar: instructorData.avatar })
      };
  
      await onSubmit(payload);
      onClose();
    } catch (err) {
      console.error('Submission Error:', err.response?.data);
      setErrors({
        ...err.response?.data,
        general: err.response?.data?.detail || 'Failed to add instructor'
      });
    } finally {
      setSubmitting(false);
    }
  };
  const departmentOptions = Array.isArray(departments) ? departments : [];
  const courseOptions = Array.isArray(courses) ? courses : [];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New Instructor</DialogTitle>
      <DialogContent dividers>
        {errors.general && (
          <Alert severity="error" sx={{ mb: 2 }}>{errors.general}</Alert>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar src={avatarPreview} sx={{ width: 64, height: 64, mr: 2 }}>
            {instructorData.first_name.charAt(0)}{instructorData.last_name.charAt(0)}
          </Avatar>
          <Box>
            <Button variant="outlined" component="label" sx={{ mb: 1 }}>
              Upload Photo
              <input type="file" accept="image/*" hidden onChange={handleAvatarChange} />
            </Button>
            <Typography variant="caption" color="text.secondary">
              JPG, PNG (Max 2MB)
            </Typography>
            {errors.avatar && (
              <Typography variant="caption" color="error">
                {errors.avatar}
              </Typography>
            )}
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            margin="dense"
            label="First Name *"
            name="first_name"
            fullWidth
            variant="outlined"
            value={instructorData.first_name}
            onChange={handleChange}
            error={!!errors.first_name}
            helperText={errors.first_name}
          />
          <TextField
            margin="dense"
            label="Last Name *"
            name="last_name"
            fullWidth
            variant="outlined"
            value={instructorData.last_name}
            onChange={handleChange}
            error={!!errors.last_name}
            helperText={errors.last_name}
          />
        </Box>
        
        <TextField
          margin="dense"
          label="Email *"
          name="email"
          type="email"
          fullWidth
          variant="outlined"
          value={instructorData.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
          sx={{ mt: 2 }}
        />
        
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <FormControl fullWidth error={!!errors.gender}>
            <InputLabel>Gender *</InputLabel>
            <Select
              label="Gender *"
              name="gender"
              value={instructorData.gender}
              onChange={handleChange}
            >
              <MenuItem value="M">Male</MenuItem>
              <MenuItem value="F">Female</MenuItem>
              <MenuItem value="O">Other</MenuItem>
            </Select>
            {errors.gender && <FormHelperText>{errors.gender}</FormHelperText>}
          </FormControl>
          
          <TextField
            margin="dense"
            label="Password *"
            name="password"
            type="password"
            fullWidth
            variant="outlined"
            value={instructorData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
          />
        </Box>

        <FormControl fullWidth sx={{ mt: 2 }} error={!!errors.department_id}>
          <InputLabel>Department</InputLabel>
          <Select
            label="Department"
            name="department_id"
            value={instructorData.department_id || ''}
            onChange={handleChange}
            disabled={deptLoading || deptError}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {deptLoading ? (
              <MenuItem disabled>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Loading departments...
              </MenuItem>
            ) : deptError ? (
              <MenuItem disabled>Failed to load departments</MenuItem>
            ) : departmentOptions.length === 0 ? (
              <MenuItem disabled>No departments available</MenuItem>
            ) : (
              departmentOptions.map((dept) => (
                <MenuItem key={dept.id} value={dept.id}>
                  {dept.name}
                </MenuItem>
              ))
            )}
          </Select>
          {errors.department_id && (
            <FormHelperText>{errors.department_id}</FormHelperText>
          )}
        </FormControl>
        
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="courses-label">Assigned Courses</InputLabel>
          <Select
            labelId="courses-label"
            label="Assigned Courses"
            multiple
            value={instructorData.courses}
            onChange={handleCourseSelect}
            disabled={coursesLoading || coursesError}
          >
            {coursesLoading ? (
              <MenuItem disabled>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Loading courses...
              </MenuItem>
            ) : coursesError ? (
              <MenuItem disabled>Failed to load courses</MenuItem>
            ) : courseOptions.length === 0 ? (
              <MenuItem disabled>No courses available</MenuItem>
            ) : (
              courseOptions.map((course) => (
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
          disabled={submitting}
        >
          {submitting ? (
            <>
              <CircularProgress size={24} sx={{ mr: 1 }} />
              Saving...
            </>
          ) : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddInstructorDialog;