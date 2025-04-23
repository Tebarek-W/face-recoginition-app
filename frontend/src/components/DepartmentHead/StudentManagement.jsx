import React, { useState, useMemo } from 'react';
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
  Tooltip,
  Typography,
  Avatar,
  Badge,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Snackbar,
  TablePagination
} from '@mui/material';
import {
  Add,
  Delete,
  Edit,
  Search,
  VerifiedUser,
  FaceRetouchingNatural,
  Refresh,
  FilterList,
  Sort
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import AddStudentDialog from './dialogs/AddStudentDialog/AddStudentDialog';
import { useStudents } from '../../hooks/useStudents';
import { format } from 'date-fns';
import ViewStudentDialog from './dialogs/ViewStudentDialog';
import EditStudentDialog from './dialogs/EditStudentDialog';

const StudentManagement = () => {
  // State management
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVerification, setFilterVerification] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'student_id', direction: 'asc' });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // API hooks
  const {
    data: apiResponse = {},
    isLoading,
    isError,
    error,
    refetch,
    deleteStudent,
    isDeleting
  } = useStudents();

  // Extract students array with multiple fallbacks
  const students = useMemo(() => {
    return Array.isArray(apiResponse) 
      ? apiResponse 
      : Array.isArray(apiResponse?.data) 
        ? apiResponse.data 
        : Array.isArray(apiResponse?.students) 
          ? apiResponse.students 
          : [];
  }, [apiResponse]);

  // Filter and sort students
  const filteredStudents = useMemo(() => {
    let result = [...students];
    
    // Filtering
    if (searchTerm || filterVerification !== 'all') {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(student => {
        if (!student) return false;
        
        const matchesSearch = 
          (student.student_id?.toString() || '').toLowerCase().includes(searchLower) ||
          (student.first_name || '').toLowerCase().includes(searchLower) ||
          (student.last_name || '').toLowerCase().includes(searchLower) ||
          (student.email || '').toLowerCase().includes(searchLower);
        
        const matchesVerification = 
          filterVerification === 'all' ||
          (filterVerification === 'verified' && student.is_verified) ||
          (filterVerification === 'pending' && !student.is_verified);
        
        return matchesSearch && matchesVerification;
      });
    }
    
    // Sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return result;
  }, [students, searchTerm, filterVerification, sortConfig]);

  // Pagination
  const paginatedStudents = useMemo(() => {
    return filteredStudents.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [filteredStudents, page, rowsPerPage]);

  // Handlers
  const handleDelete = async (studentId) => {
    try {
      await deleteStudent.mutateAsync(studentId);
      showSnackbar('Student deleted successfully', 'success');
      refetch();
    } catch (err) {
      showSnackbar(err.response?.data?.message || 'Failed to delete student', 'error');
    }
  };

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setOpenViewDialog(true);
  };

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setOpenEditDialog(true);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Table columns configuration
  const columns = [
    { 
      id: 'student_id', 
      label: 'Student ID', 
      sortable: true,
      render: (student) => (
        <Typography variant="body2" fontWeight={500}>
          {student.student_id || 'N/A'}
        </Typography>
      )
    },
    { 
      id: 'name', 
      label: 'Student', 
      sortable: true,
      render: (student) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            src={student.profile_picture}
            sx={{ 
              mr: 2,
              width: 40,
              height: 40,
              bgcolor: 'primary.main'
            }}
          >
            {student.first_name?.charAt(0)}{student.last_name?.charAt(0)}
          </Avatar>
          <Box>
            <Typography fontWeight={500}>
              {student.first_name} {student.last_name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {student.gender === 'M' ? 'Male' : 
               student.gender === 'F' ? 'Female' : 'Other'} • 
              {student.date_of_birth ? 
               format(new Date(student.date_of_birth), 'MM/dd/yyyy') : 'N/A'}
            </Typography>
          </Box>
        </Box>
      )
    },
    { 
      id: 'email', 
      label: 'Email', 
      sortable: true,
      render: (student) => (
        <>
          <Typography>{student.email}</Typography>
          <Typography variant="body2" color="text.secondary">
            {student.phone_number || 'No phone number'}
          </Typography>
        </>
      )
    },
    { 
      id: 'verification', 
      label: 'Verification', 
      sortable: false,
      render: (student) => (
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={
            student.is_verified ? (
              <VerifiedUser 
                color="success" 
                sx={{ 
                  fontSize: 16,
                  bgcolor: 'background.paper',
                  borderRadius: '50%',
                  p: 0.5
                }}
              />
            ) : (
              <FaceRetouchingNatural 
                color="warning" 
                sx={{ 
                  fontSize: 16,
                  bgcolor: 'background.paper',
                  borderRadius: '50%',
                  p: 0.5
                }}
              />
            )
          }
        >
          <Chip 
            label={
              student.is_verified ? (
                <>
                  Verified
                  {student.liveness_verified_at && (
                    <Typography 
                      variant="caption" 
                      sx={{ ml: 1 }}
                    >
                      {format(new Date(student.liveness_verified_at), 'MM/dd/yyyy')}
                    </Typography>
                  )}
                </>
              ) : `Pending (${student.verification_step || 0}/5)`
            } 
            color={student.is_verified ? 'success' : 'warning'} 
            size="small"
            sx={{ px: 1 }}
          />
        </Badge>
      )
    },
    { 
      id: 'actions', 
      label: 'Actions', 
      sortable: false,
      render: (student) => (
        <Box display="flex" gap={1}>
          <Tooltip title="View Details">
            <IconButton 
              color="info"
              size="small"
              onClick={() => handleViewStudent(student)}
            >
              <Search fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Student">
            <IconButton 
              color="primary"
              size="small"
              onClick={() => handleEditStudent(student)}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Student">
            <IconButton 
              color="error"
              size="small"
              onClick={() => handleDelete(student.id)}
              disabled={isDeleting}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  if (isError) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Error loading students: {error.message}
        <Button 
          onClick={refetch} 
          color="inherit" 
          size="small"
          sx={{ ml: 2 }}
        >
          Retry
        </Button>
      </Alert>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
        <CardHeader
          title="Student Management"
          titleTypographyProps={{ 
            variant: 'h5',
            fontWeight: 600,
            color: 'primary.main'
          }}
          action={
            <Box display="flex" gap={1}>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={refetch}
                disabled={isLoading}
                sx={{ mr: 1 }}
              >
                Refresh
              </Button>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setOpenAddDialog(true)}
                disabled={isLoading}
              >
                Add Student
              </Button>
            </Box>
          }
        />
        <CardContent>
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            mb: 3,
            flexWrap: 'wrap'
          }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />
              }}
              disabled={isLoading}
              sx={{ flex: 1, minWidth: 250 }}
            />
            
            <FormControl sx={{ minWidth: 200 }} disabled={isLoading}>
              <InputLabel>Verification Status</InputLabel>
              <Select
                value={filterVerification}
                onChange={(e) => setFilterVerification(e.target.value)}
                label="Verification Status"
                startAdornment={<FilterList color="action" sx={{ mr: 1 }} />}
              >
                <MenuItem value="all">All Students</MenuItem>
                <MenuItem value="verified">Verified Only</MenuItem>
                <MenuItem value="pending">Pending Only</MenuItem>
              </Select>
            </FormControl>
          </Box>
          
          {isLoading ? (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              minHeight: 300 
            }}>
              <CircularProgress size={60} />
            </Box>
          ) : (
            <>
              <TableContainer 
                component={Paper}
                sx={{ 
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  mb: 2
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'background.default' }}>
                      {columns.map((column) => (
                        <TableCell 
                          key={column.id}
                          sx={{ 
                            fontWeight: 600,
                            width: column.width,
                            cursor: column.sortable ? 'pointer' : 'default'
                          }}
                          onClick={() => column.sortable && handleSort(column.id)}
                        >
                          <Box display="flex" alignItems="center">
                            {column.label}
                            {column.sortable && (
                              <Sort 
                                sx={{ 
                                  ml: 1,
                                  color: sortConfig.key === column.id ? 
                                    'primary.main' : 'action.active',
                                  transform: sortConfig.key === column.id && 
                                    sortConfig.direction === 'desc' ? 
                                    'rotate(180deg)' : 'none'
                                }} 
                              />
                            )}
                          </Box>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedStudents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={columns.length} align="center" sx={{ py: 4 }}>
                          <Typography variant="body1" color="text.secondary">
                            {students.length === 0 
                              ? 'No students found' 
                              : 'No students match your search criteria'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedStudents.map((student) => (
                        <TableRow 
                          key={student.id} 
                          hover
                          sx={{ '&:last-child td': { borderBottom: 0 } }}
                        >
                          {columns.map((column) => (
                            <TableCell key={`${student.id}-${column.id}`}>
                              {column.render ? column.render(student) : student[column.id]}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredStudents.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{ borderTop: '1px solid', borderColor: 'divider' }}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <AddStudentDialog 
        open={openAddDialog} 
        onClose={() => setOpenAddDialog(false)}
        onSuccess={() => {
          showSnackbar('Student added successfully', 'success');
          refetch();
        }}
      />

      <ViewStudentDialog
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        student={selectedStudent}
      />

      <EditStudentDialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        student={selectedStudent}
        onSuccess={() => {
          showSnackbar('Student updated successfully', 'success');
          refetch();
        }}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </LocalizationProvider>
  );
};

export default StudentManagement;