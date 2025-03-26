import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  // Retrieve the user object from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const userRole = user ? user.role : null;

  // Redirect to login if not authenticated
  if (!user || !userRole) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to "Not Authorized" if the role doesn't match
  if (userRole !== requiredRole) {
    return <Navigate to="/not-authorized" replace />;
  }

  // Allow access to the protected component
  return children;
};

export default ProtectedRoute;