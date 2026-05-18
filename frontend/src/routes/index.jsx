import { Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'
import Dashboard from '../pages/Dashboard'
import Students from '../pages/Students'
import StudentProfile from '../pages/Students/StudentProfile'
import Faculty from '../pages/Faculty'
import Courses from '../pages/Courses'
import Attendance from '../pages/Attendance'
import Results from '../pages/Results'
import Analytics from '../pages/Analytics'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="students" element={<Students />} />
        <Route path="students/:id" element={<StudentProfile />} />
        <Route path="faculty" element={<Faculty />} />
        <Route path="courses" element={<Courses />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="results" element={<Results />} />
        <Route path="analytics" element={<Analytics />} />
      </Route>
    </Routes>
  )
}
