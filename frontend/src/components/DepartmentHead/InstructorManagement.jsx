import React, { useState } from 'react';
import { 
  Avatar, 
  Button, 
  Card, 
  CardContent, 
  CardHeader, 
  IconButton, 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  Paper,
  Tooltip,
  Typography
} from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import AddInstructorDialog from './dialogs/AddInstructorDialog';
import EditInstructorDialog from './dialogs/EditInstructorDialog';
import  useInstructors  from '../../hooks/useInstructors';

const InstructorManagement = () => {
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const { instructors, loading, error, addInstructor, updateInstructor, deleteInstructor } = useInstructors();

  const handleAddInstructor = (instructorData) => {
    addInstructor(instructorData);
    setOpenAddDialog(false);
  };

  const handleEditInstructor = (instructorData) => {
    updateInstructor(selectedInstructor.id, instructorData);
    setOpenEditDialog(false);
  };

  const handleDeleteInstructor = (instructorId) => {
    if (window.confirm('Are you sure you want to delete this instructor?')) {
      deleteInstructor(instructorId);
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
              <Typography align="center" p={3}>Loading...</Typography>
            ) : error ? (
              <Typography align="center" p={3} color="error">Error: {error}</Typography>
            ) : instructors.length === 0 ? (
              <Typography align="center" p={3}>No instructors found</Typography>
            ) : (
              <List>
                {instructors.map((instructor) => (
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
                        {instructor.name.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={instructor.name}
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
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.secondary"
                          >
                            Courses: {instructor.courses.join(', ')}
                          </Typography>
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