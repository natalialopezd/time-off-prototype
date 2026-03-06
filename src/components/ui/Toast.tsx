import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'

interface ToastData {
  id: number
  content: string
  type: 'success' | 'error'
}

interface ToastContextValue {
  showToast: (opts: { content: string; type?: 'success' | 'error' }) => void
}

const ToastContext = createContext<ToastContextValue>({ showToast: () => {} })

export const useToast = () => useContext(ToastContext)

let nextId = 0

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastData[]>([])

  const showToast = useCallback(({ content, type = 'success' }: { content: string; type?: 'success' | 'error' }) => {
    const id = nextId++
    setToasts(prev => [...prev, { id, content, type }])
  }, [])

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

const ToastItem = ({ toast, onRemove }: { toast: ToastData; onRemove: (id: number) => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), 4000)
    return () => clearTimeout(timer)
  }, [toast.id, onRemove])

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-p1 animate-slide-in ${
      toast.type === 'success' ? 'bg-accent text-on-accent' : 'bg-destructive text-on-accent'
    }`}>
      {toast.type === 'success' && (
        <svg className="size-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      )}
      {toast.content}
    </div>
  )
}
