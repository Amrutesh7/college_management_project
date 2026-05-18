import api from './api'

const studentService = {
  getAll: () => api.get('/students'),
  create: (data) => api.post('/students', data),
  update: (id, data) => api.put(`/students/${id}`, data),
  remove: (id) => api.delete(`/students/${id}`),
  getProfile: (id) => api.get(`/student-profile/${id}`),
}

export default studentService
