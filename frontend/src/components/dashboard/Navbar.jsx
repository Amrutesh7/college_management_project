import { useLocation } from 'react-router-dom'
import { Bell, Search, Menu } from 'lucide-react'
import { useApp } from '../../context/AppContext'

const PAGE_TITLES = {
  '/dashboard':  { title: 'Dashboard',  sub: 'Overview of your institution' },
  '/students':   { title: 'Students',   sub: 'Manage student records' },
  '/faculty':    { title: 'Faculty',    sub: 'Faculty members & workload' },
  '/courses':    { title: 'Courses',    sub: 'Course catalogue & mappings' },
  '/attendance': { title: 'Attendance', sub: 'Track attendance records' },
  '/results':    { title: 'Results',    sub: 'Exam results & analytics' },
  '/analytics':  { title: 'Analytics',  sub: 'Insights & performance data' },
}

export default function Navbar() {
  const location = useLocation()
  const { toggleSidebar, notifications } = useApp()

  const base = '/' + location.pathname.split('/')[1]
  const meta = PAGE_TITLES[base] ?? { title: 'AcademiX', sub: '' }

  return (
    <header className="h-16 flex items-center gap-4 px-6 border-b border-bg-border bg-bg-surface/80 backdrop-blur-sm shrink-0">
      {/* Mobile menu */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden p-2 rounded-lg text-txt-muted hover:text-txt-primary hover:bg-bg-elevated transition-all"
      >
        <Menu size={18} />
      </button>

      {/* Page title */}
      <div className="flex-1 min-w-0">
        <h1 className="font-display text-base font-bold text-txt-primary leading-tight">{meta.title}</h1>
        <p className="text-xs text-txt-muted hidden sm:block">{meta.sub}</p>
      </div>

      {/* Search */}
      <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-bg-card border border-bg-border rounded-xl w-52 lg:w-64">
        <Search size={14} className="text-txt-muted shrink-0" />
        <input
          placeholder="Search anything..."
          className="bg-transparent text-sm text-txt-primary placeholder:text-txt-muted flex-1 outline-none min-w-0"
        />
        <kbd className="text-2xs text-txt-muted font-mono bg-bg-elevated px-1.5 py-0.5 rounded border border-bg-border hidden lg:block">
          ⌘K
        </kbd>
      </div>

      {/* Notifications */}
      <button className="relative p-2 rounded-xl text-txt-muted hover:text-txt-primary hover:bg-bg-elevated transition-all">
        <Bell size={18} />
        {notifications > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full ring-2 ring-bg-surface" />
        )}
      </button>

      {/* Admin avatar */}
      <div className="flex items-center gap-2.5 pl-2 border-l border-bg-border">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent/30 to-violet/30 border border-accent/20 flex items-center justify-center">
          <span className="text-xs font-bold text-accent font-mono">AD</span>
        </div>
        <div className="hidden sm:block">
          <p className="text-xs font-semibold text-txt-primary leading-tight">Admin</p>
          <p className="text-2xs text-txt-muted">Super Admin</p>
        </div>
      </div>
    </header>
  )
}
