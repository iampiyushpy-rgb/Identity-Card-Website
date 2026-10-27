import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { AdminDashboard } from '../pages/admin/Dashboard';
import { SchoolsList } from '../pages/admin/SchoolsList';
import { SchoolDetails } from '../pages/admin/SchoolDetails';
import { PaymentHistory } from '../pages/admin/PaymentHistory';
import { MyProfileSecurity } from '../pages/admin/MyProfileSecurity';
import { SchoolSecurity } from '../pages/admin/SchoolSecurity';

export const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="schools" element={<SchoolsList />} />
      <Route path="schools/:id" element={<SchoolDetails />} />
      <Route path="payments" element={<PaymentHistory />} />
      <Route path="profile-security" element={<MyProfileSecurity />} />
      <Route path="school-security" element={<SchoolSecurity />} />
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
};
