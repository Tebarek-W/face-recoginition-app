import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material';
import { Add, Delete, Edit, Refresh } from '@mui/icons-material';
import AddCourseDialog from './dialogs/AddCourseDialog';
import EditCourseDialog from './dialogs/EditCourseDialog';
import useCourses from '../../hooks/useCourses';
import { useSnackbar } from 'notistack';

const CourseManagement = () => {
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [ariaHidden, setAriaHidden] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  
  const {
    courses = [],
    loading,
    error,
    addCourse,
    updateCourse,
    deleteCourse,
    refresh
  } = useCourses();

  // Handle dialog state changes for accessibility
  useEffect(() => {
    // Set aria-hidden on root when any dialog is open
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.setAttribute('aria-hidden', ariaHidden.toString());
      rootElement.inert = ariaHidden;
    }
  }, [ariaHidden]);

  const handleAddCourse = async (courseData) => {
    try {
      await addCourse(courseData);
      setOpenAddDialog(false);
      enqueueSnackbar('Course added successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(error.message || 'Failed to add course', { variant: 'error' });
    }
  };

  const handleEditCourse = async (id, courseData) => {
    try {
      await updateCourse(id, courseData);
      setOpenEditDialog(false);
      enqueueSnackbar('Course updated successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(error.message || 'Failed to update course', { variant: 'error' });
    }
  };

  const handleDeleteCourse = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await deleteCourse(id);
        enqueueSnackbar('Course deleted successfully', { variant: 'success' });
      } catch (error) {
        enqueueSnackbar(error.message || 'Failed to delete course', { variant: 'error' });
      }
    }
  };

  const handleDialogOpen = (dialogType) => {
    setAriaHidden(true);
    if (dialogType === 'add') {
      setOpenAddDialog(true);
    } else {
      setOpenEditDialog(true);
    }
  };

  const handleDialogClose = (dialogType) => {
    setAriaHidden(false);
    if (dialogType === 'add') {
      setOpenAddDialog(false);
    } else {
      setOpenEditDialog(false);
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Card elevation={3}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 3
        }}>
          <Typography variant="h5" fontWeight="bold">
            Course Management
          </Typography>
          <Box>
            <Tooltip title="Refresh courses">
              <IconButton 
                onClick={refresh} 
                sx={{ mr: 2 }}
                aria-label="Refresh courses"
              >
                <Refresh />
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleDialogOpen('add')}
              aria-label="Add new course"
            >
              Add Course
            </Button>
          </Box>
        </Box>

        <TableContainer component={Paper}>
          <Table aria-label="Courses table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Code</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Department</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Credit Hours</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <CircularProgress aria-label="Loading" />
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ color: 'error.main' }}>
                    {error.message || 'Error loading courses'}
                  </TableCell>
                </TableRow>
              ) : courses.length > 0 ? (
                courses.map((course) => (
                  <TableRow key={course.id || course._id}>
                    <TableCell>{course.code || 'N/A'}</TableCell>
                    <TableCell>{course.name || 'N/A'}</TableCell>
                    <TableCell>{course.department?.name || 'N/A'}</TableCell>
                    <TableCell>{course.credit_hours || 'N/A'}</TableCell>
                    <TableCell>
                      <Tooltip title="Edit Course">
                        <IconButton
                          color="primary"
                          onClick={() => {
                            setSelectedCourse(course);
                            handleDialogOpen('edit');
                          }}
                          aria-label={`Edit ${course.name}`}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Course">
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteCourse(course.id || course._id)}
                          aria-label={`Delete ${course.name}`}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No courses found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <AddCourseDialog
        open={openAddDialog}
        onClose={() => handleDialogClose('add')}
        onSubmit={handleAddCourse}
      />

      {selectedCourse && (
        <EditCourseDialog
          open={openEditDialog}
          onClose={() => handleDialogClose('edit')}
          onSubmit={(data) => handleEditCourse(selectedCourse.id || selectedCourse._id, data)}
          course={selectedCourse}
        />
      )}
    </Box>
  );
};

export default CourseManagement;