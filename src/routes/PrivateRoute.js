import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const PrivateRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#0b0f19' }}>
        <div style={{ color: '#6366f1', fontSize: '1.25rem', fontWeight: '600' }}>Loading TechRavisha...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect to their appropriate home according to role
    if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (role === 'school') return <Navigate to="/school/dashboard" replace />;
    if (role === 'teacher') return <Navigate to="/teacher/dashboard" replace />;
    return <Navigate to="/login" replace />;
  }

  return children;
};
