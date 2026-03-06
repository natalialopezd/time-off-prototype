import { useState, useRef, useEffect } from 'react'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Checkbox } from '../components/ui/Checkbox'
import { useAccess } from '../store/accessStore'
import { useModuleState } from '../store/moduleState'
import { MEMBERS, TEAMS } from '../data/members'
import { EditUserDialog } from '../components/members/EditUserDialog'
import { ModuleSelectionPopover } from '../components/members/ModuleSelectionPopover'
import { IconThreeDots, IconPencil, IconTrash } from '../components/icons'

const Avatar = ({ name }: { name: string }) => {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2)
  return (
    <div className="size-8 rounded-full bg-accent text-on-accent flex items-center justify-center text-[11px] font-semibold shrink-0">
      {initials}
    </div>
  )
}

const RowMenu = ({ onEdit }: { onEdit: () => void }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          setOpen(!open)
        }}
        className="p-1.5 rounded-md hover:bg-surface-secondary transition-colors text-content-secondary hover:text-content"
      >
        <IconThreeDots size={16} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 bg-surface rounded-lg shadow-xl border border-edge overflow-hidden w-[160px]">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setOpen(false)
              onEdit()
            }}
            className="w-full text-left px-3 py-2 text-p1 text-content hover:bg-surface-secondary transition-colors flex items-center gap-2"
          >
            <IconPencil size={14} className="text-content-secondary" />
            Edit
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setOpen(false)
            }}
            className="w-full text-left px-3 py-2 text-p1 text-destructive hover:bg-surface-secondary transition-colors flex items-center gap-2"
          >
            <IconTrash size={14} />
            Delete
          </button>
        </div>
      )}
    </div>
  )
}

export const MembersPage = () => {
  const { getAccess } = useAccess()
  const { state: moduleState } = useModuleState()
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [editingUser, setEditingUser] = useState<typeof MEMBERS[0] | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const isModuleVisible = moduleState.status === 'trial-active' || moduleState.status === 'active'

  const filteredMembers = MEMBERS.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const allSelected = selectedIds.size === filteredMembers.length && filteredMembers.length > 0
  const someSelected = selectedIds.size > 0 && !allSelected

  const toggleAll = () => {
    if (allSelected) setSelectedIds(new Set())
    else setSelectedIds(new Set(filteredMembers.map(m => m.id)))
  }

  const toggleOne = (id: number) => {
    const next = new Set(selectedIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelectedIds(next)
  }

  const getTeamNames = (member: typeof MEMBERS[0]) => {
    return TEAMS.filter(t => t.memberIds.includes(member.id)).map(t => `${t.emoji} ${t.name}`).join(', ')
  }

  const getRole = (member: typeof MEMBERS[0]) => {
    if (member.owner) return 'Owner'
    if (member.admin) return 'Admin'
    return 'Member'
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-h2 font-semibold text-content">Team Members</h1>
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="opacity-50 cursor-not-allowed pointer-events-none">Import</Button>
          <Button className="opacity-50 cursor-not-allowed pointer-events-none">Invite</Button>
        </div>
      </div>

      {/* Search / filter bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search members..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full max-w-sm px-3 py-2 rounded-lg border border-edge bg-surface text-p1 text-content placeholder:text-content-tertiary focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
      </div>

      {/* Bulk actions bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-4 mb-4 px-4 py-3 bg-surface rounded-lg border border-edge shadow-sm">
          <span className="text-p1 font-medium text-content">{selectedIds.size} selected</span>
          <div className="flex-1" />
          {isModuleVisible && (
            <ModuleSelectionPopover selectedUserIds={selectedIds} />
          )}
          <Button variant="tertiary" onClick={() => setSelectedIds(new Set())}>Clear selection</Button>
        </div>
      )}

      {/* Members table */}
      <div className="bg-surface rounded-xl border border-edge overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-edge bg-surface-secondary">
              <th className="w-12 px-4 py-3">
                <Checkbox
                  checked={allSelected ? true : someSelected ? 'indeterminate' : false}
                  onChange={toggleAll}
                />
              </th>
              <th className="text-left text-p2 font-semibold uppercase tracking-wide text-content-tertiary px-4 py-3">Member</th>
              <th className="text-left text-p2 font-semibold uppercase tracking-wide text-content-tertiary px-4 py-3">Role</th>
              <th className="text-left text-p2 font-semibold uppercase tracking-wide text-content-tertiary px-4 py-3">Teams</th>
              {isModuleVisible && (
                <th className="text-left text-p2 font-semibold uppercase tracking-wide text-content-tertiary px-4 py-3">Time Off</th>
              )}
              <th className="w-12 px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map(member => {
              const hasAccess = getAccess(member.id)
              const isSelected = selectedIds.has(member.id)
              return (
                <tr
                  key={member.id}
                  className="border-b border-edge-secondary last:border-b-0 hover:bg-surface-secondary transition-colors"
                >
                  <td className="w-12 px-4 py-3">
                    <Checkbox checked={isSelected} onChange={() => toggleOne(member.id)} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={member.name} />
                      <div className="flex flex-col">
                        <span className="text-p1 font-medium text-content">{member.name}</span>
                        <span className="text-p2 text-content-secondary">{member.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-p1 text-content">{getRole(member)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-p1 text-content-secondary">{getTeamNames(member) || '\u2014'}</span>
                  </td>
                  {isModuleVisible && (
                    <td className="px-4 py-3">
                      {hasAccess ? (
                        <Badge variant="success">Active</Badge>
                      ) : (
                        <Badge variant="passive">No access</Badge>
                      )}
                    </td>
                  )}
                  <td className="w-12 px-4 py-3">
                    <RowMenu onEdit={() => setEditingUser(member)} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {/* Footer count */}
        <div className="px-4 py-3 border-t border-edge-secondary bg-surface-secondary">
          <span className="text-p2 text-content-tertiary">{filteredMembers.length} of {MEMBERS.length} members</span>
        </div>
      </div>

      {editingUser && (
        <EditUserDialog
          user={editingUser}
          open={true}
          onOpenChange={(open) => { if (!open) setEditingUser(null) }}
        />
      )}
    </div>
  )
}
