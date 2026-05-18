import { useState, useMemo } from 'react'
import { Search, AlertTriangle, ClipboardList, Activity } from 'lucide-react'
import { useFetch } from '../../hooks/useFetch'
import { useSearch } from '../../hooks/useSearch'
import { usePagination } from '../../hooks/usePagination'
import attendanceService from '../../services/attendanceService'
import LoadingTable from '../../components/ui/LoadingTable'
import EmptyState from '../../components/ui/EmptyState'
import ErrorBanner from '../../components/ui/ErrorBanner'
import Pagination from '../../components/ui/Pagination'
import Badge from '../../components/ui/Badge'
import Card from '../../components/ui/Card'
import ChartCard from '../../components/charts/ChartCard'
import { BarChartWidget } from '../../components/charts/ChartWidgets'
import { attendanceColor, fmt } from '../../utils/helpers'

function AttendanceMeter({ pct }) {
  const p = parseFloat(pct ?? 0)
  const color = p >= 75 ? 'bg-success' : p >= 60 ? 'bg-warning' : 'bg-danger'
  return (
    <div className="flex items-center gap-2.5 min-w-[120px]">
      <div className="flex-1 h-1.5 bg-bg-elevated rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${Math.min(p, 100)}%` }} />
      </div>
      <span className={`text-xs font-mono font-semibold w-12 text-right ${attendanceColor(p)}`}>
        {fmt.percent(p)}
      </span>
    </div>
  )
}

export default function Attendance() {
  const { data: attendance, loading: aLoad, error: aError, refetch } = useFetch(attendanceService.getAll)
  const { data: percentage, loading: pLoad } = useFetch(attendanceService.getPercentage)
  const { data: lowAtt, loading: lLoad } = useFetch(attendanceService.getLowAttendance)

  const { query, setQuery, filtered } = useSearch(attendance ?? [], ['student_name', 'course_name', 'student_id'])
  const { page, totalPages, paginated, goTo, next, prev, reset, pageSize } = usePagination(filtered, 10)

  const avgAttendance = useMemo(() => {
    if (!Array.isArray(percentage) || percentage.length === 0) return 0
    return percentage.reduce((a, r) => a + parseFloat(r.attendance_percentage ?? r.percentage ?? 0), 0) / percentage.length
  }, [percentage])

  const chartData = useMemo(() =>
    Array.isArray(percentage)
      ? percentage.slice(0, 10).map(r => ({
          name: (r.student_name ?? r.name ?? 'Student').split(' ')[0],
          pct: parseFloat(r.attendance_percentage ?? r.percentage ?? 0),
        }))
      : [],
    [percentage])

  return (
    <div className="space-y-5 animate-slide-in">
      <div className="page-header">
        <h2 className="page-title">Attendance</h2>
        <p className="page-subtitle">Track and monitor student attendance</p>
      </div>

      {aError && <ErrorBanner message={aError} onRetry={refetch} />}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
              <Activity size={18} className="text-accent" />
            </div>
            <div>
              <p className="font-display text-xl font-bold text-txt-primary">{fmt.percent(avgAttendance)}</p>
              <p className="text-xs text-txt-muted">Average Attendance</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-danger/10 flex items-center justify-center shrink-0">
              <AlertTriangle size={18} className="text-danger" />
            </div>
            <div>
              <p className="font-display text-xl font-bold text-danger">{Array.isArray(lowAtt) ? lowAtt.length : '—'}</p>
              <p className="text-xs text-txt-muted">Low Attendance Alerts</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center shrink-0">
              <ClipboardList size={18} className="text-success" />
            </div>
            <div>
              <p className="font-display text-xl font-bold text-txt-primary">{Array.isArray(attendance) ? attendance.length : '—'}</p>
              <p className="text-xs text-txt-muted">Total Records</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Chart + Alerts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Attendance Overview" subtitle="Top students by attendance %" loading={pLoad}>
          <BarChartWidget data={chartData} xKey="name"
            bars={[{ key: 'pct', label: 'Attendance %', color: '#22d3ee' }]} height={200} />
        </ChartCard>

        {/* Low Attendance Alerts */}
        <Card padding={false}>
          <div className="px-5 py-4 border-b border-bg-border flex items-center gap-2">
            <AlertTriangle size={15} className="text-danger" />
            <h3 className="text-sm font-semibold text-txt-primary">Low Attendance Alerts</h3>
            <span className="ml-auto text-xs font-mono bg-danger/10 text-danger px-2 py-0.5 rounded-full">
              {Array.isArray(lowAtt) ? lowAtt.length : 0} students
            </span>
          </div>
          <div className="max-h-64 overflow-y-auto divide-y divide-bg-border/50">
            {lLoad ? (
              <div className="p-4 space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-9 bg-bg-elevated rounded animate-pulse" />
                ))}
              </div>
            ) : Array.isArray(lowAtt) && lowAtt.length > 0 ? (
              lowAtt.map((s, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-3 hover:bg-bg-elevated transition-colors">
                  <div>
                    <p className="text-sm font-medium text-txt-primary">{s.student_name ?? s.name}</p>
                    <p className="text-xs text-txt-muted">{s.course_name ?? 'All Courses'}</p>
                  </div>
                  <span className="font-mono text-sm font-bold text-danger">
                    {fmt.percent(s.attendance_percentage ?? s.percentage ?? 0)}
                  </span>
                </div>
              ))
            ) : (
              <p className="px-5 py-8 text-sm text-txt-muted text-center">No low attendance alerts</p>
            )}
          </div>
        </Card>
      </div>

      {/* Full Table */}
      <div className="bg-bg-card border border-bg-border rounded-xl shadow-card overflow-hidden">
        <div className="px-4 py-3 border-b border-bg-border flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-bg-surface border border-bg-border rounded-lg flex-1 max-w-sm">
            <Search size={14} className="text-txt-muted shrink-0" />
            <input value={query} onChange={e => { setQuery(e.target.value); reset() }}
              placeholder="Search by student, course..." className="bg-transparent text-sm text-txt-primary placeholder:text-txt-muted flex-1 outline-none" />
          </div>
        </div>
        <div className="overflow-x-auto">
          {aLoad ? <LoadingTable rows={8} cols={5} /> : filtered?.length === 0 ? (
            <EmptyState icon={ClipboardList} title="No attendance records" />
          ) : (
            <table className="data-table">
              <thead><tr><th>Student</th><th>Course</th><th>Classes Attended</th><th>Total Classes</th><th>Attendance</th></tr></thead>
              <tbody>
                {paginated.map((r, i) => (
                  <tr key={i}>
                    <td>
                      <div>
                        <p className="font-medium text-txt-primary">{r.student_name ?? r.name}</p>
                        <p className="text-2xs text-txt-muted font-mono">{r.student_id}</p>
                      </div>
                    </td>
                    <td className="text-txt-secondary">{r.course_name ?? r.course ?? '—'}</td>
                    <td className="font-mono text-txt-secondary">{r.classes_attended ?? r.attended ?? '—'}</td>
                    <td className="font-mono text-txt-secondary">{r.total_classes ?? r.total ?? '—'}</td>
                    <td><AttendanceMeter pct={r.attendance_percentage ?? r.percentage} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {!aLoad && filtered?.length > 0 && (
          <Pagination page={page} totalPages={totalPages} onPrev={prev} onNext={next} onGoTo={goTo} total={filtered.length} pageSize={pageSize} />
        )}
      </div>
    </div>
  )
}
