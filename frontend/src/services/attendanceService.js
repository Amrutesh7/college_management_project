import api from './api'

const attendanceService = {
  getAll: () => api.get('/attendance'),
  getPercentage: () => api.get('/attendance-percentage'),
  getLowAttendance: () => api.get('/low-attendance'),
}

export default attendanceService
