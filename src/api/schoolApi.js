import axiosInstance from './axiosInstance';

export const schoolApi = {
  // School Profile
  getSchoolProfile: () => axiosInstance.get('/auth/me/'),

  // Academics: Sessions, Classes, Sections
  getSessions: () => axiosInstance.get('/academics/sessions/'),
  createSession: (data) => axiosInstance.post('/academics/sessions/', data),
  getClasses: () => axiosInstance.get('/academics/classes/'),
  createClass: (data) => axiosInstance.post('/academics/classes/', data),
  updateClass: (id, data) => axiosInstance.patch(`/academics/classes/${id}/`, data),
  deleteClass: (id) => axiosInstance.delete(`/academics/classes/${id}/`),
  getSections: (classId) =>
    axiosInstance.get('/academics/sections/', { params: classId ? { class_id: classId } : {} }),
  createSection: (data) => axiosInstance.post('/academics/sections/', data),
  updateSection: (id, data) => axiosInstance.patch(`/academics/sections/${id}/`, data),
  deleteSection: (id) => axiosInstance.delete(`/academics/sections/${id}/`),

  // Teachers
  getTeachers: () => axiosInstance.get('/teachers/'),
  createTeacher: (data) => axiosInstance.post('/teachers/', data),
  updateTeacher: (id, data) => axiosInstance.patch(`/teachers/${id}/`, data),
  deleteTeacher: (id) => axiosInstance.delete(`/teachers/${id}/`),
  resetTeacherPassword: (id, new_password) =>
    axiosInstance.post(`/teachers/${id}/reset_password/`, { new_password }),

  // Students
  getStudents: (params) => axiosInstance.get('/students/', { params }),
  getStudent: (id) => axiosInstance.get(`/students/${id}/`),
  createStudent: (formData) => axiosInstance.post('/students/', formData),
  updateStudent: (id, formData) => axiosInstance.patch(`/students/${id}/`, formData),
  deleteStudent: (id) => axiosInstance.delete(`/students/${id}/`),
  changeSession: (payload) => axiosInstance.post('/students/change_session/', payload),
  bulkStatusUpdate: (payload) => axiosInstance.post('/students/bulk_status_update/', payload),

  // Payments & Receipts
  getPayments: () => axiosInstance.get('/payments/'),

  // ID Cards
  getTemplates: () => axiosInstance.get('/idcards/templates/'),
  createTemplate: (data) => axiosInstance.post('/idcards/templates/', data),
  getBatches: () => axiosInstance.get('/idcards/batches/'),
  createBatch: (data) => axiosInstance.post('/idcards/batches/', data),
};
