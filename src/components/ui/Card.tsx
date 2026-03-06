import type { ReactNode } from 'react'

export const Card = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <div className={`bg-surface rounded-xl border border-edge p-6 ${className}`}>
    {children}
  </div>
)
