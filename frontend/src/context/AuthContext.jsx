import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      loadUserProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const loadUserProfile = async () => {
    try {
      const response = await authAPI.getProfile();
      setUser(response.data);
    } catch (error) {
      console.error('Failed to load profile:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      
      // Handle different response structures
      let newToken, userData;
      
      if (response.data) {
        // Structure: { data: { token, user } }
        newToken = response.data.token || response.data.accessToken;
        userData = response.data.user || response.data;
      } else {
        // Structure: { token, user } directly
        newToken = response.token || response.accessToken;
        userData = response.user || response;
      }
      
      if (!newToken) {
        throw new Error('Token not received from server');
      }
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      
      // If user data is not in response, fetch it
      if (!userData || !userData.role) {
        try {
          const profileResponse = await authAPI.getProfile();
          userData = profileResponse.data || profileResponse;
        } catch (profileError) {
          console.warn('Could not fetch profile, using basic user data');
          // Use email as fallback
          userData = { email, role: 'patient' };
        }
      }
      
      setUser(userData);
      
      return { success: true, role: userData.role || 'patient' };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (data) => {
    try {
      const response = await authAPI.register(data);
      
      // Handle different response structures
      let newToken, userData;
      
      if (response.data) {
        // Structure: { data: { token, user } }
        newToken = response.data.token || response.data.accessToken;
        userData = response.data.user || response.data;
      } else {
        // Structure: { token, user } directly
        newToken = response.token || response.accessToken;
        userData = response.user || response;
      }
      
      if (!newToken) {
        throw new Error('Token not received from server');
      }
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      
      // If user data is not in response, fetch it
      if (!userData || !userData.role) {
        try {
          const profileResponse = await authAPI.getProfile();
          userData = profileResponse.data || profileResponse;
        } catch (profileError) {
          console.warn('Could not fetch profile, using basic user data');
          // Use email as fallback
          userData = { email: data.email, role: data.role || 'patient' };
        }
      }
      
      setUser(userData);
      
      return { success: true, role: userData.role || data.role || 'patient' };
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!token,
    isPatient: user?.role === 'patient',
    isDoctor: user?.role === 'doctor',
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

