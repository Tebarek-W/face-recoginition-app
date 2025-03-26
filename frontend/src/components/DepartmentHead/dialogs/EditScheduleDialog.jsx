import React from 'react';
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
  CircularProgress
} from '@mui/material';
import  useCourses  from '../../../hooks/useCourses';
import  useInstructors  from '../../../hooks/useInstructors';

const EditScheduleDialog = ({ open, onClose, onSubmit, schedule }) => {
  const [scheduleData, setScheduleData] = React.useState(schedule || {
    course: '',
    instructor: '',
    day: '',
    startTime: '',
    endTime: '',
    room: ''
  });
  
  const { courses, loading: coursesLoading } = useCourses();
  const { instructors, loading: instructorsLoading } = useInstructors();
  const [submitting, setSubmitting] = React.useState(false);

  const daysOfWeek = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  React.useEffect(() => {
    if (schedule) {
      setScheduleData(schedule);
    }
  }, [schedule]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setScheduleData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await onSubmit(scheduleData);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Schedule</DialogTitle>
      <DialogContent dividers>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="course-select-label">Course</InputLabel>
          <Select
            labelId="course-select-label"
            label="Course"
            name="course"
            value={scheduleData.course}
            onChange={handleChange}
          >
            <MenuItem value="">Select Course</MenuItem>
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

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="instructor-select-label">Instructor</InputLabel>
          <Select
            labelId="instructor-select-label"
            label="Instructor"
            name="instructor"
            value={scheduleData.instructor}
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

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="day-select-label">Day</InputLabel>
          <Select
            labelId="day-select-label"
            label="Day"
            name="day"
            value={scheduleData.day}
            onChange={handleChange}
          >
            <MenuItem value="">Select Day</MenuItem>
            {daysOfWeek.map((day) => (
              <MenuItem key={day} value={day}>
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
          disabled={submitting || !scheduleData.course || !scheduleData.instructor || !scheduleData.day}
        >
          {submitting ? <CircularProgress size={24} /> : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditScheduleDialog;