import { cn } from '../../utils/helpers'

export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-bg-elevated text-txt-secondary',
    success: 'bg-success/10 text-success',
    danger: 'bg-danger/10 text-danger',
    warning: 'bg-warning/10 text-warning',
    accent: 'bg-accent/10 text-accent',
    violet: 'bg-violet/10 text-violet',
  }
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold tracking-wide',
      variants[variant],
      className,
    )}>
      {children}
    </span>
  )
}
