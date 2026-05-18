import { Inbox } from 'lucide-react'

export default function EmptyState({ title = 'No data found', subtitle = '', icon: Icon = Inbox, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-14 h-14 rounded-2xl bg-bg-elevated flex items-center justify-center mb-4">
        <Icon size={24} className="text-txt-muted" />
      </div>
      <p className="font-medium text-txt-primary mb-1">{title}</p>
      {subtitle && <p className="text-sm text-txt-muted mb-4">{subtitle}</p>}
      {action}
    </div>
  )
}
