import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { PrivateRoute } from './routes/PrivateRoute';
import { Layout } from './components/Layout';
import { Login } from './pages/auth/Login';
import { AdminRoutes } from './routes/AdminRoutes';
import { SchoolRoutes } from './routes/SchoolRoutes';
import { TeacherRoutes } from './routes/TeacherRoutes';

const RootRedirect = () => {
  const { isAuthenticated, role, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (role === 'school') return <Navigate to="/school/dashboard" replace />;
  if (role === 'teacher') return <Navigate to="/teacher/dashboard" replace />;
  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Admin Module */}
      <Route
        path="/admin/*"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route path="*" element={<AdminRoutes />} />
      </Route>

      {/* School Admin Module */}
      <Route
        path="/school/*"
        element={
          <PrivateRoute allowedRoles={['school', 'admin']}>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route path="*" element={<SchoolRoutes />} />
      </Route>

      {/* Teacher Module */}
      <Route
        path="/teacher/*"
        element={
          <PrivateRoute allowedRoles={['teacher', 'admin']}>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route path="*" element={<TeacherRoutes />} />
      </Route>

      {/* Root & Catch-all */}
      <Route path="/" element={<RootRedirect />} />
      <Route path="*" element={<RootRedirect />} />
    </Routes>
  );
}

export default App;
