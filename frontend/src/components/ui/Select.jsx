import { cn } from '../../utils/helpers'

export default function Select({ label, error, options = [], containerClass = '', className = '', ...props }) {
  return (
    <div className={cn('space-y-1.5', containerClass)}>
      {label && <label className="form-label">{label}</label>}
      <select
        className={cn(
          'form-input appearance-none cursor-pointer',
          error && 'border-danger/50',
          className,
        )}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value} className="bg-bg-surface">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-danger mt-1">{error}</p>}
    </div>
  )
}
