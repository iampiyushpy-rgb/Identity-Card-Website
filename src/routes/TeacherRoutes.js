import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { TeacherDashboard } from '../pages/teacher/Dashboard';
import { TeacherStudentsList } from '../pages/teacher/StudentsList';
import { AddStudent } from '../pages/teacher/AddStudent';

export const TeacherRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<TeacherDashboard />} />
      <Route path="students" element={<TeacherStudentsList />} />
      <Route path="add-student" element={<AddStudent />} />
      <Route path="*" element={<Navigate to="/teacher/dashboard" replace />} />
    </Routes>
  );
};
