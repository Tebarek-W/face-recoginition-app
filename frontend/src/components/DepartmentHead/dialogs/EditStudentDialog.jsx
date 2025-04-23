import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useStudents } from '../../../hooks/useStudents';
import { format, parseISO } from 'date-fns';

const EditStudentDialog = ({ open, onClose, student, onSuccess }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    gender: 'M',
    date_of_birth: null,
    department_id: '',
    year_of_study: 1
  });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { updateStudent } = useStudents();

  useEffect(() => {
    if (student) {
      setFormData({
        first_name: student.first_name || '',
        last_name: student.last_name || '',
        email: student.email || '',
        phone_number: student.phone_number || '',
        gender: student.gender || 'M',
        date_of_birth: student.date_of_birth ? parseISO(student.date_of_birth) : null,
        department_id: student.department?.id || '',
        year_of_study: student.year_of_study || 1
      });
    }
  }, [student]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setError(null);
    setIsSubmitting(true);
    
    try {
      await updateStudent.mutateAsync({
        id: student.id,
        ...formData
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update student');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!student) return null;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog 
        open={open} 
        onClose={onClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>
          Edit Student
          <Button onClick={onClose} size="small">
            <Close />
          </Button>
        </DialogTitle>
        
        <DialogContent dividers>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                name="first_name"
                label="First Name"
                value={formData.first_name}
                onChange={handleChange}
                fullWidth
                required
              />
              
              <TextField
                name="last_name"
                label="Last Name"
                value={formData.last_name}
                onChange={handleChange}
                fullWidth
                required
              />
            </Box>
            
            <TextField
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              required
            />
            
            <TextField
              name="phone_number"
              label="Phone Number"
              value={formData.phone_number}
              onChange={handleChange}
              fullWidth
            />
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  label="Gender"
                  required
                >
                  <MenuItem value="M">Male</MenuItem>
                  <MenuItem value="F">Female</MenuItem>
                  <MenuItem value="O">Other</MenuItem>
                </Select>
              </FormControl>
              
              <DatePicker
                label="Date of Birth"
                value={formData.date_of_birth}
                onChange={(newValue) => {
                  setFormData(prev => ({ ...prev, date_of_birth: newValue }));
                }}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    fullWidth 
                  />
                )}
              />
            </Box>
            
            <Divider sx={{ my: 1 }} />
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select
                  name="department_id"
                  value={formData.department_id}
                  onChange={handleChange}
                  label="Department"
                >
                  {/* This would be populated with actual departments from your API */}
                  <MenuItem value={1}>Computer Science</MenuItem>
                  <MenuItem value={2}>Electrical Engineering</MenuItem>
                  <MenuItem value={3}>Mechanical Engineering</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth>
                <InputLabel>Year of Study</InputLabel>
                <Select
                  name="year_of_study"
                  value={formData.year_of_study}
                  onChange={handleChange}
                  label="Year of Study"
                >
                  <MenuItem value={1}>First Year</MenuItem>
                  <MenuItem value={2}>Second Year</MenuItem>
                  <MenuItem value={3}>Third Year</MenuItem>
                  <MenuItem value={4}>Fourth Year</MenuItem>
                  <MenuItem value={5}>Fifth Year</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <CircularProgress size={24} />
            ) : (
              'Save Changes'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default EditStudentDialog;