import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress
} from '@mui/material';
import useInstructors from "../../../hooks/useInstructors"; 

const AddCourseDialog = ({ open, onClose, onSubmit }) => {
  const [courseData, setCourseData] = useState({
    code: '',
    name: '',
    description: '',
    instructor: ''
  });
  const { instructors, loading: instructorsLoading } = useInstructors();
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await onSubmit(courseData);
      setCourseData({
        code: '',
        name: '',
        description: '',
        instructor: ''
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New Course</DialogTitle>
      <DialogContent dividers>
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
          {submitting ? <CircularProgress size={24} /> : 'Add Course'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCourseDialog;