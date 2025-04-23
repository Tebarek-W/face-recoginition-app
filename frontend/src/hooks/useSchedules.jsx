import { useState, useEffect } from 'react';
import api from '../services/api';

const useSchedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Format schedule data consistently
  const formatScheduleData = (data) => {
    const formatTime = (time) => {
      if (!time) return null;
      // Convert HH:MM to HH:MM:00 if needed
      const parts = String(time).split(':');
      if (parts.length === 2) return `${time}:00`;
      if (parts.length === 3) return time;
      return null;
    };

    return {
      course: data.course?.id || data.course,
      instructor: data.instructor?.id || data.instructor,
      day: data.day?.charAt(0).toUpperCase() + data.day?.slice(1).toLowerCase(),
      start_time: formatTime(data.start_time),
      end_time: formatTime(data.end_time),
      room: data.room || 'TBA'
    };
  };

  // Fetch all schedules
  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const response = await api.get('schedules/');
      setSchedules(response.data);
      setError(null);
    } catch (err) {
      setError({
        message: err.response?.data?.error || 
                err.response?.data?.detail || 
                'Failed to load schedules',
        status: err.response?.status,
        validation: err.response?.data?.validation_errors
      });
    } finally {
      setLoading(false);
    }
  };

  // Add new schedule
  const addSchedule = async (scheduleData) => {
    try {
      setLoading(true);
      const formattedData = formatScheduleData(scheduleData);
      
      const response = await api.post('schedules/', formattedData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      setSchedules(prev => [...prev, response.data]);
      setError(null);
      return response.data;
    } catch (err) {
      const errorData = {
        message: err.response?.data?.error || 
                err.response?.data?.detail || 
                'Failed to add schedule',
        status: err.response?.status,
        validation: err.response?.data?.validation_errors,
        data: err.response?.data
      };
      setError(errorData);
      throw errorData;
    } finally {
      setLoading(false);
    }
  };

  // Update existing schedule
  const updateSchedule = async (id, scheduleData) => {
    try {
      setLoading(true);
      const formattedData = formatScheduleData(scheduleData);
      
      const response = await api.put(`schedules/${id}/`, formattedData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      setSchedules(prev => 
        prev.map(s => s.id === id ? response.data : s)
      );
      setError(null);
      return response.data;
    } catch (err) {
      const errorData = {
        message: err.response?.data?.error || 
                err.response?.data?.detail || 
                'Failed to update schedule',
        status: err.response?.status,
        validation: err.response?.data?.validation_errors
      };
      setError(errorData);
      throw errorData;
    } finally {
      setLoading(false);
    }
  };

  // Delete schedule
  const deleteSchedule = async (id) => {
    try {
      setLoading(true);
      await api.delete(`schedules/${id}/`);
      setSchedules(prev => prev.filter(s => s.id !== id));
      setError(null);
    } catch (err) {
      const errorData = {
        message: err.response?.data?.error || 
                err.response?.data?.detail || 
                'Failed to delete schedule',
        status: err.response?.status
      };
      setError(errorData);
      throw errorData;
    } finally {
      setLoading(false);
    }
  };

  // Initial data load
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