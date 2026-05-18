import { useState } from 'react'
import { Plus, Search, Pencil, Trash2, Users, AlertTriangle, BookOpen } from 'lucide-react'
import { useFetch } from '../../hooks/useFetch'
import { useSearch } from '../../hooks/useSearch'
import { usePagination } from '../../hooks/usePagination'
import { useModal } from '../../hooks/useModal'
import facultyService from '../../services/facultyService'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Pagination from '../../components/ui/Pagination'
import LoadingTable from '../../components/ui/LoadingTable'
import EmptyState from '../../components/ui/EmptyState'
import ErrorBanner from '../../components/ui/ErrorBanner'
import ChartCard from '../../components/charts/ChartCard'
import { BarChartWidget } from '../../components/charts/ChartWidgets'

const DEPT_OPTS = [
  { value: 'Computer Science Engineering', label: 'Computer Science Engineering' },

  { value: 'Artificial Intelligence & Machine Learning', label: 'Artificial Intelligence & Machine Learning' },

  { value: 'Electronics & Communication Engineering', label: 'Electronics & Communication Engineering' },

  { value: 'Mechanical Engineering', label: 'Mechanical Engineering' },

  { value: 'Civil Engineering', label: 'Civil Engineering' },

  { value: 'Information Science Engineering', label: 'Information Science Engineering' },
]

function FacultyForm({ initial = {}, onChange }) {
  const [form, setForm] = useState({
    name: initial.faculty_name ?? initial.name ?? '',
    department: initial.department ?? '',
    email: initial.email ?? '',
    phone: initial.phone ?? '',
    designation: initial.designation ?? '',
  })
  const update = (k, v) => { const u = { ...form, [k]: v }; setForm(u); onChange?.(u) }
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Full Name" placeholder="Dr. Name" value={form.name}
          onChange={e => update('name', e.target.value)} containerClass="sm:col-span-2" />
        <Input label="Email" type="email" placeholder="faculty@college.edu" value={form.email}
          onChange={e => update('email', e.target.value)} />
        <Input label="Phone" placeholder="+91 9876543210" value={form.phone}
          onChange={e => update('phone', e.target.value)} />
        <Select label="Department" options={DEPT_OPTS} value={form.department}
          onChange={e => update('department', e.target.value)} />
        <Input label="Designation" placeholder="e.g. Associate Professor" value={form.designation}
          onChange={e => update('designation', e.target.value)} />
      </div>
    </div>
  )
}

export default function Faculty() {
  const { data: faculty, loading, error, refetch } = useFetch(facultyService.getAllWithCourses)
  const { data: workload, loading: wLoad } = useFetch(facultyService.getWorkload)
  const { query, setQuery, filtered } = useSearch(faculty ?? [], ['faculty_name', 'name', 'department'])
  const { page, totalPages, paginated, goTo, next, prev, reset, pageSize } = usePagination(filtered, 10)
  const addModal = useModal()
  const editModal = useModal()
  const deleteModal = useModal()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({})

  const handleAdd = async () => {
    setSaving(true)
    const names = formData.name.trim().split(' ')

    const departmentMap = {
      'Computer Science Engineering': 1,
      'Artificial Intelligence & Machine Learning': 2,
      'Electronics & Communication Engineering': 3,
      'Mechanical Engineering': 4,
      'Civil Engineering': 5,
      'Information Science Engineering': 6,
    }

    console.log(formData.department)
    const payload = {
      first_name: names[0],
      last_name: names.slice(1).join(' ') || '',
      email: formData.email,
      phone: formData.phone,
      designation: formData.designation,
      department_id: departmentMap[formData.department],
      department: formData.department,
      salary: 50000,
      joining_date: new Date().toISOString().split('T')[0],
    }

    try {
      await facultyService.create(payload);
      addModal.close();
      refetch()
    }
    catch (e) { alert(e.message) } finally { setSaving(false) }
  }
  const handleEdit = async () => {
    setSaving(true)
    try { await facultyService.update(editModal.data?.faculty_id ?? editModal.data?.id, formData); editModal.close(); refetch() }
    catch (e) { alert(e.message) } finally { setSaving(false) }
  }
  const handleDelete = async () => {
    setSaving(true)
    try { await facultyService.remove(deleteModal.data?.faculty_id ?? deleteModal.data?.id); deleteModal.close(); refetch() }
    catch (e) { alert(e.message) } finally { setSaving(false) }
  }

  const workloadChart = Array.isArray(workload)
    ? workload.map(w => ({
      name: `${w.first_name} ${w.last_name}`,
      courses: w.total_courses ?? 0
    }))
    : []

  return (
    <div className="space-y-5 animate-slide-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="page-header mb-0">
          <h2 className="page-title">Faculty</h2>
          <p className="page-subtitle">{filtered?.length ?? 0} members</p>
        </div>
        <Button variant="primary" icon={<Plus size={15} />} onClick={() => { setFormData({}); addModal.open() }}>
          Add Faculty
        </Button>
      </div>

      {error && <ErrorBanner message={error} onRetry={refetch} />}

      {/* Workload chart */}
      {workloadChart.length > 0 && (
        <ChartCard title="Faculty Workload" subtitle="Courses assigned per faculty" loading={wLoad}>
          <BarChartWidget
            data={workloadChart.slice(0, 8)}
            xKey="name"
            bars={[{ key: 'courses', label: 'Courses', color: '#a78bfa' }]}
            height={200}
          />
        </ChartCard>
      )}

      {/* Table */}
      <div className="bg-bg-card border border-bg-border rounded-xl shadow-card overflow-hidden">
        <div className="px-4 py-3 border-b border-bg-border flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-bg-surface border border-bg-border rounded-lg flex-1 max-w-sm">
            <Search size={14} className="text-txt-muted shrink-0" />
            <input value={query} onChange={e => { setQuery(e.target.value); reset() }}
              placeholder="Search faculty..." className="bg-transparent text-sm text-txt-primary placeholder:text-txt-muted flex-1 outline-none" />
          </div>
        </div>
        <div className="overflow-x-auto">
          {loading ? <LoadingTable rows={8} cols={5} /> : filtered?.length === 0 ? (
            <EmptyState icon={Users} title="No faculty found" subtitle="Add faculty members to get started" />
          ) : (
            <table className="data-table">
              <thead><tr>
                <th>Faculty ID</th><th>Name</th><th>Department</th><th>Courses</th><th className="text-right">Actions</th>
              </tr></thead>
              <tbody>
                {paginated.map((f) => {
                  const courses =
                    typeof f.courses === "string"
                      ? f.courses.split(",").map(c => c.trim())
                      : []
                  return (
                    <tr key={f.faculty_id ?? f.id}>
                      <td><span className="font-mono text-xs text-violet bg-violet/10 px-2 py-0.5 rounded">{f.faculty_id ?? f.id}</span></td>
                      <td>
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-violet/10 flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-violet">{(f.faculty_name ?? f.name ?? '?').charAt(0)}</span>
                          </div>
                          <div>
                            <p className="font-medium text-txt-primary">{f.faculty_name ?? f.name}</p>
                            {f.designation && <p className="text-xs text-txt-muted">{f.designation}</p>}
                          </div>
                        </div>
                      </td>
                      <td><span className="px-2 py-0.5 rounded bg-bg-elevated text-xs font-medium text-txt-secondary">{f.department}</span></td>
                      <td>
                        <div className="flex flex-wrap gap-1">
                          {courses.slice(0, 2).map((c, i) => (
                            <span key={i} className="px-1.5 py-0.5 rounded bg-accent/10 text-accent text-2xs font-medium">
                              {c}
                            </span>
                          ))}
                          {courses.length > 2 && (
                            <span className="px-1.5 py-0.5 rounded bg-bg-elevated text-txt-muted text-2xs">+{courses.length - 2}</span>
                          )}
                          {courses.length === 0 && <span className="text-xs text-txt-muted">No courses</span>}
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => { setFormData(f); editModal.open(f) }}
                            className="p-1.5 rounded-lg text-txt-muted hover:text-warning hover:bg-warning/10 transition-all">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => deleteModal.open(f)}
                            className="p-1.5 rounded-lg text-txt-muted hover:text-danger hover:bg-danger/10 transition-all">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
        {!loading && filtered?.length > 0 && (
          <Pagination page={page} totalPages={totalPages} onPrev={prev} onNext={next} onGoTo={goTo} total={filtered.length} pageSize={pageSize} />
        )}
      </div>

      <Modal isOpen={addModal.isOpen} onClose={addModal.close} title="Add Faculty Member"
        footer={<><Button variant="ghost" onClick={addModal.close}>Cancel</Button><Button variant="primary" loading={saving} onClick={handleAdd}>Add Faculty</Button></>}>
        <FacultyForm onChange={setFormData} />
      </Modal>

      <Modal isOpen={editModal.isOpen} onClose={editModal.close} title="Edit Faculty"
        footer={<><Button variant="ghost" onClick={editModal.close}>Cancel</Button><Button variant="primary" loading={saving} onClick={handleEdit}>Save Changes</Button></>}>
        <FacultyForm initial={editModal.data ?? {}} onChange={setFormData} />
      </Modal>

      <Modal isOpen={deleteModal.isOpen} onClose={deleteModal.close} title="Delete Faculty" size="sm"
        footer={<><Button variant="ghost" onClick={deleteModal.close}>Cancel</Button><Button variant="danger" loading={saving} onClick={handleDelete} icon={<Trash2 size={14} />}>Delete</Button></>}>
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-danger/10 flex items-center justify-center shrink-0"><AlertTriangle size={18} className="text-danger" /></div>
          <div>
            <p className="text-sm text-txt-primary font-medium mb-1">Delete <span className="text-danger">{deleteModal.data?.faculty_name ?? deleteModal.data?.name}</span>?</p>
            <p className="text-xs text-txt-muted">This will remove all associated course assignments.</p>
          </div>
        </div>
      </Modal>
    </div>
  )
}
