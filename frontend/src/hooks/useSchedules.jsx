// hooks/useSchedules.js
import { useState, useEffect } from 'react';
import api from '../services/api';

const useSchedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const response = await api.get('/schedules/');
      setSchedules(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const addSchedule = async (scheduleData) => {
    try {
      setLoading(true);
      const response = await api.post('/schedules/', scheduleData);
      setSchedules(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError(err.response?.data || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateSchedule = async (id, scheduleData) => {
    try {
      setLoading(true);
      const response = await api.put(`/schedules/${id}/`, scheduleData);
      setSchedules(prev => prev.map(s => s.id === id ? response.data : s));
      return response.data;
    } catch (err) {
      setError(err.response?.data || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteSchedule = async (id) => {
    try {
      setLoading(true);
      await api.delete(`/schedules/${id}/`);
      setSchedules(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      setError(err.response?.data || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  return {
    schedules,
    loading,
    error,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    refresh: fetchSchedules
  };
};

export default useSchedules;