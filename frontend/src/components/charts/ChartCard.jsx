import Card from '../ui/Card'
import Spinner from '../ui/Spinner'

export default function ChartCard({ title, subtitle, children, loading, action, className = '' }) {
  return (
    <Card className={className} padding={false}>
      <div className="px-5 pt-5 pb-4 flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold text-txt-primary">{title}</h3>
          {subtitle && <p className="text-xs text-txt-muted mt-0.5">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="px-2 pb-4">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Spinner size="md" className="text-accent" />
          </div>
        ) : (
          children
        )}
      </div>
    </Card>
  )
}
