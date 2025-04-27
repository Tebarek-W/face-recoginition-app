import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { getCookie } from '../utils/cookies';
import { toast } from 'react-toastify';

export const useStudents = () => {
  const queryClient = useQueryClient();

  // Convert base64 to Blob for file uploads
  const dataURLtoBlob = (dataURL) => {
    if (!dataURL) return null;
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    const u8arr = new Uint8Array(bstr.length);
    for (let i = 0; i < bstr.length; i++) {
      u8arr[i] = bstr.charCodeAt(i);
    }
    return new Blob([u8arr], { type: mime });
  };

  // API Calls
  const fetchStudents = async () => {
    const { data } = await api.get('/students/');
    return data || [];
  };

  const registerStudent = async ({ studentData }) => {
    const formData = new FormData();
    
    // Append basic student data
    Object.entries(studentData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        // Handle date formatting if needed
        if (value instanceof Date) {
          formData.append(key, value.toISOString().split('T')[0]);
        } else {
          formData.append(key, value);
        }
      }
    });

    const { data } = await api.post('students/', formData, {
      headers: { 
        'Content-Type': 'multipart/form-data',
        'X-CSRFToken': getCookie('csrftoken'),
      },
    });

    return data;
  };

  const verifyLiveness = async ({ studentId, livenessData }) => {
    const formData = new FormData();
    formData.append('student_id', studentId);

    // Append all liveness verification images
    Object.entries(livenessData).forEach(([action, imageData]) => {
      if (imageData) {
        const blob = dataURLtoBlob(imageData);
        if (blob) {
          formData.append(action, blob, `${action}.png`);
        }
      }
    });

    const { data } = await api.post(
      '/facial/verify/',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-CSRFToken': getCookie('csrftoken'),
        },
      }
    );

    return data;
  };

  const deleteStudent = async (studentId) => {
    await api.delete(`/students/${studentId}`, {
      headers: {
        'X-CSRFToken': getCookie('csrftoken'),
      },
    });
    return studentId;
  };

  // Queries
  const {
    data: students = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['students'],
    queryFn: fetchStudents,
  });

  // Mutations
  const registerMutation = useMutation({
    mutationFn: registerStudent,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['students']);
      toast.success(`Student ${data.first_name} registered successfully!`);
      return data;
    },
    onError: (error) => {
      toast.error(error.message || 'Student registration failed.');
    },
  });

  const livenessMutation = useMutation({
    mutationFn: verifyLiveness,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['students']);
      if (data.verified) {
        toast.success('Liveness verification successful!');
      } else {
        toast.warning('Liveness verification failed. Please try again.');
      }
      return data;
    },
    onError: (error) => {
      toast.error(error.message || 'Liveness verification failed.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteStudent,
    onSuccess: (studentId) => {
      queryClient.invalidateQueries(['students']);
      toast.success('Student deleted successfully.');
      return studentId;
    },
    onError: () => {
      toast.error('Failed to delete student.');
    },
  });

  return {
    students,
    isLoading,
    isError,
    error,
    refetch,

    // Registration
    registerStudent: registerMutation.mutateAsync,
    isRegistering: registerMutation.isLoading,
    registrationError: registerMutation.error,

    // Liveness Verification
    verifyLiveness: livenessMutation.mutateAsync,
    isVerifying: livenessMutation.isLoading,
    verificationError: livenessMutation.error,

    // Deletion
    deleteStudent: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isLoading,
  };
};