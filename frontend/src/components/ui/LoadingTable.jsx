export default function LoadingTable({ rows = 8, cols = 6 }) {
  return (
    <div className="animate-pulse">
      <div className="border-b border-bg-border px-4 py-3 flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-3 bg-bg-elevated rounded flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="border-b border-bg-border/50 px-4 py-4 flex items-center gap-4">
          {Array.from({ length: cols }).map((_, c) => (
            <div
              key={c}
              className="h-3.5 bg-bg-elevated rounded flex-1"
              style={{ opacity: 1 - c * 0.08 }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
