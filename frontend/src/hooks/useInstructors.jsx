import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const useInstructors = () => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get CSRF token from cookies
  const getCSRFToken = () => {
    const cookie = document.cookie.split('; ').find(row => row.startsWith('csrftoken='));
    return cookie ? cookie.split('=')[1] : '';
  };

  // Fetch all instructors with department data
  const fetchInstructors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('instructors/');
      const data = Array.isArray(response.data) 
        ? response.data.map(instructor => ({
            ...instructor,
            department: instructor.department || null,
            // Maintain backward compatibility
            first_name: instructor.user?.first_name || instructor.first_name,
            last_name: instructor.user?.last_name || instructor.last_name,
            email: instructor.user?.email || instructor.email,
            avatar: instructor.user?.avatar || instructor.avatar
          }))
        : [];
      setInstructors(data);
    } catch (err) {
      handleError(err, 'Failed to load instructors. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Add new instructor (preserving avatar upload)
  const addInstructor = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const isFileUpload = formData.avatar instanceof File;
      const headers = {
        'X-CSRFToken': getCSRFToken(),
        'Content-Type': isFileUpload ? 'multipart/form-data' : 'application/json'
      };

      // Prepare payload maintaining all fields
      const payload = isFileUpload ? new FormData() : {};
      const fields = [
        'first_name', 'last_name', 'email', 'gender', 'password',
        'department_id', 'courses', 'avatar'
      ];

      fields.forEach(field => {
        if (formData[field] !== undefined && formData[field] !== null) {
          if (isFileUpload) {
            if (field === 'courses') {
              formData[field].forEach(course => {
                payload.append('courses', course);
              });
            } else {
              payload.append(field, formData[field]);
            }
          } else {
            payload[field] = formData[field];
          }
        }
      });

      const response = await api.post('instructors/', payload, { headers });
      
      // Update state with new instructor
      setInstructors(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      handleError(err, 'Failed to add instructor. Please check your data.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update instructor (full functionality)
  const updateInstructor = async (id, formData) => {
    setLoading(true);
    setError(null);
    try {
      const isFileUpload = formData.avatar instanceof File;
      const headers = {
        'X-CSRFToken': getCSRFToken(),
        'Content-Type': isFileUpload ? 'multipart/form-data' : 'application/json'
      };

      // Handle both FormData and JSON payloads
      let payload;
      if (isFileUpload) {
        payload = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach(item => payload.append(key, item));
          } else if (value !== undefined && value !== null) {
            payload.append(key, value);
          }
        });
      } else {
        payload = {
          ...formData,
          courses: formData.courses || [],
          department_id: formData.department_id || null
        };
      }

      const response = await api.patch(`instructors/${id}/`, payload, { headers });

      // Update state with modified instructor
      setInstructors(prev => 
        prev.map(instructor => {
          if (instructor.id === id) {
            const updated = response.data;
            return {
              ...instructor,
              ...updated,
              // Preserve user relationship data
              user: updated.user ? {
                ...instructor.user,
                ...updated.user
              } : instructor.user
            };
          }
          return instructor;
        })
      );
      return response.data;
    } catch (err) {
      handleError(err, 'Failed to update instructor. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete instructor (unchanged)
  const deleteInstructor = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`instructors/${id}/`, {
        headers: { 'X-CSRFToken': getCSRFToken() }
      });
      setInstructors(prev => prev.filter(instructor => instructor.id !== id));
      return true;
    } catch (err) {
      handleError(err, 'Failed to delete instructor');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Unified error handler
  const handleError = (err, defaultMessage) => {
    const errorData = err.response?.data || {};
    const message = errorData.non_field_errors?.join(', ') || 
                   Object.entries(errorData)
                     .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
                     .join('; ') || 
                   err.message || 
                   defaultMessage;
    
    setError({ 
      message,
      details: errorData,
      status: err.response?.status 
    });
    console.error('API Error:', { error: err, response: err.response });
  };

  // Initial fetch
  useEffect(() => { fetchInstructors(); }, [fetchInstructors]);

  return { 
    instructors, 
    loading, 
    error, 
    addInstructor, 
    updateInstructor,
    deleteInstructor,
    refreshInstructors: fetchInstructors 
  };
};

export default useInstructors;