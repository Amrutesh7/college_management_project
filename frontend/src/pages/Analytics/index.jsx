import { useMemo } from 'react'
import { TrendingUp, Users, BookOpen, Award, Activity, BarChart3 } from 'lucide-react'
import { useFetch } from '../../hooks/useFetch'
import analyticsService from '../../services/analyticsService'
import resultService from '../../services/resultService'
import attendanceService from '../../services/attendanceService'
import studentService from '../../services/studentService'
import facultyService from '../../services/facultyService'
import StatCard from '../../components/ui/StatCard'
import ChartCard from '../../components/charts/ChartCard'
import ErrorBanner from '../../components/ui/ErrorBanner'
import {
  BarChartWidget, PieChartWidget, AreaChartWidget,
} from '../../components/charts/ChartWidgets'
import { fmt } from '../../utils/helpers'

export default function Analytics() {
  const { data: deptStats, loading: dLoad, error: dErr } = useFetch(analyticsService.getDepartmentStats)
  const { data: workload, loading: wLoad } = useFetch(analyticsService.getFacultyWorkload)
  const { data: resultAnalytics, loading: rLoad } = useFetch(resultService.getAnalytics)
  const { data: attPct, loading: aLoad } = useFetch(attendanceService.getPercentage)
  const { data: students } = useFetch(studentService.getAll)
  const { data: faculty } = useFetch(facultyService.getAllWithCourses)

  const passPercent = useMemo(() => {
    if (!Array.isArray(resultAnalytics)) return 0

    const pass = resultAnalytics.find(
      r => (r.result_status ?? r.status ?? r.result) === 'Pass'
    )

    const total = resultAnalytics.reduce(
      (a, r) => a + parseInt(r.total ?? r.count ?? 0),
      0
    )

    return total
      ? ((parseInt(pass?.total ?? pass?.count ?? 0) / total) * 100)
      : 0
  }, [resultAnalytics])

  const avgAttendance = useMemo(() => {
    if (!Array.isArray(attPct) || attPct.length === 0) return 0
    return attPct.reduce((a, r) => a + parseFloat(r.attendance_percentage ?? r.percentage ?? 0), 0) / attPct.length
  }, [attPct])

  const deptChartData = useMemo(() =>
    Array.isArray(deptStats)
      ? deptStats.map(d => ({
        name: d.department_name,
        students: d.total_students
      }))
      : [], [deptStats])

  const workloadChartData = useMemo(() =>
    Array.isArray(workload)
      ? workload.map(w => ({
        name: `${w.first_name} ${w.last_name}`,
        courses: w.total_courses
      }))
      : [], [workload])

  const passFailData = useMemo(() =>
    Array.isArray(resultAnalytics)
      ? resultAnalytics.map(r => ({
        name: r.result_status ?? r.status ?? r.result,
        value: parseInt(r.total ?? r.count ?? 0)
      }))
      : [],
    [resultAnalytics])

  const attendanceChartData = useMemo(() =>
    Array.isArray(attPct)
      ? attPct.slice(0, 12).map(r => ({
        name: (r.student_name ?? r.name ?? 'S').split(' ')[0],
        pct: parseFloat(r.attendance_percentage ?? r.percentage ?? 0),
      }))
      : [], [attPct])

  // Simulated semester trend using student CGPA distribution
  const semesterTrend = useMemo(() => {
    if (!Array.isArray(students)) return []
    const byDept = {}
    students.forEach(s => {
      if (!byDept[s.department]) byDept[s.department] = { dept: s.department, count: 0 }
      byDept[s.department].count++
    })
    return Object.values(byDept)
  }, [students])

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="page-header">
        <h2 className="page-title">Analytics</h2>
        <p className="page-subtitle">Institutional performance insights and trends</p>
      </div>

      {dErr && <ErrorBanner message={dErr} />}

      {/* KPI Row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Students" value={fmt.number(students?.length)}
          icon={Users} iconColor="text-accent" iconBg="bg-accent/10"
        />
        <StatCard
          title="Faculty Members" value={fmt.number(faculty?.length)}
          icon={Users} iconColor="text-violet" iconBg="bg-violet/10"
        />
        <StatCard
          title="Pass Percentage" value={fmt.percent(passPercent)}
          icon={Award} iconColor="text-success" iconBg="bg-success/10"
          loading={rLoad}
        />
        <StatCard
          title="Avg. Attendance" value={fmt.percent(avgAttendance)}
          icon={Activity} iconColor="text-warning" iconBg="bg-warning/10"
          loading={aLoad}
        />
      </div>

      {/* Dept + Pass/Fail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChartCard title="Department-wise Enrollment" subtitle="Students per department" loading={dLoad} className="lg:col-span-2">
          <BarChartWidget data={deptChartData} xKey="name"
            bars={[{ key: 'students', label: 'Students', color: '#22d3ee' }]} height={240} />
        </ChartCard>
        <ChartCard title="Pass vs Fail Rate" subtitle="Overall exam results" loading={rLoad}>
          <PieChartWidget data={passFailData} nameKey="name" valueKey="value" height={240} />
        </ChartCard>
      </div>

      {/* Workload + Attendance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Faculty Workload" subtitle="Courses assigned per faculty member" loading={wLoad}>
          <BarChartWidget data={workloadChartData.slice(0, 8)} xKey="name"
            bars={[{ key: 'courses', label: 'Courses', color: '#a78bfa' }]} height={220} />
        </ChartCard>

        <ChartCard title="Student Attendance Distribution" subtitle="Individual attendance percentages" loading={aLoad}>
          <AreaChartWidget data={attendanceChartData} xKey="name"
            areas={[{ key: 'pct', label: 'Attendance %', color: '#22c55e' }]} height={220} />
        </ChartCard>
      </div>

      {/* Insights Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: 'Highest Enrolled Dept.',
            value: deptChartData.reduce((a, b) => b.students > (a.students ?? 0) ? b : a, {}).name ?? '—',
            icon: BookOpen, color: 'text-accent', bg: 'bg-accent/10',
          },
          {
            label: 'Pass Rate',
            value: fmt.percent(passPercent),
            icon: Award, color: 'text-success', bg: 'bg-success/10',
          },
          {
            label: 'Avg. Attendance',
            value: fmt.percent(avgAttendance),
            icon: BarChart3, color: 'text-warning', bg: 'bg-warning/10',
          },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-bg-card border border-bg-border rounded-xl p-5 flex items-center gap-4 shadow-card">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>
              <Icon size={20} className={color} />
            </div>
            <div>
              <p className={`font-display text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-txt-muted mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
