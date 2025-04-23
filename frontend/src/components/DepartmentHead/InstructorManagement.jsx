import React, { useState, useEffect } from 'react';
import { 
  Avatar, Button, Card, Box, CardContent, CardHeader, 
  IconButton, List, ListItem, ListItemAvatar, ListItemText, 
  Paper, Tooltip, Typography, CircularProgress, Snackbar, Alert
} from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import AddInstructorDialog from './dialogs/AddInstructorDialog';
import EditInstructorDialog from './dialogs/EditInstructorDialog';
import useInstructors from '../../hooks/useInstructors';
import { useTheme } from '@mui/material/styles';
import api from '../../services/api';

const InstructorManagement = () => {
  const theme = useTheme();
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [notification, setNotification] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });

  const { 
    instructors, 
    loading, 
    error, 
    addInstructor, 
    updateInstructor, 
    deleteInstructor,
    refreshInstructors 
  } = useInstructors();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await api.get('/departments/');
        setDepartments(response.data);
      } catch (err) {
        console.error('Failed to fetch departments:', err);
        showNotification('Failed to load departments', 'error');
      }
    };
    fetchDepartments();
  }, []);

  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const handleAddInstructor = async (instructorData) => {
    try {
      await addInstructor(instructorData);
      setOpenAddDialog(false);
      showNotification('Instructor added successfully!');
    } catch (err) {
      showNotification(
        err.response?.data?.message || err.message || 'Failed to add instructor',
        'error'
      );
    }
  };

  const handleEditInstructor = async (id, instructorData) => {
    try {
      await updateInstructor(id, instructorData);
      setOpenEditDialog(false);
      showNotification('Instructor updated successfully!');
    } catch (err) {
      showNotification(
        err.response?.data?.message || err.message || 'Failed to update instructor',
        'error'
      );
    }
  };

  const handleDeleteInstructor = async (instructorId) => {
    if (window.confirm('Are you sure you want to delete this instructor?')) {
      try {
        await deleteInstructor(instructorId);
        showNotification('Instructor deleted successfully!');
      } catch (err) {
        showNotification(
          err.response?.data?.message || err.message || 'Failed to delete instructor',
          'error'
        );
      }
    }
  };

  const getInstructorDisplayName = (instructor) => {
    const firstName = instructor.user?.first_name || instructor.first_name || '';
    const lastName = instructor.user?.last_name || instructor.last_name || '';
    return `${firstName} ${lastName}`.trim() || 'Unnamed Instructor';
  };

  const getInstructorAvatar = (instructor) => {
    return instructor.user?.avatar || instructor.avatar || null;
  };

  const getInstructorEmail = (instructor) => {
    return instructor.user?.email || instructor.email || 'No email provided';
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <Card sx={{ borderRadius: theme.shape.borderRadius }}>
        <CardHeader
          title="Instructor Management"
          titleTypographyProps={{ variant: 'h5', fontWeight: 600 }}
          action={
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenAddDialog(true)}
              disabled={loading}
              aria-label="Add new instructor"
            >
              Add Instructor
            </Button>
          }
        />
        <CardContent>
          <Paper elevation={2} sx={{ borderRadius: theme.shape.borderRadius }}>
            {loading && !instructors?.length ? (
              <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress aria-label="Loading instructors" />
              </Box>
            ) : error ? (
              <Box textAlign="center" p={3}>
                <Typography color="error" gutterBottom>
                  Error loading instructors
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {error.message || 'Please try again later'}
                </Typography>
                <Button 
                  variant="outlined" 
                  onClick={refreshInstructors}
                  sx={{ mt: 2 }}
                  aria-label="Retry loading instructors"
                >
                  Retry
                </Button>
              </Box>
            ) : !instructors?.length ? (
              <Box textAlign="center" p={3}>
                <Typography variant="body1" gutterBottom>
                  No instructors found
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<Add />}
                  onClick={() => setOpenAddDialog(true)}
                  aria-label="Add first instructor"
                >
                  Add First Instructor
                </Button>
              </Box>
            ) : (
              <List aria-label="Instructor list">
                {instructors.map((instructor, index) => (
                  <ListItem
                    key={`instructor-${instructor.id || index}`}
                    secondaryAction={
                      <Box component="span">
                        <Tooltip title="Edit Instructor">
                          <IconButton
                            edge="end"
                            color="primary"
                            sx={{ mr: 1 }}
                            onClick={() => {
                              setSelectedInstructor(instructor);
                              setOpenEditDialog(true);
                            }}
                            disabled={loading}
                            aria-label={`Edit ${getInstructorDisplayName(instructor)}`}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Instructor">
                          <IconButton
                            edge="end"
                            color="error"
                            onClick={() => handleDeleteInstructor(instructor.id)}
                            disabled={loading}
                            aria-label={`Delete ${getInstructorDisplayName(instructor)}`}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar 
                        src={getInstructorAvatar(instructor)}
                        sx={{ 
                          bgcolor: theme.palette.primary.main,
                          color: theme.palette.primary.contrastText
                        }}
                        alt={`Avatar of ${getInstructorDisplayName(instructor)}`}
                      >
                        {getInstructorDisplayName(instructor).charAt(0) || 'I'}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography fontWeight="medium">
                          {getInstructorDisplayName(instructor)}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                          display="block"
                        >
                          {getInstructorEmail(instructor)}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </CardContent>
      </Card>

      <AddInstructorDialog 
        open={openAddDialog} 
        onClose={() => setOpenAddDialog(false)} 
        onSubmit={handleAddInstructor} 
        loading={loading}
        departments={departments}
      />

      {selectedInstructor && (
        <EditInstructorDialog 
          open={openEditDialog} 
          onClose={() => {
            setOpenEditDialog(false);
            setSelectedInstructor(null);
          }} 
          onSubmit={(data) => handleEditInstructor(selectedInstructor.id, data)} 
          instructor={selectedInstructor}
          loading={loading}
          departments={departments}
        />
      )}

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          sx={{ width: '100%' }}
          aria-live="polite"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default InstructorManagement;