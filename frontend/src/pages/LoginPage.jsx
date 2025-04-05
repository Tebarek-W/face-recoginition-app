import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  FormControlLabel,
  Checkbox,
  Link,
  useTheme
} from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/users/login/', {
        username: email,
        password: password,
      });
      const { access, refresh, role, id, name } = response.data;
      const user = { id, name, role };
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('accessToken', access);
      storage.setItem('refreshToken', refresh);
      storage.setItem('user', JSON.stringify(user));
      login(user);
      if (role === 'INSTRUCTOR') navigate('/instructor');
      else if (role === 'STUDENT') navigate('/student');
      else if (role === 'HEAD') navigate('/hod');
      else if (role === 'ADMIN') navigate('/admin');
      else setError('Invalid role');
    } catch (error) {
      setError(error.response?.data?.detail || 'Invalid credentials. Please try again.');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.light} 100%)`,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23${theme.palette.primary.main.replace('#', '')}' opacity='0.05'/%3E%3C/svg%3E")`,
        }
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 450,
          borderRadius: theme.shape.borderRadius * 2,
          boxShadow: theme.shadows[6],
          overflow: 'visible',
          position: 'relative',
          '&:before': {
            content: '""',
            position: 'absolute',
            top: -8,
            left: -8,
            right: -8,
            bottom: -8,
            borderRadius: theme.shape.borderRadius * 2 + 8,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            zIndex: -1,
            opacity: 0.3,
            filter: 'blur(8px)'
          }
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700,
                color: theme.palette.primary.main,
                mb: 1
              }}
            >
              System Login
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Enter your credentials to continue
            </Typography>
          </Box>

          {error && (
            <Typography 
              color="error" 
              align="center" 
              sx={{ 
                mb: 3,
                p: 1.5,
                backgroundColor: theme.palette.error.light,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {error}
            </Typography>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Email Address"
              variant="outlined"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                sx: {
                  borderRadius: 1,
                  '& fieldset': {
                    borderColor: theme.palette.divider
                  }
                }
              }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                sx: {
                  borderRadius: 1,
                  '& fieldset': {
                    borderColor: theme.palette.divider
                  }
                }
              }}
            />

            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              my: 2
            }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    color="primary"
                  />
                }
                label="Remember me"
              />
              <Link 
                href="#" 
                variant="body2"
                sx={{ 
                  textDecoration: 'none',
                  color: theme.palette.text.secondary,
                  '&:hover': {
                    color: theme.palette.primary.main
                  }
                }}
              >
                Forgot password?
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              sx={{ 
                mt: 2, 
                mb: 3,
                padding: theme.spacing(1.5),
                fontSize: '1rem',
                fontWeight: 600,
                letterSpacing: 0.5,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[4]
                }
              }}
            >
              Sign In
            </Button>

            <Typography variant="body2" align="center" color="text.secondary">
              Need access?{' '}
              <Link 
                href="#" 
                sx={{ 
                  fontWeight: 600,
                  textDecoration: 'none',
                  color: theme.palette.primary.main
                }}
              >
                Contact administrator
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPage;