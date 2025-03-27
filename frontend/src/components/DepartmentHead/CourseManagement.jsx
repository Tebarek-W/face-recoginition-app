import React, { useState } from 'react';
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
  const { enqueueSnackbar } = useSnackbar();
  
  const {
    courses = [], // Ensure courses is always an array
    loading,
    error,
    addCourse,
    updateCourse,
    deleteCourse,
    refresh
  } = useCourses();

  const handleAddCourse = async (courseData) => {
    try {
      await addCourse(courseData);
      setOpenAddDialog(false);
    } catch (error) {
      enqueueSnackbar('Failed to add course', { variant: 'error' });
    }
  };

  const handleEditCourse = async (id, courseData) => {
    try {
      await updateCourse(id, courseData);
      setOpenEditDialog(false);
    } catch (error) {
      enqueueSnackbar('Failed to update course', { variant: 'error' });
    }
  };

  const handleDeleteCourse = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await deleteCourse(id);
        enqueueSnackbar('Course deleted successfully', { variant: 'success' });
      } catch (error) {
        enqueueSnackbar('Failed to delete course', { variant: 'error' });
      }
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
              <IconButton onClick={refresh} sx={{ mr: 2 }}>
                <Refresh />
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenAddDialog(true)}
            >
              Add Course
            </Button>
          </Box>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Code</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Department</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ color: 'error.main' }}>
                    {error}
                  </TableCell>
                </TableRow>
              ) : courses.length > 0 ? (
                courses.map((course) => (
                  <TableRow key={course.id || course._id}>
                    <TableCell>{course.code || 'N/A'}</TableCell>
                    <TableCell>{course.name || 'N/A'}</TableCell>
                    <TableCell>{course.department?.name || 'N/A'}</TableCell>
                    <TableCell>
                      <Tooltip title="Edit Course">
                        <IconButton
                          color="primary"
                          onClick={() => {
                            setSelectedCourse(course);
                            setOpenEditDialog(true);
                          }}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Course">
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteCourse(course.id || course._id)}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
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
        onClose={() => setOpenAddDialog(false)}
        onSubmit={handleAddCourse}
      />

      {selectedCourse && (
        <EditCourseDialog
          open={openEditDialog}
          onClose={() => setOpenEditDialog(false)}
          onSubmit={handleEditCourse}
          course={selectedCourse}
        />
      )}
    </Box>
  );
};

export default CourseManagement;
