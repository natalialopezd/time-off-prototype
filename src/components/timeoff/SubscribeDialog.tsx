import { useMemo, useState } from 'react'
import { Button } from '../ui/Button'
import { Dialog } from '../ui/Dialog'
import { Checkbox } from '../ui/Checkbox'
import { MEMBERS, GROUPS } from '../../data/members'
import { SUBSCRIPTION, formatCurrency } from '../../data/subscription'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

function SubscriptionImpact({ memberCount }: { memberCount: number }) {
  const { currentYearly, modulePricePerUserMonthly, renewalDate, daysRemainingInPeriod } = SUBSCRIPTION
  const timeOffYearly = memberCount * modulePricePerUserMonthly * 12
  const newTotal = currentYearly + timeOffYearly
  const prorated = Math.round(((timeOffYearly / 365) * daysRemainingInPeriod + Number.EPSILON) * 100) / 100

  return (
    <div className="flex flex-col gap-3 rounded-lg bg-secondary p-4">
      <p className="text-p2 font-semibold uppercase text-secondary">Subscription impact</p>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-p1 text-primary">Current subscription</span>
          <span className="text-p1 text-primary">{formatCurrency(currentYearly)}/year</span>
        </div>
        <div className="flex items-start justify-between">
          <span className="text-p1 text-primary">
            Time Off ({memberCount} member{memberCount !== 1 ? 's' : ''})
          </span>
          <div className="flex flex-col items-end">
            <span className="text-p1 text-primary">${modulePricePerUserMonthly}/user/month</span>
            <span className="text-p2 text-secondary">Billed annually: {formatCurrency(timeOffYearly)}</span>
          </div>
        </div>
      </div>
      <div className="border-t border-secondary" />
      <div className="flex items-center justify-between">
        <span className="text-p1 text-primary">New Total at renewal</span>
        <span className="text-p1 text-primary">{formatCurrency(newTotal)}/year</span>
      </div>
      <div className="border-t border-dashed border-secondary" />
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-p1 font-semibold text-primary">Charged today</span>
          <span className="text-p1 font-semibold text-primary">
            ${prorated.toFixed(2)} (prorated until {renewalDate})
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-p1 text-secondary">Renews on</span>
          <span className="text-p1 text-secondary">{renewalDate}</span>
        </div>
      </div>
    </div>
  )
}

function MemberGroupDropdown({
  selectedIds,
  onSelectedIdsChange,
}: {
  selectedIds: Set<number>
  onSelectedIdsChange: (ids: Set<number>) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')

  const groups = useMemo(() => {
    const groupMap = [
      { name: GROUPS.engineering.name, members: MEMBERS.filter(m => m.groups.some(g => g.id === GROUPS.engineering.id)) },
      { name: GROUPS.design.name, members: MEMBERS.filter(m => m.groups.some(g => g.id === GROUPS.design.id)) },
      { name: GROUPS.marketing.name, members: MEMBERS.filter(m => m.groups.some(g => g.id === GROUPS.marketing.id)) },
    ]
    if (search) {
      return groupMap.map(g => ({
        ...g,
        members: g.members.filter(m => m.name.toLowerCase().includes(search.toLowerCase())),
      })).filter(g => g.members.length > 0)
    }
    return groupMap
  }, [search])

  const toggleMember = (id: number) => {
    const next = new Set(selectedIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    onSelectedIdsChange(next)
  }

  const selectGroupAll = (members: typeof MEMBERS) => {
    const next = new Set(selectedIds)
    members.forEach(m => next.add(m.id))
    onSelectedIdsChange(next)
  }

  const selectGroupNone = (members: typeof MEMBERS) => {
    const next = new Set(selectedIds)
    members.forEach(m => next.delete(m.id))
    onSelectedIdsChange(next)
  }

  const label = selectedIds.size === 0
    ? 'Select members'
    : selectedIds.size === 1
      ? '1 member selected'
      : `${selectedIds.size} members selected`

  return (
    <div className="flex flex-col gap-1">
      <label className="text-p2 font-semibold uppercase text-secondary">Members</label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-primary bg-primary text-p1 text-left hover:border-accent transition-colors"
        >
          <span className={selectedIds.size === 0 ? 'text-tertiary' : 'text-primary'}>{label}</span>
          <svg className={`size-4 text-secondary transition-transform ${isOpen ? 'rotate-180' : ''}`} viewBox="0 0 16 16" fill="none">
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {isOpen && (
          <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-primary rounded-lg shadow-xl border border-primary max-h-[280px] overflow-y-auto">
            <div className="p-2 sticky top-0 bg-primary border-b border-secondary">
              <input
                type="text"
                placeholder="Find members..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full px-3 py-1.5 rounded bg-secondary text-p1 text-primary outline-none placeholder:text-tertiary"
                autoFocus
              />
            </div>
            {groups.map(group => (
              <div key={group.name}>
                <div className="flex items-center justify-between px-3 py-1.5 bg-secondary">
                  <span className="text-p2 font-semibold text-secondary">{group.name}</span>
                  <span className="flex gap-2">
                    <button type="button" className="text-accent text-p2 font-semibold hover:underline" onPointerDown={e => { e.preventDefault(); e.stopPropagation(); selectGroupAll(group.members) }}>ALL</button>
                    <button type="button" className="text-accent text-p2 font-semibold hover:underline" onPointerDown={e => { e.preventDefault(); e.stopPropagation(); selectGroupNone(group.members) }}>NONE</button>
                  </span>
                </div>
                {group.members.map(m => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => toggleMember(m.id)}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-secondary transition-colors text-left"
                  >
                    <Checkbox checked={selectedIds.has(m.id)} />
                    <span className="text-p1 text-primary">{m.name}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export const SubscribeDialog = ({ open, onOpenChange, onConfirm }: Props) => {
  const [accessOption, setAccessOption] = useState('all-members')
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [isProcessing, setIsProcessing] = useState(false)

  const activeMemberCount = accessOption === 'all-members' ? MEMBERS.length : selectedIds.size

  return (
    <Dialog open={open} onOpenChange={onOpenChange} title="Who should keep access to Time Off?" width={520}>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-4">
          <p className="text-p1 text-primary">You can change this anytime from the Members page:</p>

          <div className="flex flex-col gap-3">
            <label
              className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                accessOption === 'all-members' ? 'border-accent bg-muted' : 'border-primary hover:border-secondary'
              }`}
              onClick={() => setAccessOption('all-members')}
            >
              <div className={`mt-0.5 size-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                accessOption === 'all-members' ? 'border-accent' : 'border-tertiary'
              }`}>
                {accessOption === 'all-members' && <div className="size-2.5 rounded-full bg-accent" />}
              </div>
              <div>
                <p className="text-p1 font-medium text-primary">Give access to everyone</p>
                <p className="text-p2 text-secondary">{MEMBERS.length} members</p>
              </div>
            </label>

            <label
              className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                accessOption === 'specific-members' ? 'border-accent bg-muted' : 'border-primary hover:border-secondary'
              }`}
              onClick={() => setAccessOption('specific-members')}
            >
              <div className={`mt-0.5 size-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                accessOption === 'specific-members' ? 'border-accent' : 'border-tertiary'
              }`}>
                {accessOption === 'specific-members' && <div className="size-2.5 rounded-full bg-accent" />}
              </div>
              <div>
                <p className="text-p1 font-medium text-primary">Select specific members</p>
                <p className="text-p2 text-secondary">Start with a smaller group and expand anytime.</p>
              </div>
            </label>
          </div>

          {accessOption === 'specific-members' && (
            <MemberGroupDropdown selectedIds={selectedIds} onSelectedIdsChange={setSelectedIds} />
          )}
        </div>

        <SubscriptionImpact memberCount={activeMemberCount} />

        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" disabled={isProcessing} onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button className="flex-1" loading={isProcessing} onClick={() => {
            setIsProcessing(true)
            setTimeout(() => { setIsProcessing(false); onConfirm() }, 1500)
          }}>
            {isProcessing ? 'Processing...' : 'Subscribe'}
          </Button>
        </div>
      </div>
    </Dialog>
  )
}
