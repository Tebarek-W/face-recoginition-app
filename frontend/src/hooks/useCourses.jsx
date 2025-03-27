import { useState, useEffect } from 'react';
import api from '../services/api';
import { useSnackbar } from 'notistack';

const useCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/courses/');
      setCourses(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch courses');
      enqueueSnackbar('Failed to load courses', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Add refresh function
  const refresh = () => {
    setError(null);
    fetchCourses();
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const addCourse = async (courseData) => {
    try {
      setLoading(true);
      const response = await api.post('/courses/', courseData);
      setCourses(prev => [...prev, response.data]);
      enqueueSnackbar('Course added successfully', { variant: 'success' });
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to add course';
      enqueueSnackbar(errorMsg, { variant: 'error' });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCourse = async (id, courseData) => {
    try {
      setLoading(true);
      const response = await api.patch(`/courses/${id}/`, courseData);
      setCourses(prev => prev.map(c => 
        c.id === id ? response.data : c
      ));
      enqueueSnackbar('Course updated successfully', { variant: 'success' });
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update course';
      enqueueSnackbar(errorMsg, { variant: 'error' });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteCourse = async (id) => {
    try {
      setLoading(true);
      await api.delete(`/courses/${id}/`);
      setCourses(prev => prev.filter(c => c.id !== id));
      enqueueSnackbar('Course deleted successfully', { variant: 'success' });
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to delete course';
      enqueueSnackbar(errorMsg, { variant: 'error' });
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
    refresh 
  };
};

export default useCourses;