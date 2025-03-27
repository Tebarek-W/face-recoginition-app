import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const useInstructors = () => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Removed TypeScript syntax since this appears to be a JS file

  const fetchInstructors = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('instructors/');
      // Ensure response.data is an array before setting it
      setInstructors(Array.isArray(response.data) ? response.data : []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch instructors'));
    } finally {
      setLoading(false);
    }
  }, []);

  const addInstructor = async (instructorData) => {
    try {
      const response = await api.post('instructors/', instructorData);
      setInstructors(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to add instructor');
      setError(error);
      throw error;
    }
  };

  const updateInstructor = async (id, instructorData) => {
    try {
      const response = await api.patch(`instructors/${id}/`, instructorData);
      setInstructors(prev => 
        prev.map(instructor => 
          instructor.id === id ? response.data : instructor
        )
      );
      return response.data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update instructor');
      setError(error);
      throw error;
    }
  };

  const deleteInstructor = async (id) => {
    try {
      await api.delete(`instructors/${id}/`);
      setInstructors(prev => prev.filter(instructor => instructor.id !== id));
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete instructor');
      setError(error);
      throw error;
    }
  };

  const refreshInstructors = useCallback(() => {
    fetchInstructors();
  }, [fetchInstructors]);

  useEffect(() => {
    fetchInstructors();
  }, [fetchInstructors]);

  return { 
    instructors, 
    loading, 
    error, 
    addInstructor, 
    updateInstructor, 
    deleteInstructor,
    refreshInstructors 
  };
};

export default useInstructors;