export const fmt = {
  percent: (n) => `${Number(n ?? 0).toFixed(1)}%`,
  number: (n) => Number(n ?? 0).toLocaleString(),
  grade: (cgpa) => {
    if (cgpa >= 9) return 'O'
    if (cgpa >= 8) return 'A+'
    if (cgpa >= 7) return 'A'
    if (cgpa >= 6) return 'B+'
    if (cgpa >= 5) return 'B'
    return 'F'
  },
}

export const cn = (...classes) => classes.filter(Boolean).join(' ')

export const gradeColor = (cgpa) => {
  if (cgpa >= 8) return 'text-success'
  if (cgpa >= 6) return 'text-accent'
  if (cgpa >= 5) return 'text-warning'
  return 'text-danger'
}

export const attendanceColor = (pct) => {
  if (pct >= 75) return 'text-success'
  if (pct >= 60) return 'text-warning'
  return 'text-danger'
}

export const statusBadge = (status) => {
  const map = {
    Active: 'bg-success/10 text-success',
    Inactive: 'bg-danger/10 text-danger',
    Pass: 'bg-success/10 text-success',
    Fail: 'bg-danger/10 text-danger',
  }
  return map[status] ?? 'bg-bg-elevated text-txt-secondary'
}
