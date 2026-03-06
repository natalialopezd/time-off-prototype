import { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from '../ui/Button'
import { Switch } from '../ui/Switch'
import { useToast } from '../ui/Toast'
import { useAccess } from '../../store/accessStore'
import { useModuleState } from '../../store/moduleState'
import { IconTimeOff, IconUsers, IconKey, IconTeam, IconAllTools, IconDollar, IconClock, IconClose, TrackLogo, FocusLogo, WorkLogo } from '../icons'
import { TEAMS, type Member } from '../../data/members'

interface Props {
  user: Member
  open: boolean
  onOpenChange: (open: boolean) => void
}

const SECTION_IDS = ['personal', 'access', 'teams', 'modules', 'billable', 'workhours', 'laborcost'] as const
type SectionId = typeof SECTION_IDS[number]

interface NavItem {
  id: SectionId
  label: string
  icon: React.ReactNode
  requiresModule?: boolean
}

const ALL_TOOLS_NAV: NavItem[] = [
  { id: 'personal', label: 'Personal details', icon: <IconUsers size={14} className="text-content-secondary" /> },
  { id: 'access', label: 'Access & collaboration', icon: <IconKey size={14} className="text-content-secondary" /> },
  { id: 'teams', label: 'Teams', icon: <IconTeam size={14} className="text-content-secondary" /> },
  { id: 'modules', label: 'Modules', icon: <IconAllTools size={14} className="text-content-secondary" />, requiresModule: true },
]

const TRACK_NAV: NavItem[] = [
  { id: 'billable', label: 'Billable rate', icon: <IconDollar size={14} className="text-content-secondary" /> },
  { id: 'workhours', label: 'Work hours', icon: <IconClock size={14} className="text-content-secondary" /> },
  { id: 'laborcost', label: 'Labor cost', icon: <IconDollar size={14} className="text-content-secondary" /> },
]

const Avatar = ({ name, size = 80 }: { name: string; size?: number }) => {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2)
  return (
    <div
      className="rounded-full bg-accent text-on-accent flex items-center justify-center font-semibold shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.3 }}
    >
      {initials}
    </div>
  )
}

export const EditUserDialog = ({ user, open, onOpenChange }: Props) => {
  const { getAccess, setAccess, usedSeats, totalSeats } = useAccess()
  const { state: moduleState } = useModuleState()
  const { showToast } = useToast()

  const overlayRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const initialEnabled = getAccess(user.id)
  const [enabled, setEnabled] = useState(initialEnabled)
  const [activeSection, setActiveSection] = useState<SectionId>('personal')

  const isTrial = moduleState.status === 'trial-active'
  const isPaid = moduleState.status === 'active'
  const isModuleVisible = isTrial || isPaid

  const hasChanged = enabled !== initialEnabled
  const firstName = user.name.split(' ')[0]

  const userTeams = TEAMS.filter(t => t.memberIds.includes(user.id))

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) onOpenChange(false)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onOpenChange])

  useEffect(() => {
    setEnabled(getAccess(user.id))
  }, [user.id, getAccess])

  const handleScrollToSection = useCallback((id: SectionId) => {
    const el = sectionRefs.current[id]
    const container = contentRef.current
    if (el && container) {
      const containerRect = container.getBoundingClientRect()
      const elRect = el.getBoundingClientRect()
      const scrollTop = container.scrollTop + (elRect.top - containerRect.top) - 16
      container.scrollTo({ top: scrollTop, behavior: 'smooth' })
    }
    setActiveSection(id)
  }, [])

  useEffect(() => {
    const container = contentRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.getAttribute('data-section') as SectionId)
          }
        }
      },
      { root: container, rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    )

    for (const id of SECTION_IDS) {
      const el = sectionRefs.current[id]
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [open, isModuleVisible])

  const getMessage = (): string | null => {
    if (!hasChanged) return null
    if (!enabled && isTrial) return `${firstName} will lose access to Time Off after you save.`
    if (!enabled && isPaid) return `${firstName} will lose access to Time Off after you save. This will free up 1 seat \u2022 ${usedSeats - 1}/${totalSeats} seats used`
    if (enabled && isPaid) return `${firstName} will gain access to Time Off after you save. This will increase your seat count \u2022 ${usedSeats + 1}/${totalSeats} seats used`
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

  if (!open) return null

  const navItems = ALL_TOOLS_NAV.filter(item => !item.requiresModule || isModuleVisible)

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-overlay"
      onClick={(e) => { if (e.target === overlayRef.current) onOpenChange(false) }}
    >
      <div
        className="bg-surface rounded-xl shadow-xl flex flex-col"
        style={{ width: 960, maxWidth: 'calc(100vw - 64px)', height: '80vh', maxHeight: 700 }}
      >
        {/* Two-panel body */}
        <div className="flex flex-1 min-h-0">
          {/* Left navigation panel */}
          <div className="w-[240px] shrink-0 bg-surface-secondary rounded-l-xl border-r border-edge flex flex-col overflow-y-auto">
            {/* User info */}
            <div className="p-4 flex flex-col items-center gap-2 border-b border-edge">
              <Avatar name={user.name} size={64} />
              <div className="text-center">
                <p className="text-p1 font-medium text-content truncate max-w-[168px]">{user.name}</p>
                <p className="text-p2 text-content-secondary truncate max-w-[168px]">{user.email}</p>
              </div>
            </div>

            {/* All Toggl Tools group */}
            <div className="px-3 pt-4 pb-1">
              <div className="flex items-center gap-2 px-2 mb-1">
                <IconAllTools size={12} className="text-content-tertiary" />
                <span className="text-p2 font-semibold text-content-tertiary uppercase tracking-wide">All Toggl Tools</span>
              </div>
              {navItems.map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleScrollToSection(item.id)}
                  className={`w-full text-left px-2 py-1.5 rounded-md text-p2 transition-colors flex items-center gap-2 ${
                    activeSection === item.id
                      ? 'bg-surface text-content font-medium'
                      : 'text-content-secondary hover:text-content hover:bg-surface'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>

            {/* Toggl Track group */}
            <div className="px-3 pt-3 pb-3">
              <div className="flex items-center gap-2 px-2 mb-1">
                <TrackLogo size={14} />
                <span className="text-p2 font-semibold text-content-tertiary uppercase tracking-wide">Toggl Track</span>
              </div>
              {TRACK_NAV.map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleScrollToSection(item.id)}
                  className={`w-full text-left px-2 py-1.5 rounded-md text-p2 transition-colors flex items-center gap-2 ${
                    activeSection === item.id
                      ? 'bg-surface text-content font-medium'
                      : 'text-content-secondary hover:text-content hover:bg-surface'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right content panel */}
          <div ref={contentRef} className="flex-1 overflow-y-auto">
            <div className="p-6 flex flex-col gap-8">
              {/* Close button */}
              <div className="flex justify-between items-center">
                <h2 className="text-h3 font-semibold text-content">Edit user</h2>
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="p-1 rounded-md hover:bg-surface-secondary transition-colors text-content-secondary hover:text-content"
                >
                  <IconClose size={16} />
                </button>
              </div>

              {/* Personal details */}
              <div
                ref={el => { sectionRefs.current.personal = el }}
                data-section="personal"
              >
                <h3 className="text-h5 font-semibold text-content mb-1">Personal details</h3>
                <p className="text-p2 text-content-secondary mb-4">View and edit member information</p>

                <div className="flex flex-col gap-3">
                  <div>
                    <label className="text-p2 font-medium text-content-secondary block mb-1">Name</label>
                    <input
                      type="text"
                      value={user.name}
                      readOnly
                      className="w-full px-3 py-2 rounded-lg border border-edge bg-surface-secondary text-p1 text-content cursor-default"
                    />
                  </div>
                  <div>
                    <label className="text-p2 font-medium text-content-secondary block mb-1">Email</label>
                    <input
                      type="text"
                      value={user.email}
                      readOnly
                      className="w-full px-3 py-2 rounded-lg border border-edge bg-surface-secondary text-p1 text-content-secondary cursor-default"
                    />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-p1 text-content">Organization admin</p>
                      <p className="text-p2 text-content-secondary">Grant admin access to this organization</p>
                    </div>
                    <Switch checked={user.admin} onCheckedChange={() => {}} />
                  </div>
                </div>
              </div>

              <div className="border-t border-edge-secondary" />

              {/* Access & collaboration */}
              <div
                ref={el => { sectionRefs.current.access = el }}
                data-section="access"
              >
                <h3 className="text-h5 font-semibold text-content mb-1">Access & collaboration</h3>
                <p className="text-p2 text-content-secondary mb-4">Manage roles across Toggl tools</p>

                <div className="rounded-lg border border-edge overflow-hidden">
                  <div className="px-4 py-3 bg-surface-secondary border-b border-edge">
                    <span className="text-p2 font-semibold text-content">Toggl Tools Roles</span>
                  </div>
                  <div className="divide-y divide-edge-secondary">
                    <div className="flex items-center justify-between px-4 py-3">
                      <div className="flex items-center gap-3">
                        <TrackLogo size={20} />
                        <span className="text-p1 text-content">Toggl Track</span>
                      </div>
                      <span className="text-p2 text-content-secondary bg-surface-secondary px-2.5 py-1 rounded-md">User</span>
                    </div>
                    <div className="flex items-center justify-between px-4 py-3">
                      <div className="flex items-center gap-3">
                        <FocusLogo size={20} />
                        <span className="text-p1 text-content">Toggl Focus</span>
                      </div>
                      <span className="text-p2 text-content-secondary bg-surface-secondary px-2.5 py-1 rounded-md">Member</span>
                    </div>
                    <div className="flex items-center justify-between px-4 py-3">
                      <div className="flex items-center gap-3">
                        <WorkLogo size={20} />
                        <span className="text-p1 text-content">Toggl Work</span>
                      </div>
                      <span className="text-p2 text-content-secondary bg-surface-secondary px-2.5 py-1 rounded-md">User</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-edge-secondary" />

              {/* Teams */}
              <div
                ref={el => { sectionRefs.current.teams = el }}
                data-section="teams"
              >
                <h3 className="text-h5 font-semibold text-content mb-1">Teams</h3>
                <p className="text-p2 text-content-secondary mb-4">Manage team assignments</p>

                <div className="flex flex-wrap gap-2">
                  {userTeams.length > 0 ? (
                    userTeams.map(team => (
                      <span
                        key={team.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-secondary border border-edge text-p2 text-content"
                      >
                        {team.emoji} {team.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-p2 text-content-secondary">No teams assigned</span>
                  )}
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-dashed border-edge text-p2 text-content-secondary hover:text-content hover:border-edge-secondary transition-colors cursor-not-allowed opacity-60"
                  >
                    + Add team
                  </button>
                </div>
              </div>

              {/* Modules (conditional) */}
              {isModuleVisible && (
                <>
                  <div className="border-t border-edge-secondary" />
                  <div
                    ref={el => { sectionRefs.current.modules = el }}
                    data-section="modules"
                  >
                    <h3 className="text-h5 font-semibold text-content mb-1">Modules</h3>
                    <p className="text-p2 text-content-secondary mb-4">Manage module access for this member</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-surface-tertiary">
                          <IconTimeOff size={16} className="text-content-secondary" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-p1 text-content">Time Off</span>
                          {isTrial && <span className="text-p2 text-content-secondary">Trial</span>}
                        </div>
                      </div>
                      <Switch checked={enabled} onCheckedChange={setEnabled} />
                    </div>
                    {getMessage() && (
                      <p className={`text-p2 mt-3 ${enabled && isPaid && usedSeats + 1 > totalSeats ? 'text-warning' : 'text-content-secondary'}`}>{getMessage()}</p>
                    )}
                  </div>
                </>
              )}

              <div className="border-t border-edge-secondary" />

              {/* Toggl Track header */}
              <div className="flex items-center gap-2">
                <TrackLogo size={20} />
                <span className="text-h5 font-semibold text-content">Toggl Track</span>
              </div>

              {/* Billable rate */}
              <div
                ref={el => { sectionRefs.current.billable = el }}
                data-section="billable"
              >
                <h3 className="text-h5 font-semibold text-content mb-1">Billable rate</h3>
                <p className="text-p2 text-content-secondary mb-4">Manage billable rate for this member</p>
                <div className="px-4 py-3 rounded-lg bg-surface-secondary border border-edge">
                  <span className="text-p1 text-content-secondary">No billable rate set</span>
                </div>
              </div>

              <div className="border-t border-edge-secondary" />

              {/* Work hours */}
              <div
                ref={el => { sectionRefs.current.workhours = el }}
                data-section="workhours"
              >
                <h3 className="text-h5 font-semibold text-content mb-1">Work hours</h3>
                <p className="text-p2 text-content-secondary mb-4">View weekly total hours worked</p>
                <div className="px-4 py-3 rounded-lg bg-surface-secondary border border-edge">
                  <span className="text-p1 text-content">40 hrs/week</span>
                </div>
              </div>

              <div className="border-t border-edge-secondary" />

              {/* Labor cost */}
              <div
                ref={el => { sectionRefs.current.laborcost = el }}
                data-section="laborcost"
              >
                <h3 className="text-h5 font-semibold text-content mb-1">Labor cost</h3>
                <p className="text-p2 text-content-secondary mb-4">Manage labor cost for this member</p>
                <div className="px-4 py-3 rounded-lg bg-surface-secondary border border-edge">
                  <span className="text-p1 text-content-secondary">No labor cost set</span>
                </div>
              </div>

              {/* Bottom spacer so last section can scroll into view */}
              <div className="h-4" />
            </div>
          </div>
        </div>

        {/* Sticky footer */}
        <div className="border-t border-edge px-6 py-4 flex justify-end gap-3 shrink-0">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={!hasChanged}>Save</Button>
        </div>
      </div>
    </div>
  )
}
