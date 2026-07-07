import api from './api'
export const technicianService = {
  getProfile: () => api.get('/technician/profile').then(r => r.data),
  updateProfile: (data) => api.put('/technician/profile', data).then(r => r.data),
  toggleStatus: (status) => api.post('/technician/toggle-status', { status }).then(r => r.data),
  getDashboard: () => api.get('/technician/dashboard').then(r => r.data),
}
