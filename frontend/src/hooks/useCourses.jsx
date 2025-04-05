import { useState, useEffect } from 'react';
import api from '../services/api';
import { useSnackbar } from 'notistack';

const useCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const showSnackbar = (message, variant = 'success') => {
    enqueueSnackbar(message, { 
      variant,
      autoHideDuration: variant === 'error' ? 5000 : 3000,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'center'
      }
    });
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('courses/');
      setCourses(response.data || []);
    } catch (err) {
      console.error('Fetch courses error:', err);
      const errorMessage = err.response?.data?.detail || 
                         err.response?.data?.message || 
                         'Failed to fetch courses';
      setError(errorMessage);
      showSnackbar(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    fetchCourses();
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const addCourse = async (courseData) => {
    try {
      setLoading(true);
      const response = await api.post('courses/', courseData);
      setCourses(prev => [...prev, response.data]);
      showSnackbar('Course added successfully');
      return response.data;
    } catch (err) {
      console.error('Add course error:', err);
      const errorMessage = err.response?.data?.detail || 
                         err.response?.data?.message || 
                         Object.values(err.response?.data || {})[0]?.[0] || 
                         'Failed to add course';
      showSnackbar(errorMessage, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCourse = async (id, courseData) => {
    try {
      setLoading(true);
      console.log('Updating course:', id, courseData); // Debug log
      
      // Clean the data by removing undefined values
      const cleanData = Object.fromEntries(
        Object.entries(courseData).filter(([_, v]) => v !== undefined)
      );
      
      console.log('Cleaned data for API:', cleanData); // Debug log
      
      const response = await api.patch(`courses/${id}/`, cleanData);
      
      setCourses(prev => prev.map(c => 
        c.id === id ? { ...c, ...response.data } : c
      ));
      
      enqueueSnackbar('Course updated successfully', { 
        variant: 'success',
        autoHideDuration: 3000
      });
      
      return response.data;
    } catch (error) {
      console.error('Update failed:', {
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      
      let errorMessage = 'Failed to update course';
      if (error.response?.data) {
        if (error.response.data.detail) {
          errorMessage = error.response.data.detail;
        } else if (typeof error.response.data === 'object') {
          errorMessage = Object.entries(error.response.data)
            .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
            .join(' | ');
        }
      }
      
      enqueueSnackbar(errorMessage, { 
        variant: 'error',
        autoHideDuration: 5000
      });
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteCourse = async (id) => {
    try {
      setLoading(true);
      await api.delete(`courses/${id}/`);
      setCourses(prev => prev.filter(c => c.id !== id));
      showSnackbar('Course deleted successfully');
    } catch (err) {
      console.error('Delete course error:', err);
      const errorMessage = err.response?.data?.detail || 
                         err.response?.data?.message || 
                         'Failed to delete course';
      showSnackbar(errorMessage, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { 
    courses, 
    loading, 
    error, 
    addCourse, 
    updateCourse, 
    deleteCourse,
    refresh,
    fetchCourses 
  };
};

export default useCourses;