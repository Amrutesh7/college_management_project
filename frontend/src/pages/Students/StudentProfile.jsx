import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, Phone, BookOpen, Award, Activity, GraduationCap } from 'lucide-react'
import { useFetch } from '../../hooks/useFetch'
import studentService from '../../services/studentService'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Card from '../../components/ui/Card'
import ChartCard from '../../components/charts/ChartCard'
import { BarChartWidget, AreaChartWidget } from '../../components/charts/ChartWidgets'
import Spinner from '../../components/ui/Spinner'
import ErrorBanner from '../../components/ui/ErrorBanner'
import { gradeColor, attendanceColor, fmt } from '../../utils/helpers'

function InfoRow({ label, value, mono }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-bg-border last:border-0">
      <span className="text-xs text-txt-muted font-medium uppercase tracking-wider">{label}</span>
      <span className={`text-sm text-txt-primary font-medium ${mono ? 'font-mono' : ''}`}>{value ?? '—'}</span>
    </div>
  )
}

export default function StudentProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: profile, loading, error, refetch } = useFetch(() => studentService.getProfile(id), [id])
  console.log(profile)
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" className="text-accent" />
      </div>
    )
  }

  if (error) return <ErrorBanner message={error} onRetry={refetch} />

  const student = profile?.student ?? profile ?? {}
  const courses = profile?.courses ?? []
  const results = profile?.results ?? []
  const attendance = profile?.attendance ?? []

  const attendancePct = attendance.length
    ? (attendance.reduce((a, r) => a + parseFloat(r.attendance_percentage ?? r.percentage ?? 0), 0) / attendance.length)
    : null

  const gradeData = results.map(r => ({
    course: r.course_name ?? r.course ?? 'Course',
    marks: r.total_marks ?? r.marks ?? 0,
    grade: r.grade ?? '—',
  }))

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Back */}
      <Button variant="ghost" size="sm" icon={<ArrowLeft size={14} />} onClick={() => navigate('/students')}>
        Back to Students
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Profile Card */}
        <Card className="lg:col-span-1 space-y-5">
          {/* Avatar + Name */}
          <div className="flex flex-col items-center text-center pb-4 border-b border-bg-border">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-violet/20 border border-accent/20 flex items-center justify-center mb-3">
              <span className="font-display text-2xl font-bold text-accent">
                {(student.name ?? 'S').charAt(0).toUpperCase()}
              </span>
            </div>
            <h2 className="font-display text-lg font-bold text-txt-primary">{student.name ?? '—'}</h2>
            <p className="text-xs text-txt-muted mt-0.5">{student.department} · Semester {student.semester}</p>
            <div className="mt-3">
              <Badge variant={student.status === 'Active' ? 'success' : 'danger'}>
                {student.status ?? 'Active'}
              </Badge>
            </div>
          </div>

          {/* Details */}
          <div>
            <InfoRow label="Student ID" value={student.student_id ?? id} mono />
            <InfoRow label="Department" value={student.department} />
            <InfoRow label="Semester" value={`Semester ${student.semester}`} />
            <InfoRow label="CGPA" value={
              <span className={gradeColor(student.cgpa)}>{student.cgpa ?? '—'}</span>
            } />
            {student.email && <InfoRow label="Email" value={student.email} />}
            {student.phone && <InfoRow label="Phone" value={student.phone} />}
          </div>
        </Card>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="text-center">
              <BookOpen size={20} className="text-accent mx-auto mb-2" />
              <p className="font-display text-xl font-bold text-txt-primary">{courses.length}</p>
              <p className="text-xs text-txt-muted mt-0.5">Courses</p>
            </Card>
            <Card className="text-center">
              <Activity size={20} className="text-warning mx-auto mb-2" />
              <p className={`font-display text-xl font-bold ${attendanceColor(attendancePct)}`}>
                {attendancePct != null ? fmt.percent(attendancePct) : '—'}
              </p>
              <p className="text-xs text-txt-muted mt-0.5">Attendance</p>
            </Card>
            <Card className="text-center">
              <Award size={20} className="text-success mx-auto mb-2" />
              <p className={`font-display text-xl font-bold ${gradeColor(student.cgpa)}`}>
                {student.cgpa ?? '—'}
              </p>
              <p className="text-xs text-txt-muted mt-0.5">CGPA</p>
            </Card>
          </div>

          {/* Enrolled Courses */}
          <Card>
            <h3 className="text-sm font-semibold text-txt-primary mb-4 flex items-center gap-2">
              <BookOpen size={15} className="text-txt-muted" /> Enrolled Courses
            </h3>
            {courses.length === 0 ? (
              <p className="text-sm text-txt-muted text-center py-4">No courses enrolled</p>
            ) : (
              <div className="space-y-2">
                {courses.map((c, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-bg-elevated">
                    <div>
                      <p className="text-sm font-medium text-txt-primary">{c.course_name ?? c.name}</p>
                      <p className="text-xs text-txt-muted">{c.faculty_name ?? c.faculty ?? 'Faculty TBD'}</p>
                    </div>
                    <span className="text-2xs font-mono text-txt-muted bg-bg-border px-2 py-0.5 rounded">
                      {c.course_code ?? c.code ?? '—'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Grades Chart */}
          {gradeData.length > 0 && (
            <ChartCard title="Academic Performance" subtitle="Marks by subject">
              <BarChartWidget
                data={gradeData}
                xKey="course"
                bars={[{ key: 'marks', label: 'Marks', color: '#22d3ee' }]}
                height={200}
              />
            </ChartCard>
          )}

          {/* Results Table */}
          {results.length > 0 && (
            <Card>
              <h3 className="text-sm font-semibold text-txt-primary mb-4 flex items-center gap-2">
                <GraduationCap size={15} className="text-txt-muted" /> Exam Results
              </h3>
              <div className="overflow-x-auto -mx-5">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Course</th>
                      <th>Marks</th>
                      <th>Grade</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r, i) => (
                      <tr key={i}>
                        <td className="font-medium text-txt-primary">{r.course_name ?? r.course ?? '—'}</td>
                        <td className="font-mono">{r.total_marks ?? r.marks ?? '—'}</td>
                        <td>
                          <span className={`font-bold font-mono ${gradeColor(r.cgpa ?? r.grade_point)}`}>
                            {r.grade ?? '—'}
                          </span>
                        </td>
                        <td>
                          <Badge variant={r.status === 'Pass' ? 'success' : 'danger'}>
                            {r.status ?? '—'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
