import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

// Create the context
const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    const response = await authService.login(email, password);
    setCurrentUser(response.user);
    setIsAuthenticated(true);
    return response;
  };

  // Logout function
  const logout = () => {
    authService.logout();
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  // Context value
  const value = {
    currentUser,
    isAuthenticated,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
