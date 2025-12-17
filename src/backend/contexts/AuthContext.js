import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/apiService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const signup = async (email, password, name) => {
    try {
      const data = await authAPI.signup(email, password, name);
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setCurrentUser(data.user);
      }
      return { user: data.user };
    } catch (error) {
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const data = await authAPI.login(email, password);
      setCurrentUser(data.user);
      return { user: data.user };
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authAPI.logout();
    setCurrentUser(null);
  };

  useEffect(() => {
    // Check for existing user session
    const user = authAPI.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
      setLoading(false);
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
