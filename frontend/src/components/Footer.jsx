// src/components/Footer.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#0A192F', // Dark Blue color (same as Navbar)
        color: '#FFFFFF', // White text for contrast
        textAlign: 'center',
        padding: 2,
        position: 'fixed', // Fixed position
        bottom: 0, // Stick to the bottom of the viewport
        width: '100%', // Full width
        height: '64px', // Fixed height (same as Navbar)
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography variant="body1">
        © {new Date().getFullYear()} Haramaya University. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;