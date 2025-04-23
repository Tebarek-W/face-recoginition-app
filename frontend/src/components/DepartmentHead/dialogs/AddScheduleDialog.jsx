import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  CircularProgress,
  Alert
} from '@mui/material';
import useCourses from '../../../hooks/useCourses';
import useInstructors from '../../../hooks/useInstructors';

const AddScheduleDialog = ({ open, onClose, onSubmit }) => {
  const [scheduleData, setScheduleData] = useState({
    course: '',
    instructor: '',
    day: '',
    start_time: '',
    end_time: '',
    room: ''
  });
  
  const { courses, loading: coursesLoading, error: coursesError } = useCourses();
  const { instructors, loading: instructorsLoading, error: instructorsError } = useInstructors();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setScheduleData(prev => ({
      ...prev,
      [name]: value
    }));
    setSubmitError(null); // Clear errors on change
  };

  const formatTimeForBackend = (time) => {
    if (!time) return '';
    // Ensure time is in HH:MM:SS format
    const parts = String(time).split(':');
    if (parts.length === 2) return `${time}:00`;
    if (parts.length === 3) return time;
    return time;
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!scheduleData.course || !scheduleData.instructor || !scheduleData.day || 
        !scheduleData.start_time || !scheduleData.end_time) {
      setSubmitError('Please fill all required fields');
      return;
    }

    // Validate time format
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
    if (!timeRegex.test(scheduleData.start_time) || !timeRegex.test(scheduleData.end_time)) {
      setSubmitError('Please enter valid time format (HH:MM or HH:MM:SS)');
      return;
    }

    setSubmitting(true);
    
    try {
      const payload = {
        course: scheduleData.course,
        instructor: scheduleData.instructor,
        day: scheduleData.day,
        start_time: formatTimeForBackend(scheduleData.start_time),
        end_time: formatTimeForBackend(scheduleData.end_time),
        room: scheduleData.room || 'TBA'
      };

      await onSubmit(payload);
      
      // Reset form on success
      setScheduleData({
        course: '',
        instructor: '',
        day: '',
        start_time: '',
        end_time: '',
        room: ''
      });
      onClose();
    } catch (error) {
      console.error('Schedule submission error:', error);
      setSubmitError(
        error.message || 
        error.response?.data?.error || 
        error.response?.data?.detail || 
        'Failed to add schedule. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New Schedule</DialogTitle>
      <DialogContent dividers>
        {/* Error Display */}
        {(submitError || coursesError || instructorsError) && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {submitError || coursesError?.message || instructorsError?.message}
          </Alert>
        )}

        {/* Course Selection */}
        <FormControl fullWidth sx={{ mb: 2 }} error={!!coursesError}>
          <InputLabel>Course *</InputLabel>
          <Select
            name="course"
            value={scheduleData.course}
            onChange={handleChange}
            disabled={coursesLoading}
            label="Course *"
          >
            {coursesLoading ? (
              <MenuItem disabled><CircularProgress size={20} /></MenuItem>
            ) : courses?.map((course) => (
              <MenuItem key={course.id} value={course.id}>
                {course.name} ({course.code})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Instructor Selection */}
        <FormControl fullWidth sx={{ mb: 2 }} error={!!instructorsError}>
          <InputLabel>Instructor *</InputLabel>
          <Select
            name="instructor"
            value={scheduleData.instructor}
            onChange={handleChange}
            disabled={instructorsLoading}
            label="Instructor *"
          >
            {instructorsLoading ? (
              <MenuItem disabled><CircularProgress size={20} /></MenuItem>
            ) : instructors?.map((instructor) => (
              <MenuItem key={instructor.id} value={instructor.id}>
                {instructor.first_name} {instructor.last_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Day Selection */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Day *</InputLabel>
          <Select
            name="day"
            value={scheduleData.day}
            onChange={handleChange}
            label="Day *"
          >
            {daysOfWeek.map((day) => (
              <MenuItem key={day} value={day}>
                {day}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Time Inputs */}
        <TextField
          label="Start Time *"
          name="start_time"
          type="time"
          fullWidth
          value={scheduleData.start_time}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          inputProps={{ step: 300 }} // 5 minute intervals
          sx={{ mb: 2 }}
          helperText="Format: HH:MM"
        />

        <TextField
          label="End Time *"
          name="end_time"
          type="time"
          fullWidth
          value={scheduleData.end_time}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          inputProps={{ step: 300 }}
          sx={{ mb: 2 }}
          helperText="Format: HH:MM"
        />

        {/* Room Input */}
        <TextField
          label="Room"
          name="room"
          fullWidth
          value={scheduleData.room}
          onChange={handleChange}
          helperText="Optional (default: TBA)"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          disabled={submitting}
          endIcon={submitting ? <CircularProgress size={20} /> : null}
        >
          {submitting ? 'Adding...' : 'Add Schedule'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddScheduleDialog;