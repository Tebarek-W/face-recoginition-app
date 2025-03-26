// src/pages/HomePage.js
import React from 'react';
import { Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login'); // Redirect to the login page
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw', // Ensure full viewport width
        background: 'linear-gradient(135deg, #1a1a1a, #003366)',
        position: 'relative',
        overflow: 'hidden', // Prevent horizontal scrolling
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: '#fff',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'url(https://www.transparenttextures.com/patterns/connected.png)',
          opacity: 0.1,
          zIndex: 1,
        },
      }}
    >
      {/* Abstract AI/Facial Recognition Icons */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          height: '100%',
          backgroundImage: 'url(https://www.svgrepo.com/show/306502/artificial-intelligence-face.svg)',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'contain',
          opacity: 0.1,
          zIndex: 1,
        }}
      />

      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '800px',
          width: '100%',
          padding: 3,
          marginTop: '64px', // Add marginTop to account for Navbar height
        }}
      >
        <Typography
          variant="h1"
          gutterBottom
          sx={{
            fontSize: { xs: '2.5rem', sm: '4rem' },
            fontWeight: 700,
            background: 'linear-gradient(45deg, #00bcd4, #00ff88)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Welcome to Haramaya University
        </Typography>
        <Typography
          variant="h5"
          paragraph
          sx={{
            color: '#ddd',
            maxWidth: '600px',
            margin: '0 auto',
          }}
        >
          Facial Recognition Based Class Attendance System
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={handleLoginClick}
          sx={{
            mt: 4,
            padding: '12px 36px',
            fontSize: '1.1rem',
            background: 'linear-gradient(45deg, #00bcd4, #00ff88)',
            border: 'none',
            borderRadius: '50px',
            boxShadow: '0 4px 15px rgba(0, 188, 212, 0.4)',
            transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: '0 6px 20px rgba(0, 188, 212, 0.6)',
            },
          }}
        >
          Login
        </Button>
      </Box>
    </Box>
  );
};

export default HomePage;