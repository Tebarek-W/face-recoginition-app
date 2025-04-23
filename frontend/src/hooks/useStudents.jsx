import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { getCookie } from '../utils/cookies';
import { toast } from 'react-toastify';

export const useStudents = () => {
  const queryClient = useQueryClient();

  // Convert base64 to Blob for file uploads
  const dataURLtoBlob = (dataURL) => {
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

  const registerStudent = async (payload) => {
    const selfieImage = payload?.livenessData?.selfie;
    if (!selfieImage) {
      throw new Error('Selfie image is required for facial verification.');
    }

    // Step 1: Verify facial image via /facial/verify/
    const verifyFormData = new FormData();
    verifyFormData.append('image', dataURLtoBlob(selfieImage), 'selfie.png');

    const verificationResponse = await api.post('/facial/verify/', verifyFormData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    if (!verificationResponse.data?.verified) {
      throw new Error('Facial verification failed. Please try again.');
    }

    // Step 2: Proceed to register student after verification
    const formData = new FormData();
    Object.entries(payload.studentData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    if (payload.livenessData) {
      Object.entries(payload.livenessData).forEach(([step, image]) => {
        if (image) {
          formData.append(`liveness_${step}`, dataURLtoBlob(image));
        }
      });
    }

    const { data } = await api.post('/students/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return data;
  };

  const verifyLiveness = async ({ studentId, videoBlob }) => {
    const formData = new FormData();
    formData.append('video', videoBlob, 'liveness_video.webm');

    try {
      const response = await api.post(
        `/students/students/${studentId}/verify_liveness/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'X-CSRFToken': getCookie('csrftoken'),
          },
        }
      );

      const { verified, status: messageStatus } = response.data;

      if (verified) {
        toast.success('Liveness verification successful!');
      } else {
        toast.warning('Liveness verification failed.');
      }

      return response.data;
    } catch (error) {
      toast.error('An error occurred during verification.');
      console.error('Verification failed:', error);
      throw error;
    }
  };

  const deleteStudent = async (studentId) => {
    await api.delete(`/students/${studentId}`);
    toast.success('Student deleted successfully.');
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
    onSuccess: () => {
      queryClient.invalidateQueries(['students']);
      toast.success('Student registered successfully.');
    },
    onError: () => {
      toast.error('Student registration failed.');
    },
  });

  const livenessMutation = useMutation({
    mutationFn: verifyLiveness,
    onSuccess: () => queryClient.invalidateQueries(['students']),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteStudent,
    onSuccess: () => queryClient.invalidateQueries(['students']),
    onError: () => toast.error('Failed to delete student.'),
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
