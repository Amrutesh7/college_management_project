import { cn } from '../../utils/helpers'

export default function Card({ children, className = '', padding = true, hover = false }) {
  return (
    <div className={cn(
      'bg-bg-card border border-bg-border rounded-xl shadow-card',
      padding && 'p-5',
      hover && 'transition-all duration-200 hover:shadow-card-hover hover:border-bg-hover',
      className,
    )}>
      {children}
    </div>
  )
}
