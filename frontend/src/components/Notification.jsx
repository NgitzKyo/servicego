import { createContext, useCallback, useContext, useState } from 'react'

const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const notify = useCallback((message, type = 'info') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500)
  }, [])

  const COLOR = { success: 'bg-green-600', error: 'bg-red-600', info: 'bg-blue-600' }

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <div className="fixed top-5 right-5 z-[100] flex flex-col gap-2">
        {toasts.map(t => (
          <div key={t.id} className={`rounded-xl px-4 py-3 text-sm text-white shadow-lg ${COLOR[t.type] || COLOR.info} max-w-xs`}>
            {t.message}
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  )
}

export const useNotification = () => useContext(NotificationContext)
