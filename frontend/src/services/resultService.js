import api from './api'

const resultService = {
  getAll: () => api.get('/student-results'),
  getTopper: () => api.get('/topper'),
  getAnalytics: () => api.get('/result-analytics'),
}

export default resultService
