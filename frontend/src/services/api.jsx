import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-CSRFToken': getCookie('csrftoken') // Add CSRF token support
  }
});

// Helper function to get CSRF token
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Ensure CSRF token is always fresh
    if (['post', 'put', 'patch', 'delete'].includes(config.method.toLowerCase())) {
      config.headers['X-CSRFToken'] = getCookie('csrftoken');
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Enhanced response interceptor
api.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (process.env.NODE_ENV === 'development') {
      console.log('API Response:', {
        url: response.config.url,
        status: response.status,
        data: response.data
      });
    }
    return response;
  },
  (error) => {
    // Enhanced error handling
    if (error.response) {
      const { status, data } = error.response;
      
      console.error('API Error:', {
        url: error.config.url,
        status: status,
        message: data?.detail || error.message,
        validation: data?.errors // Handle validation errors
      });

      if (status === 401) {
        // Handle token expiration
        console.error('Unauthorized - please login again');
        // Optional: Redirect to login or refresh token
      } else if (status === 403) {
        console.error('Forbidden - insufficient permissions');
      } else if (status === 405) {
        console.error('Method Not Allowed - check endpoint configuration');
      }
    } else {
      console.error('Network Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;