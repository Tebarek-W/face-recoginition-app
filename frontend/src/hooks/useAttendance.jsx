import { useState, useEffect } from 'react';
import api from '../services/api';

const useAttendance = () => {
  const [attendanceData, setAttendanceData] = useState({
    analytics: null,
    rules: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [analyticsResponse, rulesResponse] = await Promise.all([
        api.get('/analytics/attendance/analytics/'),
        api.get('/analytics/attendance/rules/')
      ]);

      setAttendanceData({
        analytics: analyticsResponse.data,
        rules: transformRulesResponse(rulesResponse.data)
      });
    } catch (err) {
      const errorData = err.response?.data;
      const errorMessage = errorData?.detail || 
                         errorData?.message || 
                         err.message || 
                         'Failed to fetch attendance data';
      
      setError(errorMessage);
      console.error('Attendance fetch error:', {
        error: err,
        response: err.response
      });
    } finally {
      setLoading(false);
    }
  };

  const transformRulesResponse = (data) => ({
    minimumAttendance: data.minimum_attendance,
    latePolicy: data.late_policy,
    notificationThreshold: data.notification_threshold,
    gracePeriod: data.grace_period
  });

  const updateRules = async (newRules) => {
    try {
      setLoading(true);
      setError(null);
      
      const payload = {
        minimum_attendance: Number(newRules.minimumAttendance),
        late_policy: Number(newRules.latePolicy),
        notification_threshold: Number(newRules.notificationThreshold),
        grace_period: Number(newRules.gracePeriod)
      };

      const response = await api.put('/analytics/attendance/rules/', payload);

      setAttendanceData(prev => ({
        ...prev,
        rules: transformRulesResponse(response.data)
      }));
      
      return response.data;
    } catch (err) {
      const errorData = err.response?.data;
      const errorMessage = errorData?.detail || 
                         errorData?.message || 
                         err.message || 
                         'Failed to update attendance rules';
      
      setError(errorMessage);
      console.error('Rules update error:', {
        error: err,
        response: err.response,
        config: err.config
      });
      throw errorMessage;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  return { 
    analytics: attendanceData.analytics,
    rules: attendanceData.rules,
    loading, 
    error, 
    updateRules,
    refetch: fetchAttendanceData
  };
};

export default useAttendance;