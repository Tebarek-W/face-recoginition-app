import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Switch, Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { DarkModeContext } from '../App';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
  const { isAuthenticated, logout } = useContext(AuthContext); // Use AuthContext

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleLogout = async () => {
    try {
      // Call the backend logout endpoint (if needed)
      await logout();
      // Redirect to login page
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Hide the logout button on the homepage and login page
  const isHomePage = location.pathname === '/';
  const isLoginPage = location.pathname === '/login';

  return (
    <AppBar
      position="fixed" // Fixed position
      sx={{
        backgroundColor: '#0A192F', // Dark Blue color
        boxShadow: 'none',
        height: '64px', // Fixed height
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            color: '#FFFFFF', // White text for contrast
          }}
        >
          Haramaya University
        </Typography>
        <Switch checked={darkMode} onChange={toggleDarkMode} color="secondary" />
        {isAuthenticated && !isHomePage && !isLoginPage && ( // Conditionally render the logout button
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        )}
        {!isAuthenticated && !isLoginPage && ( // Conditionally render the login button
          <Button color="inherit" onClick={handleLoginClick}>
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;