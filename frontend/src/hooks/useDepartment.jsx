import { useState, useEffect } from 'react';
import api from '../services/api';

const useDepartment = () => {
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch department settings
  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        setLoading(true);
        const response = await api.get('/department/settings/');
        setDepartment(response.data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch department settings');
      } finally {
        setLoading(false);
      }
    };

    fetchDepartment();
  }, []);

  // Update department settings
  const updateDepartment = async (settings) => {
    try {
      setLoading(true);
      const response = await api.put('/department/settings/', settings);
      setDepartment(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to update department settings');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { 
    department, 
    loading, 
    error, 
    updateDepartment 
  };
};

export default useDepartment;