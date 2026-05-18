import { useState, useMemo } from 'react'

export function useSearch(items = [], searchKeys = []) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!query.trim()) return items
    const q = query.toLowerCase()
    return items.filter(item =>
      searchKeys.some(key => {
        const val = key.split('.').reduce((o, k) => o?.[k], item)
        return String(val ?? '').toLowerCase().includes(q)
      }),
    )
  }, [items, query, searchKeys])

  return { query, setQuery, filtered }
}
