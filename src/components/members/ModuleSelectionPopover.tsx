import { useState, useEffect, useMemo, useCallback } from 'react'
import { Button } from '../ui/Button'
import { Checkbox } from '../ui/Checkbox'
import { Dropdown } from '../ui/Dropdown'
import { useToast } from '../ui/Toast'
import { useAccess } from '../../store/accessStore'
import { useModuleState } from '../../store/moduleState'
import { IconTimeOff } from '../icons'

type CheckState = boolean | 'indeterminate'

const pluralUser = (n: number) => (n !== 1 ? 'users' : 'user')
const pluralSeat = (n: number) => (n !== 1 ? 'seats' : 'seat')

export const ModuleSelectionPopover = ({ selectedUserIds }: { selectedUserIds: Set<number> }) => {
  const { getAccess, setBulkAccess, usedSeats, totalSeats } = useAccess()
  const { state: moduleState } = useModuleState()
  const { showToast } = useToast()

  const [open, setOpen] = useState(false)
  const [checkState, setCheckState] = useState<CheckState>(true)
  const [usersWithAccess, setUsersWithAccess] = useState(0)
  const [initialState, setInitialState] = useState<CheckState>(true)

  const selectedIds = useMemo(() => Array.from(selectedUserIds), [selectedUserIds])

  useEffect(() => {
    if (!open) return
    const withAccess = selectedIds.filter(id => getAccess(id))
    const allHave = withAccess.length === selectedIds.length
    const noneHave = withAccess.length === 0

    setUsersWithAccess(withAccess.length)

    let state: CheckState
    if (allHave) state = true
    else if (noneHave) state = false
    else state = 'indeterminate'

    setCheckState(state)
    setInitialState(state)
  }, [open, selectedIds, getAccess])

  const isTrial = moduleState.status === 'trial-active'
  const isPaid = moduleState.status === 'active'

  const isIndeterminate = checkState === 'indeterminate'
  const isChecked = checkState === true

  const usersGaining = useMemo(
    () => isChecked ? selectedIds.filter(id => !getAccess(id)).length : 0,
    [isChecked, selectedIds, getAccess]
  )

  const usersLosing = useMemo(
    () => checkState === false ? selectedIds.filter(id => getAccess(id)).length : 0,
    [checkState, selectedIds, getAccess]
  )

  const hasChanges = checkState !== initialState && !isIndeterminate
  const projectedSeats = usedSeats + usersGaining - usersLosing

  const exceedsSeats = projectedSeats > totalSeats

  const message = useMemo(() => {
    if (isIndeterminate) {
      return `${usersWithAccess} out of ${selectedIds.length} ${pluralUser(selectedIds.length)} have access to Time Off`
    }
    if (!hasChanges) return null

    if (isChecked && usersGaining > 0) {
      const base = `${usersGaining} ${pluralUser(usersGaining)} will gain access to Time Off after you save`
      if (isTrial) return base
      if (isPaid) {
        const seatInfo = `${projectedSeats}/${totalSeats} seats used`
        if (exceedsSeats) {
          return `${base}. This will increase your seat count \u2022 ${seatInfo}`
        }
        return `${base} \u2022 ${seatInfo}`
      }
    }

    if (checkState === false && usersLosing > 0) {
      const base = `${usersLosing} ${pluralUser(usersLosing)} will lose access to Time Off after you save`
      if (isTrial) return base
      if (isPaid) return `${base}. This will free up ${usersLosing} ${pluralSeat(usersLosing)} \u2022 ${projectedSeats}/${totalSeats} seats used`
    }
    return null
  }, [isIndeterminate, usersWithAccess, selectedIds.length, hasChanges, isChecked, checkState, usersGaining, usersLosing, isTrial, isPaid, projectedSeats, totalSeats, exceedsSeats])

  const handleToggle = useCallback(() => {
    setCheckState(prev => prev === 'indeterminate' ? false : !prev)
  }, [])

  const handleSave = useCallback(() => {
    if (isIndeterminate) return
    setBulkAccess(selectedIds, isChecked)
    const count = isChecked ? usersGaining : usersLosing
    const action = isChecked ? 'granted' : 'removed'
    showToast({ content: `Time Off access ${action} for ${count} ${pluralUser(count)}.` })
    setOpen(false)
  }, [isIndeterminate, selectedIds, isChecked, setBulkAccess, usersGaining, usersLosing, showToast])

  return (
    <Dropdown
      trigger={
        <Button variant="secondary">
          <IconTimeOff size={14} className="text-content-secondary" />
          Modules
        </Button>
      }
      open={open}
      onOpenChange={setOpen}
      width="320px"
    >
      <div>
        <div className="flex justify-between items-center px-3 py-2">
          <span className="text-h6 font-semibold text-content-secondary uppercase">Modules</span>
          <div className="flex gap-2">
            <Button variant="lowkey" onClick={(e) => { e.stopPropagation(); setCheckState(true) }}>ALL</Button>
            <Button variant="lowkey" onClick={(e) => { e.stopPropagation(); setCheckState(false) }}>NONE</Button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleToggle}
          className="w-full flex items-center gap-3 px-3 py-2 hover:bg-surface-secondary transition-colors"
        >
          <Checkbox checked={isIndeterminate ? 'indeterminate' : isChecked} aria-label="Toggle Time Off" />
          <div className="flex size-6 items-center justify-center rounded-lg bg-surface-tertiary shrink-0">
            <IconTimeOff size={14} className="text-content-secondary" />
          </div>
          <span className="flex-1 truncate text-p1 text-content text-left">Time Off</span>
        </button>

        {message && (
          <>
            <div className="mx-3 border-t border-edge" />
            <p className={`text-p2 px-3 py-2 ${exceedsSeats && isChecked ? 'text-warning' : 'text-content-secondary'}`}>{message}</p>
          </>
        )}

        <div className="p-3 flex justify-end border-t border-edge-secondary">
          <Button onClick={handleSave} disabled={!hasChanges}>Save</Button>
        </div>
      </div>
    </Dropdown>
  )
}
