import { useState, useEffect } from 'react';
import api from '../services/api';

const useAttendance = () => {
  const [attendanceData, setAttendanceData] = useState({
    analytics: [],
    rules: {
      minimumAttendance: 75,
      latePolicy: 3,
      notificationThreshold: 70,
      gracePeriod: 15
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch attendance data and rules
  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        setLoading(true);
        
        // Fetch analytics and rules in parallel
        const [analyticsResponse, rulesResponse] = await Promise.all([
          api.get('/attendance/analytics/'),
          api.get('/attendance/rules/')
        ]);

        setAttendanceData({
          analytics: analyticsResponse.data,
          rules: rulesResponse.data
        });
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch attendance data');
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, []);

  // Update attendance rules
  const updateRules = async (newRules) => {
    try {
      setLoading(true);
      const response = await api.put('/attendance/rules/', newRules);
      setAttendanceData(prev => ({
        ...prev,
        rules: response.data
      }));
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to update attendance rules');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { 
    analytics: attendanceData.analytics,
    rules: attendanceData.rules,
    loading, 
    error, 
    updateRules 
  };
};

export default useAttendance;