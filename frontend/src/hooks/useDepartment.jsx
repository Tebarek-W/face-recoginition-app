import { useState, useEffect } from 'react';
import api from '../services/api';

const useDepartment = () => {
  const [departments, setDepartments] = useState([]); // Changed to array for multiple departments
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all departments
  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/departments/'); // Changed endpoint
      setDepartments(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to fetch departments');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Create new department
  const createDepartment = async (departmentData) => {
    try {
      setLoading(true);
      const response = await api.post('/departments/', departmentData);
      setDepartments(prev => [...prev, response.data]);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to create department');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update department
  const updateDepartment = async (id, departmentData) => {
    try {
      setLoading(true);
      const response = await api.put(`/departments/${id}/`, departmentData);
      setDepartments(prev => 
        prev.map(dept => dept.id === id ? response.data : dept)
      );
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to update department');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete department
  const deleteDepartment = async (id) => {
    try {
      setLoading(true);
      await api.delete(`/departments/${id}/`);
      setDepartments(prev => prev.filter(dept => dept.id !== id));
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to delete department');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Initialize by fetching departments
  useEffect(() => {
    fetchDepartments();
  }, []);

  return { 
    departments, 
    loading, 
    error,
    fetchDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment
  };
};

export default useDepartment;