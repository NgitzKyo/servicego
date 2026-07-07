import api from './api'
export const orderService = {
  createOrder: (data) => api.post('/customer/orders', data).then(r => r.data),
  getCustomerOrders: (p = {}) => api.get('/customer/orders', { params: p }).then(r => r.data),
  approveOrder: (id) => api.post(`/customer/orders/${id}/approve`).then(r => r.data),
  rateOrder: (id, data) => api.post(`/customer/orders/${id}/rate`, data).then(r => r.data),
  submitComplaint: (id, data) => api.post(`/customer/orders/${id}/complaint`, data).then(r => r.data),
  getWarranties: () => api.get('/customer/warranties').then(r => r.data),
  claimWarranty: (id) => api.post(`/customer/warranties/${id}/claim`).then(r => r.data),
  getTechnicianOrders: (p = {}) => api.get('/technician/orders', { params: p }).then(r => r.data),
  acceptOrder: (id) => api.post(`/technician/orders/${id}/accept`).then(r => r.data),
  submitDiagnosis: (id, data) => api.post(`/technician/orders/${id}/diagnosis`, data).then(r => r.data),
  updateOrderStatus: (id, status) => api.post(`/technician/orders/${id}/status`, { status }).then(r => r.data),
  getServices: () => api.get('/services').then(r => r.data),
  getSpareparts: () => api.get('/spareparts').then(r => r.data),
}
