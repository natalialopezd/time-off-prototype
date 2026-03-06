import { useEffect, useRef, type ReactNode } from 'react'

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children: ReactNode
  width?: number
}

export const Dialog = ({ open, onOpenChange, title, children, width = 480 }: DialogProps) => {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) onOpenChange(false)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onOpenChange])

  if (!open) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-overlay"
      onClick={(e) => { if (e.target === overlayRef.current) onOpenChange(false) }}
    >
      <div
        className="bg-surface rounded-xl shadow-xl max-h-[90vh] overflow-y-auto"
        style={{ width: `${width}px`, maxWidth: 'calc(100vw - 32px)' }}
      >
        <div className="p-6 flex flex-col gap-5">
          <h2 className="text-h3 font-semibold text-content">{title}</h2>
          {children}
        </div>
      </div>
    </div>
  )
}
