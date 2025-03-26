// src/hooks/useInstructors.js
import { useState, useEffect } from 'react';
import api from '../services/api';

const useInstructors = () => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        setLoading(true);
        const response = await api.get('/instructors/');
        setInstructors(response.data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch instructors');
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, []);

  return { instructors, loading, error };
};

export default useInstructors;