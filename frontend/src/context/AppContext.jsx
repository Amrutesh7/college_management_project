import { createContext, useContext, useState } from 'react'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [notifications] = useState(3)

  const toggleSidebar = () => setSidebarCollapsed(prev => !prev)

  return (
    <AppContext.Provider value={{ sidebarCollapsed, toggleSidebar, notifications }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
