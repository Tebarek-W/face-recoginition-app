import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Request interceptor for API calls
api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If unauthorized and we haven't already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) throw new Error('No refresh token available');
        
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/'}auth/refresh/`,
          { refresh: refreshToken }
        );
        
        localStorage.setItem('access_token', response.data.access);
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
        
        return api(originalRequest);
      } catch (err) {
        // Clear tokens and redirect to login if refresh fails
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(err);
      }
    }
    
    return Promise.reject(error);
  }
);

// Helper functions for common HTTP methods
const get = (url, params = {}, config = {}) => 
  api.get(url, { params, ...config });

const post = (url, data, config = {}) => 
  api.post(url, data, config);

const put = (url, data, config = {}) => 
  api.put(url, data, config);

const patch = (url, data, config = {}) => 
  api.patch(url, data, config);

const del = (url, config = {}) => 
  api.delete(url, config);

const upload = (url, formData, config = {}) => {
  const headers = {
    'Content-Type': 'multipart/form-data',
    ...config.headers
  };
  return api.post(url, formData, { ...config, headers });
};

export default {
  ...api,
  get,
  post,
  put,
  patch,
  delete: del,
  upload
};