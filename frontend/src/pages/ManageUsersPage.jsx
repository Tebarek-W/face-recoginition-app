import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  IconButton, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Card,
  CardContent,
  Grid,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  useTheme,
  Tooltip
} from '@mui/material';
import { 
  Delete, 
  Edit, 
  Add, 
  CheckCircle, 
  Cancel,
  Person,
  ExpandMore,
  ExpandLess,
  FilterList,
  Clear
} from '@mui/icons-material';
import axios from 'axios';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    role: 'STUDENT',
    is_active: true,
  });
  const [editUser, setEditUser] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [expandedUser, setExpandedUser] = useState(null);
  const [roleFilter, setRoleFilter] = useState('ALL');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Roles for filter dropdown
  const roleOptions = [
    { value: 'ALL', label: 'All Roles' },
    { value: 'ADMIN', label: 'Admin' },
    { value: 'HEAD', label: 'Head of Department' },
    { value: 'INSTRUCTOR', label: 'Instructor' },
    { value: 'STUDENT', label: 'Student' }
  ];

  // Fetch users from the backend
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/auth/users/');
      setUsers(response.data);
      setFilteredUsers(response.data); // Initialize filtered users with all users
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Apply filters based on selected role
  const applyFilters = () => {
    if (roleFilter === 'ALL') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => user.role === roleFilter);
      setFilteredUsers(filtered);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setRoleFilter('ALL');
    setFilteredUsers(users);
  };

  // Add a new user
  const handleAddUser = async () => {
    if (!newUser.username || !newUser.email || !newUser.password) {
      alert('Please fill out all required fields (Username, Email, Password).');
      return;
    }

    try {
      await axios.post('http://127.0.0.1:8000/api/auth/register/', newUser);
      setNewUser({ username: '', email: '', password: '', role: 'STUDENT', is_active: true });
      fetchUsers();
    } catch (error) {
      console.error('Error adding user:', error);
      alert('Failed to add user. Please check the console for details.');
    }
  };

  // Delete a user
  const handleDeleteUser = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/auth/users/${userToDelete}/delete/`);
      fetchUsers();
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user. Please check the console for details.');
    }
  };

  // Update an existing user
  const handleUpdateUser = async () => {
    try {
      const payload = {
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        is_active: newUser.is_active,
        ...(newUser.password && { password: newUser.password })
      };

      await axios.put(`http://127.0.0.1:8000/api/auth/users/${editUser.id}/`, payload);
      setEditUser(null);
      setNewUser({ username: '', email: '', password: '', role: 'STUDENT', is_active: true });
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user. Please check the console for details.');
    }
  };

  // Set the user to be edited
  const handleEditUser = (user) => {
    setEditUser(user);
    setNewUser({
      username: user.username,
      email: user.email,
      password: '',
      role: user.role,
      is_active: user.is_active,
    });
  };

  // Toggle user details expansion
  const toggleExpandUser = (userId) => {
    setExpandedUser(expandedUser === userId ? null : userId);
  };

  // Apply filters when roleFilter or users change
  useEffect(() => {
    applyFilters();
  }, [roleFilter, users]);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Box sx={{ 
      p: 3,
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          mb: 4,
          fontWeight: 600,
          color: theme.palette.primary.dark
        }}
      >
        User Management
      </Typography>

      {/* User Form Card */}
      <Card 
        elevation={3} 
        sx={{ 
          mb: 4,
          borderRadius: 2,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)'
        }}
      >
        <CardContent>
          <Typography 
            variant="h6" 
            gutterBottom 
            sx={{ 
              mb: 3,
              fontWeight: 500,
              color: theme.palette.text.primary
            }}
          >
            {editUser ? `Edit User: ${editUser.username}` : 'Add New User'}
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Username"
                variant="outlined"
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label={editUser ? "New Password (leave blank to keep current)" : "Password"}
                variant="outlined"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                required={!editUser}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Role</InputLabel>
                <Select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  label="Role"
                >
                  <MenuItem value="ADMIN">Admin</MenuItem>
                  <MenuItem value="HEAD">Head of Department</MenuItem>
                  <MenuItem value="INSTRUCTOR">Instructor</MenuItem>
                  <MenuItem value="STUDENT">Student</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  value={newUser.is_active}
                  onChange={(e) => setNewUser({ ...newUser, is_active: e.target.value === 'true' })}
                  label="Status"
                >
                  <MenuItem value={true}>Active</MenuItem>
                  <MenuItem value={false}>Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              {editUser ? (
                <>
                  <Button 
                    variant="outlined" 
                    onClick={() => {
                      setEditUser(null);
                      setNewUser({ username: '', email: '', password: '', role: 'STUDENT', is_active: true });
                    }}
                    sx={{ mr: 2 }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="contained" 
                    onClick={handleUpdateUser}
                    startIcon={<CheckCircle />}
                  >
                    Update User
                  </Button>
                </>
              ) : (
                <Button 
                  variant="contained" 
                  onClick={handleAddUser}
                  startIcon={<Add />}
                >
                  Add User
                </Button>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Filter Section */}
      <Card 
        elevation={3} 
        sx={{ 
          mb: 3,
          borderRadius: 2,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)'
        }}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <FilterList sx={{ mr: 1 }} /> Filters
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Filter by Role</InputLabel>
                <Select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  label="Filter by Role"
                >
                  {roleOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Button
                variant="outlined"
                onClick={clearFilters}
                startIcon={<Clear />}
                disabled={roleFilter === 'ALL'}
                sx={{ height: '56px' }} // Match the height of the select input
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Users Table - Now using filteredUsers */}
      <Card 
        elevation={3} 
        sx={{ 
          borderRadius: 2,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)'
        }}
      >
        <TableContainer>
          <Table aria-label="users table">
            <TableHead>
              <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
                <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                {!isMobile && <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>}
                <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                <TableCell sx={{ width: '40px' }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <React.Fragment key={user.id}>
                  <TableRow
                    hover
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2, bgcolor: theme.palette.primary.main }}>
                          <Person />
                        </Avatar>
                        <Box>
                          <Typography variant="body1" fontWeight={500}>
                            {user.username}
                          </Typography>
                          {isMobile && (
                            <Typography variant="body2" color="text.secondary">
                              {user.email}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    {!isMobile && <TableCell>{user.email}</TableCell>}
                    <TableCell>
                      <Chip 
                        label={user.role} 
                        color={
                          user.role === 'ADMIN' ? 'primary' : 
                          user.role === 'HEAD' ? 'secondary' : 
                          'default'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={user.is_active ? 'Active' : 'Inactive'} 
                        color={user.is_active ? 'success' : 'error'}
                        icon={user.is_active ? <CheckCircle /> : <Cancel />}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex' }}>
                        <Tooltip title="Edit">
                          <IconButton 
                            onClick={() => handleEditUser(user)}
                            aria-label="edit user"
                            color="primary"
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton 
                            onClick={() => {
                              setUserToDelete(user.id);
                              setDeleteDialogOpen(true);
                            }}
                            aria-label="delete user"
                            color="error"
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <IconButton 
                        size="small" 
                        onClick={() => toggleExpandUser(user.id)}
                        aria-label={expandedUser === user.id ? 'Collapse details' : 'Expand details'}
                      >
                        {expandedUser === user.id ? <ExpandLess /> : <ExpandMore />}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  {expandedUser === user.id && (
                    <TableRow>
                      <TableCell colSpan={isMobile ? 4 : 6} sx={{ p: 0 }}>
                        <Box sx={{ 
                          p: 2,
                          backgroundColor: theme.palette.grey[50],
                          borderBottom: `1px solid ${theme.palette.grey[200]}`
                        }}>
                          <Typography variant="body2">
                            <strong>User ID:</strong> {user.id}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Created:</strong> {new Date(user.created_at).toLocaleString()}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Last Updated:</strong> {new Date(user.updated_at).toLocaleString()}
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this user? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteUser} 
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageUsers;