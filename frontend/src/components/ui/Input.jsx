import { cn } from '../../utils/helpers'

export default function Input({
  label,
  error,
  icon,
  className = '',
  containerClass = '',
  ...props
}) {
  return (
    <div className={cn('space-y-1.5', containerClass)}>
      {label && <label className="form-label">{label}</label>}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-txt-muted">
            {icon}
          </span>
        )}
        <input
          className={cn(
            'form-input',
            icon && 'pl-9',
            error && 'border-danger/50 focus:border-danger/70 focus:ring-danger/20',
            className,
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-danger mt-1">{error}</p>}
    </div>
  )
}
