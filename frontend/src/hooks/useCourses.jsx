import { useState, useEffect } from 'react';
import api from '../services/api';

const useCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await api.get('/courses/');
        setCourses(response.data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const addCourse = async (courseData) => {
    try {
      setLoading(true);
      const response = await api.post('/courses/', courseData);
      setCourses(prev => [...prev, response.data]);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to add course');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCourse = async (id, courseData) => {
    try {
      setLoading(true);
      const response = await api.put(`/courses/${id}/`, courseData);
      setCourses(prev => prev.map(course => 
        course.id === id ? response.data : course
      ));
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to update course');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteCourse = async (id) => {
    try {
      setLoading(true);
      await api.delete(`/courses/${id}/`);
      setCourses(prev => prev.filter(course => course.id !== id));
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to delete course');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { courses, loading, error, addCourse, updateCourse, deleteCourse };
};

export default useCourses;