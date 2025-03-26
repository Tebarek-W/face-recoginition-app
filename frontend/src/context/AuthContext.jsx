import React, { createContext, useState, useEffect, useContext } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); // Added user state

  useEffect(() => {
    // Check if the user is authenticated (e.g., by checking localStorage)
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setIsAuthenticated(true);
      setUser(userData); // Set user data from localStorage
    }
  }, []);

  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData); // Set user data on login
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsAuthenticated(false);
    setUser(null); // Clear user data on logout
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user,          // Added user to context value
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Add this custom hook at the bottom of the file
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};