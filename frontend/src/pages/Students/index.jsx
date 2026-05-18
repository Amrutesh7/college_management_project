import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Pencil, Trash2, Eye, GraduationCap, AlertTriangle } from 'lucide-react'
import { useFetch } from '../../hooks/useFetch'
import { useSearch } from '../../hooks/useSearch'
import { usePagination } from '../../hooks/usePagination'
import { useModal } from '../../hooks/useModal'
import studentService from '../../services/studentService'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import Pagination from '../../components/ui/Pagination'
import LoadingTable from '../../components/ui/LoadingTable'
import EmptyState from '../../components/ui/EmptyState'
import ErrorBanner from '../../components/ui/ErrorBanner'
import StudentForm from './StudentForm'
import { gradeColor, fmt } from '../../utils/helpers'

export default function Students() {
  const navigate = useNavigate()
  const { data: students, loading, error, refetch } = useFetch(studentService.getAll)
  const { query, setQuery, filtered } = useSearch(students ?? [], ['name', 'department', 'student_id'])
  const { page, totalPages, paginated, goTo, next, prev, reset, pageSize } = usePagination(filtered, 10)

  const addModal = useModal()
  const editModal = useModal()
  const deleteModal = useModal()

  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({})
  const formRef = useRef(null)

  const handleAdd = async () => {
    setSaving(true)
    try {
      await studentService.create(formData)
      addModal.close()
      refetch()
    } catch (e) { alert(e.message) }
    finally { setSaving(false) }
  }

  const handleEdit = async () => {
    setSaving(true)
    try {
      await studentService.update(editModal.data?.student_id ?? editModal.data?.id, formData)
      editModal.close()
      refetch()
    } catch (e) { alert(e.message) }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    setSaving(true)
    try {
      await studentService.remove(deleteModal.data?.student_id ?? deleteModal.data?.id)
      deleteModal.close()
      refetch()
    } catch (e) { alert(e.message) }
    finally { setSaving(false) }
  }

  return (
    <div className="space-y-5 animate-slide-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="page-header mb-0">
          <h2 className="page-title">Students</h2>
          <p className="page-subtitle">
            {filtered?.length ?? 0} of {students?.length ?? 0} records
          </p>
        </div>
        <Button
          variant="primary"
          icon={<Plus size={15} />}
          onClick={() => { setFormData({}); addModal.open() }}
        >
          Add Student
        </Button>
      </div>

      {error && <ErrorBanner message={error} onRetry={refetch} />}

      {/* Table Card */}
      <div className="bg-bg-card border border-bg-border rounded-xl shadow-card overflow-hidden">
        {/* Search Bar */}
        <div className="px-4 py-3 border-b border-bg-border flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-bg-surface border border-bg-border rounded-lg flex-1 max-w-sm">
            <Search size={14} className="text-txt-muted shrink-0" />
            <input
              value={query}
              onChange={e => { setQuery(e.target.value); reset() }}
              placeholder="Search by name, ID, department..."
              className="bg-transparent text-sm text-txt-primary placeholder:text-txt-muted flex-1 outline-none"
            />
          </div>
          <span className="text-xs text-txt-muted hidden sm:block">
            {filtered?.length ?? 0} results
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <LoadingTable rows={10} cols={7} />
          ) : filtered?.length === 0 ? (
            <EmptyState
              icon={GraduationCap}
              title="No students found"
              subtitle={query ? `No results for "${query}"` : 'Add your first student to get started'}
              action={
                !query && (
                  <Button variant="primary" size="sm" icon={<Plus size={13} />}
                    onClick={() => { setFormData({}); addModal.open() }}>
                    Add Student
                  </Button>
                )
              }
            />
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Semester</th>
                  <th>CGPA</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((s) => (
                  <tr key={s.student_id ?? s.id}>
                    <td>
                      <span className="font-mono text-xs text-accent bg-accent/10 px-2 py-0.5 rounded">
                        {s.student_id ?? s.id}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-bg-elevated flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-txt-secondary">
                            {(s.name ?? '?').charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium text-txt-primary">{s.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className="px-2 py-0.5 rounded bg-bg-elevated text-xs font-medium text-txt-secondary">
                        {s.department}
                      </span>
                    </td>
                    <td className="text-txt-secondary">Sem {s.semester}</td>
                    <td>
                      <span className={`font-mono font-semibold text-sm ${gradeColor(s.cgpa)}`}>
                        {s.cgpa ?? '—'}
                      </span>
                    </td>
                    <td>
                      <Badge variant={s.status === 'Active' ? 'success' : 'danger'}>
                        {s.status ?? 'Active'}
                      </Badge>
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => navigate(`/students/${s.student_id ?? s.id}`)}
                          title="View Profile"
                          className="p-1.5 rounded-lg text-txt-muted hover:text-accent hover:bg-accent/10 transition-all"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => { setFormData(s); editModal.open(s) }}
                          title="Edit"
                          className="p-1.5 rounded-lg text-txt-muted hover:text-warning hover:bg-warning/10 transition-all"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => deleteModal.open(s)}
                          title="Delete"
                          className="p-1.5 rounded-lg text-txt-muted hover:text-danger hover:bg-danger/10 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!loading && filtered?.length > 0 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPrev={prev}
            onNext={next}
            onGoTo={goTo}
            total={filtered.length}
            pageSize={pageSize}
          />
        )}
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={addModal.isOpen}
        onClose={addModal.close}
        title="Add New Student"
        footer={
          <>
            <Button variant="ghost" onClick={addModal.close}>Cancel</Button>
            <Button variant="primary" loading={saving} onClick={handleAdd}>
              Add Student
            </Button>
          </>
        }
      >
        <StudentForm onChange={setFormData} />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={editModal.close}
        title="Edit Student"
        footer={
          <>
            <Button variant="ghost" onClick={editModal.close}>Cancel</Button>
            <Button variant="primary" loading={saving} onClick={handleEdit}>
              Save Changes
            </Button>
          </>
        }
      >
        <StudentForm initial={editModal.data ?? {}} onChange={setFormData} />
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.close}
        title="Delete Student"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={deleteModal.close}>Cancel</Button>
            <Button variant="danger" loading={saving} onClick={handleDelete}
              icon={<Trash2 size={14} />}>
              Delete
            </Button>
          </>
        }
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-danger/10 flex items-center justify-center shrink-0">
            <AlertTriangle size={18} className="text-danger" />
          </div>
          <div>
            <p className="text-sm text-txt-primary font-medium mb-1">
              Are you sure you want to delete{' '}
              <span className="text-danger">{deleteModal.data?.name}</span>?
            </p>
            <p className="text-xs text-txt-muted">
              This action cannot be undone. All records associated with this student will be permanently removed.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  )
}
