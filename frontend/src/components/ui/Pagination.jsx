import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../utils/helpers'

export default function Pagination({ page, totalPages, onPrev, onNext, onGoTo, total, pageSize }) {
  if (totalPages <= 1) return null
  const start = (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total)

  const pages = []
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...')
    }
  }

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-bg-border">
      <p className="text-xs text-txt-muted">
        Showing <span className="text-txt-secondary font-medium">{start}–{end}</span> of{' '}
        <span className="text-txt-secondary font-medium">{total}</span> results
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={onPrev}
          disabled={page === 1}
          className="p-1.5 rounded-lg text-txt-muted hover:text-txt-primary hover:bg-bg-elevated
                     disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft size={16} />
        </button>
        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`ellipsis-${i}`} className="px-2 text-txt-muted text-sm">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onGoTo(p)}
              className={cn(
                'w-7 h-7 rounded-lg text-xs font-medium transition-all',
                page === p
                  ? 'bg-accent text-txt-inverse'
                  : 'text-txt-muted hover:text-txt-primary hover:bg-bg-elevated',
              )}
            >
              {p}
            </button>
          ),
        )}
        <button
          onClick={onNext}
          disabled={page === totalPages}
          className="p-1.5 rounded-lg text-txt-muted hover:text-txt-primary hover:bg-bg-elevated
                     disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
