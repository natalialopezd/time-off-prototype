import { useState, useRef, useEffect } from 'react'
import { IconThreeDots } from '../icons'

interface MenuItem {
  label: string
  onClick?: () => void
  destructive?: boolean
}

export const ThreeDotsMenu = ({ items }: { items: MenuItem[] }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open) }}
        className="p-1 rounded hover:bg-surface-secondary transition-colors"
      >
        <IconThreeDots size={16} className="text-content-secondary" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 bg-surface rounded-lg shadow-xl border border-edge min-w-[180px] py-1">
          {items.map(item => (
            <button
              key={item.label}
              onClick={() => { item.onClick?.(); setOpen(false) }}
              className={`w-full text-left px-3 py-2 text-p1 hover:bg-surface-secondary transition-colors ${
                item.destructive ? 'text-destructive' : 'text-content'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
