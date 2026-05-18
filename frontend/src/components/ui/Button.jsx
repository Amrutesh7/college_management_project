import { cn } from '../../utils/helpers'
import Spinner from './Spinner'

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  className = '',
  ...props
}) {
  const variants = {
    primary: 'bg-accent text-txt-inverse hover:bg-accent-hover active:scale-95',
    ghost: 'bg-transparent text-txt-secondary border border-bg-border hover:bg-bg-elevated hover:text-txt-primary',
    danger: 'bg-danger/10 text-danger border border-danger/20 hover:bg-danger/20 active:scale-95',
    success: 'bg-success/10 text-success border border-success/20 hover:bg-success/20 active:scale-95',
    subtle: 'bg-bg-elevated text-txt-secondary hover:bg-bg-hover hover:text-txt-primary',
  }
  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-sm gap-2',
  }
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center rounded-lg font-medium transition-all duration-150 cursor-pointer select-none',
        'disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {loading ? <Spinner size="sm" /> : icon}
      {children}
    </button>
  )
}
