import { useRef, useEffect, useState, type ReactNode } from 'react'

interface DropdownProps {
  trigger: ReactNode
  children: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  width?: string
}

export const Dropdown = ({ trigger, children, open: controlledOpen, onOpenChange, width = '320px' }: DropdownProps) => {
  const [internalOpen, setInternalOpen] = useState(false)
  const isOpen = controlledOpen ?? internalOpen
  const setIsOpen = onOpenChange ?? setInternalOpen
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [isOpen, setIsOpen])

  return (
    <div ref={ref} className="relative inline-block">
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div
          className="absolute right-0 top-full mt-2 z-50 bg-surface rounded-lg shadow-xl border border-edge overflow-hidden"
          style={{ width }}
        >
          {children}
        </div>
      )}
    </div>
  )
}
