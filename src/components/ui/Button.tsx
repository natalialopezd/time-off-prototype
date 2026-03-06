import { type ButtonHTMLAttributes, forwardRef } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'destructive' | 'lowkey'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  loading?: boolean
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-on-accent hover:bg-accent-hover',
  secondary: 'bg-surface-secondary text-content border border-edge hover:bg-surface-tertiary',
  tertiary: 'text-content-secondary hover:text-content hover:bg-surface-secondary',
  destructive: 'bg-destructive text-on-accent hover:bg-destructive-hover',
  lowkey: 'text-accent hover:underline text-p2 font-semibold px-0 py-0',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', loading, disabled, children, className = '', ...props }, ref) => {
    const base = variant === 'lowkey'
      ? ''
      : 'px-4 py-2 rounded-lg text-p1 font-medium transition-colors'
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`${base} ${variantStyles[variant]} disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 ${className}`}
        {...props}
      >
        {loading && (
          <svg className="animate-spin size-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        )}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
