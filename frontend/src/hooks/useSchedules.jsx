import { useState, useEffect } from 'react';
import api from '../services/api';

const useSchedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setLoading(true);
        const response = await api.get('/schedules/');
        setSchedules(response.data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch schedules');
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  const addSchedule = async (scheduleData) => {
    try {
      setLoading(true);
      const response = await api.post('/schedules/', scheduleData);
      setSchedules(prev => [...prev, response.data]);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to add schedule');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateSchedule = async (id, scheduleData) => {
    try {
      setLoading(true);
      const response = await api.put(`/schedules/${id}/`, scheduleData);
      setSchedules(prev => prev.map(schedule => 
        schedule.id === id ? response.data : schedule
      ));
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to update schedule');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteSchedule = async (id) => {
    try {
      setLoading(true);
      await api.delete(`/schedules/${id}/`);
      setSchedules(prev => prev.filter(schedule => schedule.id !== id));
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to delete schedule');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { 
    schedules, 
    loading, 
    error, 
    addSchedule, 
    updateSchedule, 
    deleteSchedule 
  };
};

export default useSchedules;