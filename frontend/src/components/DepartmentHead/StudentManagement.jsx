import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  CardHeader, 
  Chip, 
  IconButton, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TextField,
  Tooltip
} from '@mui/material';
import { Add, Delete, Edit, FileUpload, FilterList, Search } from '@mui/icons-material';
import AddStudentDialog from './dialogs/AddStudentDialog';
import BulkEnrollDialog from './dialogs/BulkEnrollDialog';
import useStudents from "../../hooks/useStudents";

const StudentManagement = () => {
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openBulkDialog, setOpenBulkDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { students, loading, error, addStudent, bulkEnroll } = useStudents();

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStudent = (studentData) => {
    addStudent(studentData);
    setOpenAddDialog(false);
  };

  const handleBulkEnroll = (file) => {
    bulkEnroll(file);
    setOpenBulkDialog(false);
  };

  return (
    <>
      <Card>
        <CardHeader
          title="Student Enrollment"
          titleTypographyProps={{ variant: 'h5', fontWeight: 600 }}
          action={
            <Box>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setOpenAddDialog(true)}
                sx={{ mr: 1 }}
              >
                Add Student
              </Button>
              <Button
                variant="outlined"
                startIcon={<FileUpload />}
                onClick={() => setOpenBulkDialog(true)}
              >
                Bulk Enroll
              </Button>
            </Box>
          }
        />
        <CardContent>
          <Box sx={{ display: 'flex', mb: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />
              }}
            />
            <Tooltip title="Advanced Filters">
              <Button 
                variant="outlined" 
                startIcon={<FilterList />} 
                sx={{ ml: 2 }}
              >
                Filters
              </Button>
            </Tooltip>
          </Box>
          
          <TableContainer component={Paper} elevation={2}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Courses</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">Loading...</TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">Error: {error}</TableCell>
                  </TableRow>
                ) : filteredStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">No students found</TableCell>
                  </TableRow>
                ) : (
                  filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>{student.id}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.courses.join(', ')}</TableCell>
                      <TableCell>
                        <Chip 
                          label={student.active ? 'Active' : 'Inactive'} 
                          color={student.active ? 'success' : 'error'} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Edit Student">
                          <IconButton color="primary">
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Student">
                          <IconButton color="error">
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

      <AddStudentDialog 
        open={openAddDialog} 
        onClose={() => setOpenAddDialog(false)} 
        onSubmit={handleAddStudent} 
      />

      <BulkEnrollDialog 
        open={openBulkDialog} 
        onClose={() => setOpenBulkDialog(false)} 
        onSubmit={handleBulkEnroll} 
      />
    </>
  );
};

export default StudentManagement;