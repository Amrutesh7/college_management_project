import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Users, GraduationCap, BookOpen,
  ClipboardList, BarChart3, TrendingUp, ChevronLeft,
  Sparkles,
} from 'lucide-react'
import { cn } from '../../utils/helpers'
import { useApp } from '../../context/AppContext'

const NAV = [
  { label: 'Dashboard',  to: '/dashboard',  icon: LayoutDashboard },
  { label: 'Students',   to: '/students',   icon: GraduationCap },
  { label: 'Faculty',    to: '/faculty',    icon: Users },
  { label: 'Courses',    to: '/courses',    icon: BookOpen },
  { label: 'Attendance', to: '/attendance', icon: ClipboardList },
  { label: 'Results',    to: '/results',    icon: BarChart3 },
  { label: 'Analytics',  to: '/analytics',  icon: TrendingUp },
]

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useApp()
  const location = useLocation()

  return (
    <aside
      className={cn(
        'flex flex-col bg-bg-surface border-r border-bg-border h-screen',
        'transition-all duration-300 ease-in-out shrink-0',
        sidebarCollapsed ? 'w-[60px]' : 'w-[220px]',
      )}
    >
      {/* Logo */}
      <div className={cn(
        'flex items-center h-16 px-4 border-b border-bg-border gap-3 overflow-hidden',
      )}>
        <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
          <Sparkles size={15} className="text-accent" />
        </div>
        {!sidebarCollapsed && (
          <span className="font-display text-base font-bold text-txt-primary tracking-tight whitespace-nowrap">
            AcademiX
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto overflow-x-hidden">
        {!sidebarCollapsed && (
          <p className="px-3 mb-2 text-2xs font-bold uppercase tracking-widest text-txt-muted">
            Navigation
          </p>
        )}
        {NAV.map(({ label, to, icon: Icon }) => {
          const active = location.pathname.startsWith(to)
          return (
            <NavLink key={to} to={to}>
              <div className={cn(
                'sidebar-link',
                active && 'active',
                sidebarCollapsed && 'justify-center px-0',
              )}>
                <Icon size={17} className={cn(
                  'shrink-0 transition-colors',
                  active ? 'text-accent' : 'text-txt-muted group-hover:text-txt-secondary',
                )} />
                {!sidebarCollapsed && (
                  <span className="truncate">{label}</span>
                )}
              </div>
            </NavLink>
          )
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="px-2 pb-4">
        <button
          onClick={toggleSidebar}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium',
            'text-txt-muted hover:text-txt-primary hover:bg-bg-elevated transition-all',
            sidebarCollapsed && 'justify-center px-0',
          )}
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft
            size={16}
            className={cn('shrink-0 transition-transform duration-300', sidebarCollapsed && 'rotate-180')}
          />
          {!sidebarCollapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  )
}
