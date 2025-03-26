import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Box
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const BulkEnrollDialog = ({ open, onClose, onSubmit }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setSubmitting(true);
    setError(null);
    
    try {
      await onSubmit(file);
      setFile(null);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to upload file');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Bulk Enroll Students</DialogTitle>
      <DialogContent dividers>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <Typography variant="body1" gutterBottom>
          Upload a CSV file containing student data. The file should include columns for:
        </Typography>
        
        <Typography variant="body2" component="div" sx={{ mb: 2 }}>
          <ul>
            <li>First Name</li>
            <li>Last Name</li>
            <li>Email</li>
            <li>Student ID</li>
            <li>Courses (comma-separated course IDs)</li>
          </ul>
        </Typography>
        
        <Box
          sx={{
            border: '2px dashed',
            borderColor: 'primary.main',
            borderRadius: 1,
            p: 4,
            textAlign: 'center',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'action.hover'
            }
          }}
        >
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            disabled={submitting}
            style={{ display: 'none' }}
            id="bulk-enroll-file"
          />
          <label htmlFor="bulk-enroll-file">
            <Button
              component="span"
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              disabled={submitting}
            >
              Select CSV File
            </Button>
          </label>
          {file && (
            <Typography variant="body2" sx={{ mt: 2 }}>
              Selected file: {file.name}
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={submitting || !file}
        >
          {submitting ? <CircularProgress size={24} /> : 'Upload & Enroll'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BulkEnrollDialog;