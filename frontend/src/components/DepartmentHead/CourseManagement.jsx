import React, { useState } from 'react';
import { 
  Button, 
  Card, 
  CardContent, 
  CardHeader, 
  IconButton, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Tooltip
} from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import AddCourseDialog from './dialogs/AddCourseDialog';
import EditCourseDialog from './dialogs/EditCourseDialog';
import useCourses from '../../hooks/useCourses';

const CourseManagement = () => {
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const { courses, loading, error, addCourse, updateCourse, deleteCourse } = useCourses();

  const handleAddCourse = (courseData) => {
    addCourse(courseData);
    setOpenAddDialog(false);
  };

  const handleEditCourse = (courseData) => {
    updateCourse(selectedCourse.id, courseData);
    setOpenEditDialog(false);
  };

  const handleDeleteCourse = (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      deleteCourse(courseId);
    }
  };

  return (
    <>
      <Card>
        <CardHeader
          title="Course Management"
          titleTypographyProps={{ variant: 'h5', fontWeight: 600 }}
          action={
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenAddDialog(true)}
            >
              Add Course
            </Button>
          }
        />
        <CardContent>
          <TableContainer component={Paper} elevation={2}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Course Code</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Course Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Instructor</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Students</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">Loading...</TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">Error: {error}</TableCell>
                  </TableRow>
                ) : courses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">No courses found</TableCell>
                  </TableRow>
                ) : (
                  courses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell>{course.code}</TableCell>
                      <TableCell>{course.name}</TableCell>
                      <TableCell>{course.instructor}</TableCell>
                      <TableCell>{course.students}</TableCell>
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
                            onClick={() => handleDeleteCourse(course.id)}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
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
    </>
  );
};

export default CourseManagement;