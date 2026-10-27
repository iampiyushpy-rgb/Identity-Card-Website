import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { SchoolDashboard } from '../pages/school/Dashboard';
import { ClassSection } from '../pages/school/ClassSection';
import { Students } from '../pages/school/Students';
import { SessionChange } from '../pages/school/SessionChange';
import { TeacherProfiles } from '../pages/school/TeacherProfiles';
import { SchoolPaymentHistory } from '../pages/school/PaymentHistory';

export const SchoolRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<SchoolDashboard />} />
      <Route path="students" element={<Students />} />
      <Route path="classes" element={<ClassSection />} />
      <Route path="session-change" element={<SessionChange />} />
      <Route path="teachers" element={<TeacherProfiles />} />
      <Route path="payments" element={<SchoolPaymentHistory />} />
      <Route path="*" element={<Navigate to="/school/dashboard" replace />} />
    </Routes>
  );
};
