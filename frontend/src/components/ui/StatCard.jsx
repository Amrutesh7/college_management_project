import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '../../utils/helpers'
import Spinner from './Spinner'

export default function StatCard({ title, value, subtitle, icon: Icon, iconColor = 'text-accent', iconBg = 'bg-accent/10', trend, trendLabel, loading }) {
  return (
    <div className="stat-card group">
      <div className="flex items-start justify-between mb-4">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', iconBg)}>
          {Icon && <Icon size={18} className={iconColor} />}
        </div>
        {trend !== undefined && (
          <div className={cn(
            'flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg',
            trend >= 0 ? 'text-success bg-success/10' : 'text-danger bg-danger/10',
          )}>
            {trend >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>

      {loading ? (
        <div className="space-y-2">
          <div className="h-7 w-24 bg-bg-elevated rounded animate-pulse" />
          <div className="h-3 w-32 bg-bg-elevated rounded animate-pulse" />
        </div>
      ) : (
        <>
          <p className="font-display text-2xl font-bold text-txt-primary tracking-tight mb-0.5">{value ?? '—'}</p>
          <p className="text-xs text-txt-muted font-medium">{title}</p>
          {subtitle && <p className="text-xs text-txt-muted mt-2 pt-2 border-t border-bg-border">{subtitle}</p>}
          {trendLabel && <p className="text-xs text-txt-muted mt-1">{trendLabel}</p>}
        </>
      )}
    </div>
  )
}
