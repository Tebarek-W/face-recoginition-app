import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  CircularProgress
} from '@mui/material';

const AttendanceRulesDialog = ({ open, onClose, onSubmit, initialRules }) => {
  const [rules, setRules] = useState(initialRules || {
    minimumAttendance: 75,
    latePolicy: 3,
    notificationThreshold: 70,
    gracePeriod: 15
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRules(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await onSubmit(rules);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Configure Attendance Rules</DialogTitle>
      <DialogContent dividers>
        <Typography variant="subtitle1" gutterBottom>
          Set the rules for attendance tracking and notifications
        </Typography>
        
        <TextField
          margin="dense"
          label="Minimum Attendance Percentage"
          name="minimumAttendance"
          type="number"
          fullWidth
          variant="outlined"
          value={rules.minimumAttendance}
          onChange={handleChange}
          InputProps={{
            endAdornment: '%',
            inputProps: { min: 0, max: 100 }
          }}
          sx={{ mb: 2 }}
        />
        
        <TextField
          margin="dense"
          label="Late Count Equals Absence"
          name="latePolicy"
          type="number"
          fullWidth
          variant="outlined"
          value={rules.latePolicy}
          onChange={handleChange}
          helperText="Number of late arrivals that count as one absence"
          InputProps={{
            inputProps: { min: 1 }
          }}
          sx={{ mb: 2 }}
        />
        
        <TextField
          margin="dense"
          label="Notification Threshold"
          name="notificationThreshold"
          type="number"
          fullWidth
          variant="outlined"
          value={rules.notificationThreshold}
          onChange={handleChange}
          helperText="Send warning when attendance falls below this percentage"
          InputProps={{
            endAdornment: '%',
            inputProps: { min: 0, max: 100 }
          }}
          sx={{ mb: 2 }}
        />
        
        <TextField
          margin="dense"
          label="Grace Period (minutes)"
          name="gracePeriod"
          type="number"
          fullWidth
          variant="outlined"
          value={rules.gracePeriod}
          onChange={handleChange}
          helperText="Allowed minutes after scheduled time before marked late"
          InputProps={{
            inputProps: { min: 0 }
          }}
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
        >
          {submitting ? <CircularProgress size={24} /> : 'Save Rules'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AttendanceRulesDialog;