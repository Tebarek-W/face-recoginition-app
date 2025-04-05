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
    startTime: '',
    endTime: '',
    room: ''
  });
  
  const { courses, loading: coursesLoading, error: coursesError } = useCourses();
  const { instructors, loading: instructorsLoading, error: instructorsError } = useInstructors();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const daysOfWeek = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  // Ensure courses and instructors are always arrays with fallback keys
  const courseList = Array.isArray(courses) ? courses : [];
  const instructorList = Array.isArray(instructors) ? instructors : [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setScheduleData(prev => ({
      ...prev,
      [name]: value
    }));
    setSubmitError(null); // Clear errors on change
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);
    
    try {
      await onSubmit(scheduleData);
      // Reset form on success
      setScheduleData({
        course: '',
        instructor: '',
        day: '',
        startTime: '',
        endTime: '',
        room: ''
      });
      onClose();
    } catch (error) {
      console.error('Failed to add schedule:', error);
      setSubmitError(error.message || 'Failed to add schedule. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Generate stable keys for list items
  const getCourseKey = (course) => course?.id || `course-${course?.code}`;
  const getInstructorKey = (instructor) => instructor?.id || `instructor-${instructor?.email}`;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New Schedule</DialogTitle>
      <DialogContent dividers>
        {submitError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {submitError}
          </Alert>
        )}

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="course-select-label">Course</InputLabel>
          <Select
            labelId="course-select-label"
            label="Course"
            name="course"
            value={scheduleData.course}
            onChange={handleChange}
            disabled={coursesLoading || coursesError}
          >
            <MenuItem key="course-none" value="">Select Course</MenuItem>
            {coursesLoading ? (
              <MenuItem key="course-loading" disabled>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Loading courses...
              </MenuItem>
            ) : coursesError ? (
              <MenuItem key="course-error" disabled>
                Failed to load courses
              </MenuItem>
            ) : courseList.length === 0 ? (
              <MenuItem key="course-empty" disabled>
                No courses available
              </MenuItem>
            ) : (
              courseList.map((course) => (
                <MenuItem key={getCourseKey(course)} value={course.id}>
                  {course.name} ({course.code})
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="instructor-select-label">Instructor</InputLabel>
          <Select
            labelId="instructor-select-label"
            label="Instructor"
            name="instructor"
            value={scheduleData.instructor}
            onChange={handleChange}
            disabled={instructorsLoading || instructorsError}
          >
            <MenuItem key="instructor-none" value="">Select Instructor</MenuItem>
            {instructorsLoading ? (
              <MenuItem key="instructor-loading" disabled>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Loading instructors...
              </MenuItem>
            ) : instructorsError ? (
              <MenuItem key="instructor-error" disabled>
                Failed to load instructors
              </MenuItem>
            ) : instructorList.length === 0 ? (
              <MenuItem key="instructor-empty" disabled>
                No instructors available
              </MenuItem>
            ) : (
              instructorList.map((instructor) => (
                <MenuItem key={getInstructorKey(instructor)} value={instructor.id}>
                  {instructor.name}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="day-select-label">Day</InputLabel>
          <Select
            labelId="day-select-label"
            label="Day"
            name="day"
            value={scheduleData.day}
            onChange={handleChange}
          >
            <MenuItem key="day-none" value="">Select Day</MenuItem>
            {daysOfWeek.map((day) => (
              <MenuItem key={`day-${day}`} value={day}>
                {day}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          margin="dense"
          label="Start Time"
          name="startTime"
          type="time"
          fullWidth
          variant="outlined"
          value={scheduleData.startTime}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 2 }}
        />

        <TextField
          margin="dense"
          label="End Time"
          name="endTime"
          type="time"
          fullWidth
          variant="outlined"
          value={scheduleData.endTime}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 2 }}
        />

        <TextField
          margin="dense"
          label="Room Number"
          name="room"
          fullWidth
          variant="outlined"
          value={scheduleData.room}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={
            submitting || 
            !scheduleData.course || 
            !scheduleData.instructor || 
            !scheduleData.day ||
            !scheduleData.startTime ||
            !scheduleData.endTime
          }
        >
          {submitting ? <CircularProgress size={24} /> : 'Add Schedule'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddScheduleDialog;