import api from './api'

const analyticsService = {
  getDepartmentStats: () => api.get('/department-stats'),
  getFacultyWorkload: () => api.get('/faculty-workload'),
}

export default analyticsService
