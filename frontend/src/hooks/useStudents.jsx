import { useState, useEffect } from 'react';
import api from '../services/api'; 
const useStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await api.get('/students/');
        setStudents(response.data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch students');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const addStudent = async (studentData) => {
    try {
      setLoading(true);
      const response = await api.post('/students/', studentData);
      setStudents(prev => [...prev, response.data]);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to add student');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const bulkEnroll = async (file) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post('/students/bulk-enroll/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setStudents(prev => [...prev, ...response.data]);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to bulk enroll students');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { students, loading, error, addStudent, bulkEnroll };
};

export default useStudents;