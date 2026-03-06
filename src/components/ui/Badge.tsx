import type { ReactNode } from 'react'

type BadgeVariant = 'success' | 'warning' | 'passive' | 'default'

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-badge-success-bg text-badge-success-text',
  warning: 'bg-badge-warning-bg text-badge-warning-text',
  passive: 'bg-badge-passive-bg text-badge-passive-text',
  default: 'bg-badge-default-bg text-badge-default-text',
}

export const Badge = ({ variant = 'default', children }: { variant?: BadgeVariant; children: ReactNode }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-p2 font-medium ${variantStyles[variant]}`}>
    {children}
  </span>
)
