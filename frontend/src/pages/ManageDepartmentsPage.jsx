import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, TextField, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  CircularProgress, Alert, Snackbar, Chip, Avatar, Stack,
  Tooltip, useMediaQuery, useTheme, MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import { Add, Edit, Delete, Check, Close, Person } from '@mui/icons-material';
import { format } from 'date-fns';

const API_BASE_URL = 'http://127.0.0.1:8000/'; // Update with your backend URL

const ManageDepartmentsPage = () => {
  // Data state
  const [departments, setDepartments] = useState([]);
  const [heads, setHeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentDept, setCurrentDept] = useState(null);
  const [formData, setFormData] = useState({ 
    name: '',
    head_of_department_id: null 
  });
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Enhanced fetch function with error handling
  const fetchWithAuth = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Request failed');
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      return await response.text();
    } catch (error) {
      console.error(`API call to ${endpoint} failed:`, error);
      throw error;
    }
  };

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [departmentsData, headsData] = await Promise.all([
          fetchWithAuth('/api/departments/'),
          fetchWithAuth('/api/users/heads/')
        ]);
        
        setDepartments(departmentsData);
        setHeads(headsData);
      } catch (err) {
        setError(err.message || 'Failed to load data');
        setSnackbar({
          open: true,
          message: 'Failed to load data. Please try again.',
          severity: 'error'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), isMobile ? 'PP' : 'PPpp');
    } catch {
      return 'Invalid date';
    }
  };

  // API operations
  const handleAdd = async (payload) => {
    return fetchWithAuth('/api/departments/', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  };

  const handleEdit = async (id, payload) => {
    return fetchWithAuth(`/api/departments/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
  };

  const handleDelete = async (id) => {
    return fetchWithAuth(`/api/departments/${id}/`, {
      method: 'DELETE'
    });
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.name.trim()) {
      setSnackbar({
        open: true,
        message: 'Department name is required',
        severity: 'error'
      });
      return;
    }

    const payload = {
      name: formData.name.trim(),
      ...(formData.head_of_department_id && {
        head_of_department_id: formData.head_of_department_id
      })
    };

    try {
      let updatedDepartments;
      if (currentDept) {
        const updatedDept = await handleEdit(currentDept.id, payload);
        updatedDepartments = departments.map(d => 
          d.id === currentDept.id ? updatedDept : d
        );
      } else {
        const newDept = await handleAdd(payload);
        updatedDepartments = [...departments, newDept];
      }

      setDepartments(updatedDepartments);
      setSnackbar({
        open: true,
        message: `Department ${currentDept ? 'updated' : 'created'} successfully!`,
        severity: 'success'
      });
      handleCloseDialog();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || 'Operation failed',
        severity: 'error'
      });
    }
  };

  // Handle department deletion with confirmation
  const handleDeleteConfirm = async (id) => {
    if (!window.confirm('Are you sure you want to delete this department?')) {
      return;
    }

    try {
      await handleDelete(id);
      setDepartments(departments.filter(d => d.id !== id));
      setSnackbar({
        open: true,
        message: 'Department deleted successfully!',
        severity: 'success'
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || 'Delete failed',
        severity: 'error'
      });
    }
  };

  // Dialog handlers
  const handleOpenDialog = (dept = null) => {
    setCurrentDept(dept);
    setFormData({
      name: dept?.name || '',
      head_of_department_id: dept?.head_of_department?.id || null
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setCurrentDept(null);
  };

  return (
    <Box sx={{ p: isMobile ? 1 : 3 }}>
      {/* Header with action buttons */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between', 
        alignItems: isMobile ? 'flex-start' : 'center',
        gap: 2,
        mb: 3 
      }}>
        <Typography variant="h4" component="h1">Manage Departments</Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />} 
          onClick={() => handleOpenDialog()}
          sx={{ minWidth: 180 }}
          aria-label="Add new department"
        >
          Add Department
        </Button>
      </Box>

      {/* Loading/Error States */}
      {isLoading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Departments Table */}
      {!isLoading && !error && (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table aria-label="Departments table">
            <TableHead sx={{ bgcolor: 'background.default' }}>
              <TableRow>
                {!isMobile && <TableCell>ID</TableCell>}
                <TableCell>Name</TableCell>
                <TableCell>Head</TableCell>
                {!isMobile && <TableCell>Created</TableCell>}
                {!isMobile && <TableCell>Updated</TableCell>}
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {departments.map(dept => (
                <TableRow key={dept.id} hover>
                  {!isMobile && <TableCell>{dept.id}</TableCell>}
                  <TableCell>
                    <Chip 
                      label={dept.name} 
                      color="primary" 
                      size="small" 
                      sx={{ fontWeight: 500 }}
                    />
                  </TableCell>
                  <TableCell>
                    {dept.head_of_department ? (
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Avatar sx={{ width: 32, height: 32 }}>
                          {dept.head_of_department.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2">
                            {dept.head_of_department.name}
                          </Typography>
                          {!isMobile && (
                            <Typography variant="caption" color="text.secondary">
                              {dept.head_of_department.email}
                            </Typography>
                          )}
                        </Box>
                      </Stack>
                    ) : (
                      <Chip 
                        icon={<Person />}
                        label={isMobile ? '' : "Not assigned"}
                        variant="outlined"
                        size="small"
                      />
                    )}
                  </TableCell>
                  {!isMobile && (
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(dept.created_at)}
                      </Typography>
                    </TableCell>
                  )}
                  {!isMobile && (
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(dept.updated_at)}
                      </Typography>
                    </TableCell>
                  )}
                  <TableCell align="center">
                    <Tooltip title="Edit department">
                      <IconButton 
                        onClick={() => handleOpenDialog(dept)}
                        aria-label={`Edit ${dept.name}`}
                      >
                        <Edit color="primary" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete department">
                      <IconButton 
                        onClick={() => handleDeleteConfirm(dept.id)}
                        aria-label={`Delete ${dept.name}`}
                      >
                        <Delete color="error" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add/Edit Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog} 
        fullWidth 
        maxWidth="sm"
        aria-labelledby="department-dialog-title"
      >
        <DialogTitle id="department-dialog-title">
          {currentDept ? `Edit Department: ${currentDept.name}` : 'Create New Department'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Department Name"
              fullWidth
              variant="outlined"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              sx={{ mt: 1 }}
              inputProps={{
                'aria-label': 'Department name input'
              }}
            />

            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel id="head-select-label">Head of Department</InputLabel>
              <Select
                labelId="head-select-label"
                value={formData.head_of_department_id || ''}
                label="Head of Department"
                onChange={(e) => setFormData({
                  ...formData, 
                  head_of_department_id: e.target.value || null
                })}
                disabled={heads.length === 0}
              >
                <MenuItem value="">
                  <em>No head assigned</em>
                </MenuItem>
                {heads.map(head => (
                  <MenuItem key={head.id} value={head.id}>
                    {head.name}
                  </MenuItem>
                ))}
              </Select>
              {heads.length === 0 && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                  No department heads available. Please create users with HEAD role first.
                </Typography>
              )}
            </FormControl>

            {currentDept && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Created: {formatDate(currentDept.created_at)}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  Last Updated: {formatDate(currentDept.updated_at)}
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={handleCloseDialog} 
              startIcon={<Close />}
              sx={{ minWidth: 100 }}
              aria-label="Cancel department edit"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              startIcon={<Check />}
              sx={{ minWidth: 100 }}
              aria-label={currentDept ? 'Update department' : 'Create department'}
              disabled={isLoading}
            >
              {currentDept ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ManageDepartmentsPage;