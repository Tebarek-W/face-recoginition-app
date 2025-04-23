import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { lightTheme, darkTheme } from './theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import InstructorPage from './pages/InstructorPage';
import StudentPage from './pages/StudentPage';
import DepartmentHeadPage from './pages/DepartmentHeadPage';
import NotAuthorizedPage from './pages/NotAuthorizedPage';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// HOD Pages
import AttendanceAnalyticsPage from './pages/AttendanceAnalyticsPage';
import ManageCoursesPage from './pages/ManageCoursesPage';
import EnrollStudentsPage from './pages/EnrollStudentsPage';
import ManageInstructorsPage from './pages/ManageInstructorsPage';
import SetSchedulePage from './pages/SetSchedulePage';
import ViewSchedulePage from './pages/ViewSchedulePage';

// Admin Pages
import AdminPage from './pages/AdminPage';
import ManageUsersPage from './pages/ManageUsersPage';
import ManageDepartmentsPage from './pages/ManageDepartmentsPage';
import GenerateReportsPage from './pages/GenerateReportsPage';

// Import AuthProvider
import { AuthProvider } from './context/AuthContext';

// Create a context for dark mode
export const DarkModeContext = React.createContext();

// Create a QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Retrieve dark mode preference from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
  }, []);

  // Save dark mode preference to localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
          <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
            <CssBaseline />
            <Router>
              <Navbar />
              <Box
                sx={{
                  flexGrow: 1,
                  paddingTop: '64px', // Adjust based on Navbar height
                  paddingBottom: '64px', // Adjust based on Footer height
                  minHeight: 'calc(100vh - 128px)', // Ensure full height minus Navbar and Footer
                }}
              >
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route
                    path="/instructor"
                    element={
                      <ProtectedRoute requiredRole="INSTRUCTOR">
                        <InstructorPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/student"
                    element={
                      <ProtectedRoute requiredRole="STUDENT">
                        <StudentPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/hod"
                    element={
                      <ProtectedRoute requiredRole="HEAD">
                        <DepartmentHeadPage />
                      </ProtectedRoute>
                    }
                  />
                  {/* Admin Routes */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute requiredRole="ADMIN">
                        <AdminPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/manage-users"
                    element={
                      <ProtectedRoute requiredRole="ADMIN">
                        <ManageUsersPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/manage-departments"
                    element={
                      <ProtectedRoute requiredRole="ADMIN">
                        <ManageDepartmentsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/generate-reports"
                    element={
                      <ProtectedRoute requiredRole="ADMIN">
                        <GenerateReportsPage />
                      </ProtectedRoute>
                    }
                  />
                  {/* HOD Features */}
                  <Route
                    path="/attendance-analytics"
                    element={
                      <ProtectedRoute requiredRole="HEAD">
                        <AttendanceAnalyticsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/manage-courses"
                    element={
                      <ProtectedRoute requiredRole="HEAD">
                        <ManageCoursesPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/enroll-students"
                    element={
                      <ProtectedRoute requiredRole="HEAD">
                        <EnrollStudentsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/manage-instructors"
                    element={
                      <ProtectedRoute requiredRole="HEAD">
                        <ManageInstructorsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/set-schedule"
                    element={
                      <ProtectedRoute requiredRole="HEAD">
                        <SetSchedulePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/view-schedule"
                    element={
                      <ProtectedRoute requiredRole="HEAD">
                        <ViewSchedulePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/not-authorized" element={<NotAuthorizedPage />} />
                </Routes>
              </Box>
              <Footer />
            </Router>
            <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
          </ThemeProvider>
        </DarkModeContext.Provider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;