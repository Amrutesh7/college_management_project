import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function ErrorBanner({ message, onRetry }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-danger/5 border border-danger/20 rounded-xl">
      <div className="w-9 h-9 rounded-lg bg-danger/10 flex items-center justify-center shrink-0">
        <AlertTriangle size={18} className="text-danger" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-txt-primary">Something went wrong</p>
        <p className="text-xs text-txt-muted mt-0.5 truncate">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                     text-danger border border-danger/20 hover:bg-danger/10 transition-all shrink-0"
        >
          <RefreshCw size={12} /> Retry
        </button>
      )}
    </div>
  )
}
