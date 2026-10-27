import axiosInstance from './axiosInstance';

export const adminApi = {
  // Statistics
  getStats: () => axiosInstance.get('/schools/stats/'),

  // Schools CRUD
  getSchools: (params) => axiosInstance.get('/schools/', { params }),
  getSchool: (id) => axiosInstance.get(`/schools/${id}/`),
  createSchool: (data) => axiosInstance.post('/schools/', data),
  updateSchool: (id, data) => axiosInstance.patch(`/schools/${id}/`, data),
  deleteSchool: (id) => axiosInstance.delete(`/schools/${id}/`),
  toggleSchoolStatus: (id) => axiosInstance.post(`/schools/${id}/toggle_status/`),
  resetSchoolPassword: (id, new_password) =>
    axiosInstance.post(`/schools/${id}/reset_admin_password/`, { new_password }),

  // Payments & Receipts
  getPayments: (params) => axiosInstance.get('/payments/', { params }),
  createPayment: (data) => axiosInstance.post('/payments/', data),
  getPaymentSummary: () => axiosInstance.get('/payments/summary/'),

  // Profile & Security
  getProfile: () => axiosInstance.get('/auth/me/'),
  updateProfile: (data) => axiosInstance.patch('/auth/me/', data),
  changePassword: (data) => axiosInstance.post('/auth/change-password/', data),
};
