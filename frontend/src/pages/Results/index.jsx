import { useMemo } from 'react'
import { Search, Trophy, BarChart3 } from 'lucide-react'
import { useFetch } from '../../hooks/useFetch'
import { useSearch } from '../../hooks/useSearch'
import { usePagination } from '../../hooks/usePagination'
import resultService from '../../services/resultService'
import LoadingTable from '../../components/ui/LoadingTable'
import EmptyState from '../../components/ui/EmptyState'
import ErrorBanner from '../../components/ui/ErrorBanner'
import Pagination from '../../components/ui/Pagination'
import Badge from '../../components/ui/Badge'
import Card from '../../components/ui/Card'
import ChartCard from '../../components/charts/ChartCard'
import { PieChartWidget, BarChartWidget } from '../../components/charts/ChartWidgets'
import { gradeColor, fmt } from '../../utils/helpers'
import { useState } from 'react'

export default function Results() {
  const { data: results, loading, error, refetch } = useFetch(resultService.getAll)
  const { data: topper, loading: tLoad } = useFetch(resultService.getTopper)
  const { data: analytics, loading: aLoad } = useFetch(resultService.getAnalytics)

  const { query, setQuery, filtered } = useSearch(results ?? [], ['student_name', 'course_name', 'student_id'])
  const { page, totalPages, paginated, goTo, next, prev, reset, pageSize } = usePagination(filtered, 10)

  const passFailData = useMemo(() =>
    Array.isArray(analytics)
      ? analytics.map(a => ({
        name: a.result_status,
        value: a.total
      }))
      : [],
    [analytics])

  const gradeDistData = useMemo(() => {
    if (!Array.isArray(results)) return []
    const map = {}
    results.forEach(r => {
      const g = r.grade ?? 'N/A'
      map[g] = (map[g] ?? 0) + 1
    })
    return Object.entries(map).map(([grade, count]) => ({ grade, count }))
  }, [results])

  const topStudent = Array.isArray(topper) ? topper[0] : topper

  return (
    <div className="space-y-5 animate-slide-in">
      <div className="page-header">
        <h2 className="page-title">Results</h2>
        <p className="page-subtitle">Exam performance and grade analytics</p>
      </div>

      {error && <ErrorBanner message={error} onRetry={refetch} />}

      {/* Topper + Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Topper Card */}
        <Card hover>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
              <Trophy size={18} className="text-warning" />
            </div>
            <div>
              <p className="text-xs text-txt-muted font-semibold uppercase tracking-wider">Overall Topper</p>
              <p className="text-sm font-bold text-txt-primary">{tLoad ? '...' : (`${topStudent?.first_name ?? ''} ${topStudent?.last_name ?? ''}`.trim() || 'N/A')}</p>
            </div>
          </div>
          {topStudent && (
            <div className="space-y-2 pt-3 border-t border-bg-border">
              {[
                ['Student ID', topStudent.student_id ?? '—', true],
                ['Department', topStudent.department ?? '—', false],
                ['CGPA', topStudent.cgpa ?? topStudent.total_marks ?? '—', false],
              ].map(([label, val, mono]) => (
                <div key={label} className="flex justify-between items-center">
                  <span className="text-xs text-txt-muted">{label}</span>
                  <span className={`text-xs font-semibold text-txt-primary ${mono ? 'font-mono' : ''}`}>{val}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <ChartCard title="Pass vs Fail" subtitle="Overall result distribution" loading={aLoad}>
          <PieChartWidget data={passFailData} nameKey="name" valueKey="value" height={200} />
        </ChartCard>

        <ChartCard title="Grade Distribution" subtitle="Number of students per grade" loading={loading}>
          <BarChartWidget data={gradeDistData} xKey="grade"
            bars={[{ key: 'count', label: 'Students', color: '#22c55e' }]} height={200} />
        </ChartCard>
      </div>

      {/* Results Table */}
      <div className="bg-bg-card border border-bg-border rounded-xl shadow-card overflow-hidden">
        <div className="px-4 py-3 border-b border-bg-border flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-bg-surface border border-bg-border rounded-lg flex-1 max-w-sm">
            <Search size={14} className="text-txt-muted shrink-0" />
            <input value={query} onChange={e => { setQuery(e.target.value); reset() }}
              placeholder="Search results..." className="bg-transparent text-sm text-txt-primary placeholder:text-txt-muted flex-1 outline-none" />
          </div>
          <span className="text-xs text-txt-muted hidden sm:block">{filtered?.length ?? 0} records</span>
        </div>
        <div className="overflow-x-auto">
          {loading ? <LoadingTable rows={8} cols={6} /> : filtered?.length === 0 ? (
            <EmptyState icon={BarChart3} title="No results found" />
          ) : (
            <table className="data-table">
              <thead><tr>
                <th>Student</th><th>Course</th><th>Total Marks</th><th>Grade</th><th>Status</th>
              </tr></thead>
              <tbody>
                {paginated.map((r, i) => (
                  <tr key={i}>
                    <td>
                      <div>
                        <p className="font-medium text-txt-primary">{`${r.first_name ?? ''} ${r.last_name ?? ''}`.trim()}</p>
                        <p className="text-2xs font-mono text-txt-muted">{r.student_id}</p>
                      </div>
                    </td>
                    <td className="text-txt-secondary">{r.course_name ?? r.course ?? '—'}</td>
                    <td className="font-mono font-semibold text-txt-primary">{r.total_marks ?? r.marks ?? '—'}</td>
                    <td>
                      <span className={`font-mono font-bold text-sm ${gradeColor(r.grade_point ?? r.cgpa)}`}>
                        {r.grade ?? '—'}
                      </span>
                    </td>
                    <td>
                      <Badge variant={r.grade === 'F' ? 'danger' : 'success'}>
                        {r.grade === 'F' ? 'Fail' : 'Pass'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {!loading && filtered?.length > 0 && (
          <Pagination page={page} totalPages={totalPages} onPrev={prev} onNext={next} onGoTo={goTo} total={filtered.length} pageSize={pageSize} />
        )}
      </div>
    </div>
  )
}
