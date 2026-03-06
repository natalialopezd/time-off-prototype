type CheckboxProps = {
  checked: boolean | 'indeterminate'
  onChange?: (checked: boolean) => void
  disabled?: boolean
  'aria-label'?: string
}

export const Checkbox = ({ checked, onChange, disabled, ...props }: CheckboxProps) => {
  const isIndeterminate = checked === 'indeterminate'
  const isChecked = checked === true

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={isIndeterminate ? 'mixed' : isChecked}
      aria-label={props['aria-label']}
      disabled={disabled}
      onClick={() => onChange?.(!isChecked)}
      className={`size-5 rounded border-2 flex items-center justify-center transition-colors shrink-0 ${
        isChecked || isIndeterminate
          ? 'bg-accent border-accent text-on-accent'
          : 'border-tertiary bg-primary hover:border-secondary'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {isChecked && (
        <svg className="size-3" viewBox="0 0 12 12" fill="none">
          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {isIndeterminate && (
        <svg className="size-3" viewBox="0 0 12 12" fill="none">
          <path d="M2 6h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}
    </button>
  )
}
