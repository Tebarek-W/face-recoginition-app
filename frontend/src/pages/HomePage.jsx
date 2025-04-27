import React, { useState, useEffect } from 'react';
import { Typography, Box, Button, Badge, IconButton, Popover, List, ListItem, ListItemText } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [wsConnected, setWsConnected] = useState(false);

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
    setUnreadCount(0); // Mark all as read when opened
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const wsUrl = process.env.NODE_ENV === 'production'
      ? 'wss://yourproductionurl.com/ws/schedule_notifications/' // replace with production URL
      : 'ws://127.0.0.1:8000/ws/schedule_notifications/'; // WebSocket URL for local development

    let socket;
    let retryCount = 0;
    const maxRetries = 3;

    const connectWebSocket = () => {
      socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        console.log('WebSocket successfully connected');
        setWsConnected(true);
        retryCount = 0; // Reset retry counter on success
      };

      socket.onerror = (e) => {
        console.error('WebSocket error:', e);
        setWsConnected(false);
      };

      socket.onclose = (e) => {
        console.log(`WebSocket closed (code ${e.code})`);
        if (e.code !== 1000 && retryCount < maxRetries) { // 1000 = normal closure
          retryCount++;
          console.log(`Retrying connection (attempt ${retryCount})`);
          setTimeout(connectWebSocket, 2000 * retryCount); // Exponential backoff
        }
      };

      socket.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          setNotifications(prev => [data, ...prev]);
          setUnreadCount(prev => prev + 1);
        } catch (err) {
          console.error('Failed to parse WebSocket message:', err);
        }
      };
    };

    connectWebSocket();

    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close(1000, 'Component unmounted');
      }
    };
  }, []);

  const open = Boolean(anchorEl);
  const id = open ? 'notification-popover' : undefined;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        background: 'linear-gradient(135deg, #1a1a1a, #003366)',
        position: 'relative',
        overflow: 'hidden',
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
      <Box sx={{ position: 'absolute', top: 20, right: 20, zIndex: 3 }}>
        <IconButton color="inherit" onClick={handleNotificationClick}>
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon fontSize="large" />
          </Badge>
        </IconButton>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <Box sx={{ width: 360, maxHeight: 400, overflow: 'auto' }}>
            <List>
              {notifications.length > 0 ? (
                notifications.map((notification, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={notification.message}
                      secondary={new Date().toLocaleString()}
                    />
                  </ListItem>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="No notifications" />
                </ListItem>
              )}
            </List>
          </Box>
        </Popover>
      </Box>

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
          marginTop: '64px',
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
