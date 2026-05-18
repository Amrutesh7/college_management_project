import { useState } from 'react'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'

const DEPARTMENTS = [
  { value: '', label: 'Select Department' },
  { value: 'CSE', label: 'Computer Science' },
  { value: 'ECE', label: 'Electronics & Comm.' },
  { value: 'MECH', label: 'Mechanical' },
  { value: 'CIVIL', label: 'Civil' },
  { value: 'IT', label: 'Information Technology' },
  { value: 'EEE', label: 'Electrical' },
]

const SEMESTERS = Array.from({ length: 8 }, (_, i) => ({ value: i + 1, label: `Semester ${i + 1}` }))

const STATUSES = [
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' },
]

export default function StudentForm({ initial = {}, onChange }) {
  const [form, setForm] = useState({
    name: initial.name ?? '',
    department: initial.department ?? '',
    semester: initial.semester ?? 1,
    cgpa: initial.cgpa ?? '',
    email: initial.email ?? '',
    phone: initial.phone ?? '',
    status: initial.status ?? 'Active',
  })

  const [errors, setErrors] = useState({})

  const update = (key, val) => {
    const updated = { ...form, [key]: val }
    setForm(updated)
    setErrors(prev => ({ ...prev, [key]: '' }))
    onChange?.(updated)
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.department) e.department = 'Department is required'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required'
    if (form.cgpa && (isNaN(form.cgpa) || form.cgpa < 0 || form.cgpa > 10)) e.cgpa = 'CGPA must be 0–10'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  // Expose validate via ref pattern — parent can call form.validate()
  StudentForm._validate = validate

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          placeholder="e.g. Arun Kumar"
          value={form.name}
          onChange={e => update('name', e.target.value)}
          error={errors.name}
          containerClass="sm:col-span-2"
        />
        <Input
          label="Email Address"
          type="email"
          placeholder="student@college.edu"
          value={form.email}
          onChange={e => update('email', e.target.value)}
          error={errors.email}
        />
        <Input
          label="Phone Number"
          placeholder="+91 9876543210"
          value={form.phone}
          onChange={e => update('phone', e.target.value)}
          error={errors.phone}
        />
        <Select
          label="Department"
          options={DEPARTMENTS}
          value={form.department}
          onChange={e => update('department', e.target.value)}
          error={errors.department}
        />
        <Select
          label="Semester"
          options={SEMESTERS}
          value={form.semester}
          onChange={e => update('semester', Number(e.target.value))}
        />
        <Input
          label="CGPA"
          type="number"
          min="0"
          max="10"
          step="0.01"
          placeholder="e.g. 8.5"
          value={form.cgpa}
          onChange={e => update('cgpa', e.target.value)}
          error={errors.cgpa}
        />
        <Select
          label="Status"
          options={STATUSES}
          value={form.status}
          onChange={e => update('status', e.target.value)}
        />
      </div>
    </div>
  )
}
