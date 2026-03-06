import { useState } from 'react'
import { Button } from '../ui/Button'
import { Dialog } from '../ui/Dialog'
import { Switch } from '../ui/Switch'
import { useToast } from '../ui/Toast'
import { useAccess } from '../../store/accessStore'
import { useModuleState } from '../../store/moduleState'
import { IconTimeOff } from '../icons'
import type { Member } from '../../data/members'

interface Props {
  user: Member
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const EditUserDialog = ({ user, open, onOpenChange }: Props) => {
  const { getAccess, setAccess, usedSeats, totalSeats } = useAccess()
  const { state: moduleState } = useModuleState()
  const { showToast } = useToast()

  const initialEnabled = getAccess(user.id)
  const [enabled, setEnabled] = useState(initialEnabled)

  const isTrial = moduleState.status === 'trial-active'
  const isPaid = moduleState.status === 'active'
  const isModuleVisible = isTrial || isPaid

  const hasChanged = enabled !== initialEnabled
  const firstName = user.name.split(' ')[0]

  const getMessage = (): string | null => {
    if (!hasChanged) return null
    if (!enabled && isTrial) return `${firstName} will lose access to Time Off after you save.`
    if (!enabled && isPaid) return `${firstName} will lose access to Time Off after you save. This will free up 1 seat \u2022 ${usedSeats}/${totalSeats} seats used`
    if (enabled && isPaid) return `${firstName} will gain access to Time Off after you save. This will increase your seat count \u2022 ${usedSeats}/${totalSeats} seats used`
    if (enabled && isTrial) return `${firstName} will gain access to Time Off after you save.`
    return null
  }

  const handleSave = () => {
    if (hasChanged) {
      setAccess(user.id, enabled)
      const action = enabled ? 'granted' : 'removed'
      showToast({ content: `Time Off access ${action} for ${user.name}.` })
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} title="Edit user" width={480}>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-accent flex items-center justify-center text-on-accent font-semibold text-h5">
            {user.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <p className="text-p1 font-medium text-primary">{user.name}</p>
            <p className="text-p2 text-secondary">{user.email}</p>
          </div>
        </div>

        {isModuleVisible && (
          <div className="flex flex-col gap-4">
            <h3 className="text-h5 font-semibold text-primary">Modules</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-lg bg-tertiary">
                  <IconTimeOff size={16} className="text-secondary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-p1 text-primary">Time Off</span>
                  {isTrial && <span className="text-p2 text-secondary">Trial</span>}
                </div>
              </div>
              <Switch checked={enabled} onCheckedChange={setEnabled} />
            </div>
            {getMessage() && <p className="text-p2 text-secondary">{getMessage()}</p>}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button variant="secondary" className="flex-1" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button className="flex-1" onClick={handleSave}>Save</Button>
        </div>
      </div>
    </Dialog>
  )
}
