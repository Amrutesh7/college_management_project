import { useState } from 'react'
import { Plus, Search, Pencil, Trash2, BookOpen, AlertTriangle } from 'lucide-react'
import { useFetch } from '../../hooks/useFetch'
import { useSearch } from '../../hooks/useSearch'
import { usePagination } from '../../hooks/usePagination'
import { useModal } from '../../hooks/useModal'
import courseService from '../../services/courseService'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Pagination from '../../components/ui/Pagination'
import LoadingTable from '../../components/ui/LoadingTable'
import EmptyState from '../../components/ui/EmptyState'
import ErrorBanner from '../../components/ui/ErrorBanner'

const DEPT_OPTS = [
  { value: '', label: 'Select Department' },
  { value: 'CSE', label: 'Computer Science' },
  { value: 'ECE', label: 'Electronics' },
  { value: 'MECH', label: 'Mechanical' },
  { value: 'CIVIL', label: 'Civil' },
  { value: 'IT', label: 'Information Technology' },
]

function CourseForm({ initial = {}, onChange }) {
  const [form, setForm] = useState({
    course_name: initial.course_name ?? initial.name ?? '',
    course_code: initial.course_code ?? initial.code ?? '',
    department: initial.department ?? '',
    credits: initial.credits ?? '',
    semester: initial.semester ?? '',
  })
  const u = (k, v) => { const upd = { ...form, [k]: v }; setForm(upd); onChange?.(upd) }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Input label="Course Name" placeholder="e.g. Data Structures" value={form.course_name}
        onChange={e => u('course_name', e.target.value)} containerClass="sm:col-span-2" />
      <Input label="Course Code" placeholder="e.g. CS301" value={form.course_code}
        onChange={e => u('course_code', e.target.value)} />
      <Input label="Credits" type="number" min="1" max="6" placeholder="e.g. 4" value={form.credits}
        onChange={e => u('credits', e.target.value)} />
      <Select label="Department" options={DEPT_OPTS} value={form.department}
        onChange={e => u('department', e.target.value)} />
      <Input label="Semester" type="number" min="1" max="8" placeholder="e.g. 3" value={form.semester}
        onChange={e => u('semester', e.target.value)} />
    </div>
  )
}

export default function Courses() {
  const { data: courses, loading, error, refetch } = useFetch(courseService.getAll)
  const { query, setQuery, filtered } = useSearch(courses ?? [], ['course_name', 'course_code', 'department'])
  const { page, totalPages, paginated, goTo, next, prev, reset, pageSize } = usePagination(filtered, 10)
  const addModal = useModal()
  const editModal = useModal()
  const deleteModal = useModal()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({})

  const handleAdd = async () => {
    setSaving(true)
    try { await courseService.create(formData); addModal.close(); refetch() }
    catch (e) { alert(e.message) } finally { setSaving(false) }
  }
  const handleEdit = async () => {
    setSaving(true)
    try { await courseService.update(editModal.data?.course_id ?? editModal.data?.id, formData); editModal.close(); refetch() }
    catch (e) { alert(e.message) } finally { setSaving(false) }
  }
  const handleDelete = async () => {
    setSaving(true)
    try { await courseService.remove(deleteModal.data?.course_id ?? deleteModal.data?.id); deleteModal.close(); refetch() }
    catch (e) { alert(e.message) } finally { setSaving(false) }
  }

  const ACCENT_MAP = ['text-accent bg-accent/10', 'text-violet bg-violet/10', 'text-warning bg-warning/10', 'text-success bg-success/10']

  return (
    <div className="space-y-5 animate-slide-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="page-header mb-0">
          <h2 className="page-title">Courses</h2>
          <p className="page-subtitle">{filtered?.length ?? 0} courses</p>
        </div>
        <Button variant="primary" icon={<Plus size={15} />} onClick={() => { setFormData({}); addModal.open() }}>
          Add Course
        </Button>
      </div>

      {error && <ErrorBanner message={error} onRetry={refetch} />}

      <div className="bg-bg-card border border-bg-border rounded-xl shadow-card overflow-hidden">
        <div className="px-4 py-3 border-b border-bg-border flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-bg-surface border border-bg-border rounded-lg flex-1 max-w-sm">
            <Search size={14} className="text-txt-muted shrink-0" />
            <input value={query} onChange={e => { setQuery(e.target.value); reset() }}
              placeholder="Search courses..." className="bg-transparent text-sm text-txt-primary placeholder:text-txt-muted flex-1 outline-none" />
          </div>
        </div>
        <div className="overflow-x-auto">
          {loading ? <LoadingTable rows={8} cols={5} /> : filtered?.length === 0 ? (
            <EmptyState icon={BookOpen} title="No courses found" />
          ) : (
            <table className="data-table">
              <thead><tr><th>Code</th><th>Course Name</th><th>Department</th><th>Credits</th><th>Semester</th><th className="text-right">Actions</th></tr></thead>
              <tbody>
                {paginated.map((c, i) => (
                  <tr key={c.course_id ?? c.id ?? i}>
                    <td>
                      <span className={`font-mono text-xs px-2 py-0.5 rounded font-semibold ${ACCENT_MAP[i % ACCENT_MAP.length]}`}>
                        {c.course_code ?? c.code ?? '—'}
                      </span>
                    </td>
                    <td className="font-medium text-txt-primary">{c.course_name ?? c.name}</td>
                    <td>
                      <span className="px-2 py-0.5 rounded bg-bg-elevated text-xs font-medium text-txt-secondary">
                        {c.department_name ?? c.department}
                      </span>
                    </td>
                    <td className="text-txt-secondary">{c.credits ?? '—'}</td>
                    <td className="text-txt-secondary">Sem {c.semester ?? '—'}</td>
                    <td>
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => { setFormData(c); editModal.open(c) }}
                          className="p-1.5 rounded-lg text-txt-muted hover:text-warning hover:bg-warning/10 transition-all"><Pencil size={14} /></button>
                        <button onClick={() => deleteModal.open(c)}
                          className="p-1.5 rounded-lg text-txt-muted hover:text-danger hover:bg-danger/10 transition-all"><Trash2 size={14} /></button>
                      </div>
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

      <Modal isOpen={addModal.isOpen} onClose={addModal.close} title="Add Course"
        footer={<><Button variant="ghost" onClick={addModal.close}>Cancel</Button><Button variant="primary" loading={saving} onClick={handleAdd}>Add Course</Button></>}>
        <CourseForm onChange={setFormData} />
      </Modal>
      <Modal isOpen={editModal.isOpen} onClose={editModal.close} title="Edit Course"
        footer={<><Button variant="ghost" onClick={editModal.close}>Cancel</Button><Button variant="primary" loading={saving} onClick={handleEdit}>Save Changes</Button></>}>
        <CourseForm initial={editModal.data ?? {}} onChange={setFormData} />
      </Modal>
      <Modal isOpen={deleteModal.isOpen} onClose={deleteModal.close} title="Delete Course" size="sm"
        footer={<><Button variant="ghost" onClick={deleteModal.close}>Cancel</Button><Button variant="danger" loading={saving} onClick={handleDelete} icon={<Trash2 size={14} />}>Delete</Button></>}>
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-danger/10 flex items-center justify-center shrink-0"><AlertTriangle size={18} className="text-danger" /></div>
          <div>
            <p className="text-sm text-txt-primary font-medium mb-1">Delete <span className="text-danger">{deleteModal.data?.course_name ?? deleteModal.data?.name}</span>?</p>
            <p className="text-xs text-txt-muted">This course and all related data will be removed.</p>
          </div>
        </div>
      </Modal>
    </div>
  )
}
