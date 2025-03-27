import React, { useState } from 'react';
import { 
  Avatar, 
  Button, 
  Card, 
  Box,  
  CardContent, 
  CardHeader, 
  IconButton, 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  Paper,
  Tooltip,
  Typography,
  CircularProgress
} from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import AddInstructorDialog from './dialogs/AddInstructorDialog';
import EditInstructorDialog from './dialogs/EditInstructorDialog';
import useInstructors from '../../hooks/useInstructors';

const InstructorManagement = () => {
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const { instructors, loading, error, addInstructor, updateInstructor, deleteInstructor } = useInstructors();

  // Ensure instructors is always an array
  const instructorList = Array.isArray(instructors) ? instructors : [];

  const handleAddInstructor = async (instructorData) => {
    try {
      await addInstructor(instructorData);
      setOpenAddDialog(false);
    } catch (err) {
      console.error('Failed to add instructor:', err);
    }
  };

  const handleEditInstructor = async (instructorData) => {
    try {
      await updateInstructor(selectedInstructor.id, instructorData);
      setOpenEditDialog(false);
    } catch (err) {
      console.error('Failed to update instructor:', err);
    }
  };

  const handleDeleteInstructor = async (instructorId) => {
    if (window.confirm('Are you sure you want to delete this instructor?')) {
      try {
        await deleteInstructor(instructorId);
      } catch (err) {
        console.error('Failed to delete instructor:', err);
      }
    }
  };

  return (
    <>
      <Card>
        <CardHeader
          title="Instructor Management"
          titleTypographyProps={{ variant: 'h5', fontWeight: 600 }}
          action={
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenAddDialog(true)}
            >
              Add Instructor
            </Button>
          }
        />
        <CardContent>
          <Paper elevation={2}>
            {loading ? (
              <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Typography align="center" p={3} color="error">
                Error: {error.message || 'Failed to load instructors'}
              </Typography>
            ) : instructorList.length === 0 ? (
              <Typography align="center" p={3}>No instructors found</Typography>
            ) : (
              <List>
                {instructorList.map((instructor) => (
                  <ListItem
                    key={instructor.id}
                    secondaryAction={
                      <>
                        <Tooltip title="Edit Instructor">
                          <IconButton
                            edge="end"
                            color="primary"
                            sx={{ mr: 1 }}
                            onClick={() => {
                              setSelectedInstructor(instructor);
                              setOpenEditDialog(true);
                            }}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Instructor">
                          <IconButton
                            edge="end"
                            color="error"
                            onClick={() => handleDeleteInstructor(instructor.id)}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar src={instructor.avatar}>
                        {instructor.first_name?.charAt(0)}{instructor.last_name?.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${instructor.first_name} ${instructor.last_name}`}
                      secondary={
                        <>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                            display="block"
                          >
                            {instructor.email}
                          </Typography>
                          {instructor.courses && (
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.secondary"
                            >
                              Courses: {Array.isArray(instructor.courses) 
                                ? instructor.courses.join(', ') 
                                : 'No courses assigned'}
                            </Typography>
                          )}
                        </>
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
      />

      {selectedInstructor && (
        <EditInstructorDialog 
          open={openEditDialog} 
          onClose={() => setOpenEditDialog(false)} 
          onSubmit={handleEditInstructor} 
          instructor={selectedInstructor}
        />
      )}
    </>
  );
};

export default InstructorManagement;