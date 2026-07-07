import api from './api'
export const adminService = {
  getDashboard: () => api.get('/admin/dashboard').then(r => r.data),
  getUsers: (p = {}) => api.get('/admin/users', { params: p }).then(r => r.data),
  verifyTechnician: (id) => api.post(`/admin/technicians/${id}/verify`).then(r => r.data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`).then(r => r.data),
  getOrders: (p = {}) => api.get('/admin/orders', { params: p }).then(r => r.data),
  getComplaints: (p = {}) => api.get('/admin/complaints', { params: p }).then(r => r.data),
  resolveComplaint: (id, data) => api.put(`/admin/complaints/${id}`, data).then(r => r.data),
}
