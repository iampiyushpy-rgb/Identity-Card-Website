import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('access_token');
    const savedUser = localStorage.getItem('user_info');

    if (savedToken && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setRole(parsedUser.role);
        setToken(savedToken);
      } catch (e) {
        console.error('Failed to parse cached user:', e);
        localStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axiosInstance.post('/auth/login/', { username, password });
      const { access, refresh, user: userData } = response.data;

      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('user_info', JSON.stringify(userData));

      setUser(userData);
      setRole(userData.role);
      setToken(access);

      return { success: true, user: userData };
    } catch (error) {
      let errorMsg = 'Invalid credentials. Please verify username and password.';
      if (error.response?.data) {
        const d = error.response.data;
        if (typeof d.detail === 'string') {
          errorMsg = d.detail;
        } else if (typeof d.message === 'string') {
          errorMsg = d.message;
        } else if (d.non_field_errors && Array.isArray(d.non_field_errors)) {
          errorMsg = d.non_field_errors.join(' ');
        } else if (typeof d === 'object') {
          const firstKey = Object.keys(d)[0];
          if (firstKey && Array.isArray(d[firstKey])) {
            errorMsg = `${firstKey}: ${d[firstKey][0]}`;
          }
        }
      } else if (error.message) {
        errorMsg = `Connection error: ${error.message}. Ensure backend is running.`;
      }
      return { success: false, error: errorMsg };
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_info');
    setUser(null);
    setRole(null);
    setToken(null);
  };

  const updateUser = (newUserData) => {
    const updated = { ...user, ...newUserData };
    localStorage.setItem('user_info', JSON.stringify(updated));
    setUser(updated);
    if (newUserData.role) setRole(newUserData.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        logout,
        updateUser,
      }}
    >
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
