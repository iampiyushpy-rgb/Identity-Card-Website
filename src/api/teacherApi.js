import axiosInstance from './axiosInstance';

export const teacherApi = {
  // Teacher Profile
  getProfile: () => axiosInstance.get('/teachers/me/'),

  // Academics dropdowns (read-only for student admission & filters)
  getClasses: () => axiosInstance.get('/academics/classes/'),
  getSections: (classId) =>
    axiosInstance.get('/academics/sections/', { params: classId ? { class_id: classId } : {} }),
  getSessions: () => axiosInstance.get('/academics/sessions/'),

  // Students
  getStudents: (params) => axiosInstance.get('/students/', { params }),
  getStudent: (id) => axiosInstance.get(`/students/${id}/`),
  createStudent: (formData) => axiosInstance.post('/students/', formData),
  updateStudent: (id, formData) => axiosInstance.patch(`/students/${id}/`, formData),
  bulkStatusUpdate: (payload) => axiosInstance.post('/students/bulk_status_update/', payload),
};
