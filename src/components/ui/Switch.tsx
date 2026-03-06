type SwitchProps = {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

export const Switch = ({ checked, onCheckedChange }: SwitchProps) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onCheckedChange(!checked)}
    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors ${
      checked ? 'bg-accent' : 'bg-surface-tertiary'
    }`}
  >
    <span
      className={`pointer-events-none inline-block size-5 rounded-full bg-white shadow-md transform transition-transform ${
        checked ? 'translate-x-[22px]' : 'translate-x-[2px]'
      } mt-[2px]`}
    />
  </button>
)
