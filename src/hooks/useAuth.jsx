import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          const user = await authService.getCurrentAdmin();
          setAdmin(user);
        } catch (err) {
          console.error("Auth check failed:", err);
          authService.logout();
          setAdmin(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      await authService.login(username, password);
      const user = await authService.getCurrentAdmin();
      setAdmin(user);
      setLoading(false);
      return true;
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.response?.data?.detail || "Invalid credentials. Please try again.");
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    authService.logout();
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, error, login, logout, setAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
