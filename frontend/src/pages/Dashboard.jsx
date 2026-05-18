import { useMemo } from 'react'
import { GraduationCap, Users, BookOpen, Award, UserPlus, FilePenLine } from 'lucide-react'
import { useFetch } from '../hooks/useFetch'
import studentService from '../services/studentService'
import facultyService from '../services/facultyService'
import courseService from '../services/courseService'
import resultService from '../services/resultService'
import attendanceService from '../services/attendanceService'
import analyticsService from '../services/analyticsService'
import StatCard from '../components/ui/StatCard'
import ChartCard from '../components/charts/ChartCard'
import { BarChartWidget, PieChartWidget, AreaChartWidget } from '../components/charts/ChartWidgets'
import Badge from '../components/ui/Badge'
import { gradeColor, fmt } from '../utils/helpers'

export default function Dashboard() {
  const { data: students, loading: sLoad } = useFetch(studentService.getAll)
  const { data: faculty, loading: fLoad } = useFetch(facultyService.getAllWithCourses)
  const { data: courses, loading: cLoad } = useFetch(courseService.getAll)
  const { data: resultAnalytics, loading: rLoad } = useFetch(resultService.getAnalytics)
  const { data: deptStats, loading: dLoad } = useFetch(analyticsService.getDepartmentStats)
  const { data: attendancePct, loading: aLoad } = useFetch(attendanceService.getPercentage)

  const passPercent = useMemo(() => {
    if (!resultAnalytics) return '—'

    const pass = resultAnalytics.find(
      r => (r.result_status ?? r.status ?? r.result) === 'Pass'
    )

    const total = resultAnalytics.reduce(
      (acc, r) => acc + parseInt(r.total ?? r.count ?? 0),
      0
    )

    return total
      ? fmt.percent(
        (parseInt(pass?.total ?? pass?.count ?? 0) / total) * 100
      )
      : '—'
  }, [resultAnalytics])

  const recentStudents = useMemo(() =>
    Array.isArray(students) ? [...students].slice(-5).reverse() : [],
    [students])

  const deptChartData = useMemo(() =>
    Array.isArray(deptStats)
      ? deptStats.map(d => ({
        name: d.department_name,
        value: d.total_students
      }))
      : [],
    [deptStats])

  const passFailData = useMemo(() =>
    Array.isArray(resultAnalytics)
      ? resultAnalytics.map(r => ({
        name: r.result_status ?? r.status ?? r.result,
        value: parseInt(r.total ?? r.count ?? 0)
      }))
      : [],
    [resultAnalytics])

  const attendanceBarData = useMemo(() =>
    Array.isArray(attendancePct)
      ? attendancePct.slice(0, 8).map(a => ({
        name: a.student_name?.split(' ')[0] ?? a.name ?? 'Student',
        attendance: parseFloat(a.attendance_percentage ?? a.percentage ?? 0),
      }))
      : [],
    [attendancePct])

  return (
    <div className="space-y-6 animate-slide-in">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={fmt.number(students?.length)}
          icon={GraduationCap}
          iconColor="text-accent"
          iconBg="bg-accent/10"
          loading={sLoad}
          subtitle="Enrolled this semester"
        />
        <StatCard
          title="Total Faculty"
          value={fmt.number(faculty?.length)}
          icon={Users}
          iconColor="text-violet"
          iconBg="bg-violet/10"
          loading={fLoad}
          subtitle="Active instructors"
        />
        <StatCard
          title="Total Courses"
          value={fmt.number(courses?.length)}
          icon={BookOpen}
          iconColor="text-warning"
          iconBg="bg-warning/10"
          loading={cLoad}
          subtitle="Across all departments"
        />
        <StatCard
          title="Pass Percentage"
          value={passPercent}
          icon={Award}
          iconColor="text-success"
          iconBg="bg-success/10"
          loading={rLoad}
          subtitle="Latest result cycle"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChartCard
          title="Department Distribution"
          subtitle="Students per department"
          loading={dLoad}
          className="lg:col-span-1"
        >
          <PieChartWidget data={deptChartData} nameKey="name" valueKey="value" />
        </ChartCard>

        <ChartCard
          title="Pass vs Fail"
          subtitle="Result analytics overview"
          loading={rLoad}
          className="lg:col-span-1"
        >
          <PieChartWidget data={passFailData} nameKey="name" valueKey="value" />
        </ChartCard>

        <ChartCard
          title="Attendance Snapshot"
          subtitle="Top student attendance %"
          loading={aLoad}
          className="lg:col-span-1"
        >
          <BarChartWidget
            data={attendanceBarData}
            xKey="name"
            bars={[{ key: 'attendance', label: 'Attendance %', color: '#22d3ee' }]}
            height={220}
          />
        </ChartCard>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Students */}
        <div className="bg-bg-card border border-bg-border rounded-xl shadow-card">
          <div className="px-5 py-4 border-b border-bg-border flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-txt-primary">Recent Admissions</h3>
              <p className="text-xs text-txt-muted mt-0.5">Latest student records added</p>
            </div>
            <UserPlus size={16} className="text-txt-muted" />
          </div>
          {sLoad ? (
            <div className="p-5 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-10 bg-bg-elevated rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="divide-y divide-bg-border/50">
              {recentStudents.map((s) => (
                <div key={s.student_id ?? s.id} className="flex items-center gap-3 px-5 py-3 hover:bg-bg-elevated transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-accent font-mono">
                      {(s.name ?? 'S').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-txt-primary truncate">{s.name}</p>
                    <p className="text-xs text-txt-muted">{s.department} · Sem {s.semester}</p>
                  </div>
                  <Badge variant={s.status === 'Active' ? 'success' : 'danger'}>
                    {s.status ?? 'Active'}
                  </Badge>
                </div>
              ))}
              {recentStudents.length === 0 && (
                <p className="px-5 py-8 text-sm text-txt-muted text-center">No students found</p>
              )}
            </div>
          )}
        </div>

        {/* Department Bar */}
        <ChartCard
          title="Students by Department"
          subtitle="Distribution across departments"
          loading={dLoad}
        >
          <BarChartWidget
            data={deptChartData}
            xKey="name"
            bars={[{ key: 'value', label: 'Students', color: '#a78bfa' }]}
            height={230}
          />
        </ChartCard>
      </div>
    </div>
  )
}
