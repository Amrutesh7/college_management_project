import api from './api'

const facultyService = {
  getAllWithCourses: () => api.get('/faculty'),
  create: (data) => api.post('/faculty', data),
  update: (id, data) => api.put(`/faculty/${id}`, data),
  remove: (id) => api.delete(`/faculty/${id}`),
  getWorkload: () => api.get('/faculty-workload'),
}

export default facultyService
