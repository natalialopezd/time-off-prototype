import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Switch } from '../components/ui/Switch'
import { useModuleState } from '../store/moduleState'
import {
  IconTimeOff, IconListCheck, IconCalendar, IconMarkAsDone,
  IconChevronDown, IconChevronUp, IconPencil, IconThreeDots,
  TrackLogo, FocusLogo, WorkLogo,
} from '../components/icons'
import { BuyNowConfirmationDialog } from '../components/timeoff/BuyNowConfirmationDialog'
import { SubscribeDialog } from '../components/timeoff/SubscribeDialog'
import { EnabledDialog } from '../components/timeoff/EnabledDialog'
import { MEMBERS } from '../data/members'
import { ThreeDotsMenu } from '../components/ui/ThreeDotsMenu'

const MODULE_INFO = {
  name: 'Time Off',
  price: '$2/user/month',
  badgeLabel: 'Free trial available',
  description: 'The simplest way to track vacations, sick days, and any type of leave, all from inside Toggl Tools.',
  features: [
    { icon: IconListCheck, text: 'Custom leave policies that track balances and accruals for you' },
    { icon: IconCalendar, text: "See who's off before you plan, all on one team calendar" },
    { icon: IconMarkAsDone, text: 'Approve leave requests in one click, or enable auto-approvals' },
  ],
}

const Avatar = ({ name, size = 32 }: { name: string; size?: number }) => {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2)
  return (
    <div
      className="rounded-full bg-accent text-on-accent flex items-center justify-center font-semibold shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials}
    </div>
  )
}

const SmallAvatar = ({ name }: { name: string }) => {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2)
  return (
    <div className="size-6 rounded-full bg-accent text-on-accent flex items-center justify-center text-[10px] font-semibold shrink-0">
      {initials}
    </div>
  )
}

// --- Static sections ---

const OrgNameSection = () => (
  <Card>
    <label className="text-p2 font-medium text-content-secondary block mb-2">Organization Name</label>
    <div className="flex items-center gap-2">
      <input
        readOnly
        value="Acme Design Studio"
        className="flex-1 text-h4 font-semibold text-content bg-transparent border-b border-edge focus:outline-none cursor-default"
      />
      <IconPencil size={16} className="text-content-tertiary" />
    </div>
  </Card>
)

const OrgOwnerSection = () => (
  <Card>
    <h2 className="text-h5 font-semibold text-content mb-4">Organization Owner</h2>
    <div className="flex items-center gap-3">
      <Avatar name="Sarah Chen" />
      <div className="flex flex-col">
        <span className="text-p1 font-medium text-content">Sarah Chen</span>
        <span className="text-p2 text-content-secondary">sarah.chen@acme.design</span>
      </div>
      <div className="flex-1" />
      <Button variant="secondary" className="opacity-50 cursor-not-allowed pointer-events-none">
        Request Ownership Transfer
      </Button>
    </div>
  </Card>
)

const ToolRow = ({ logo, name, admins, memberCount }: {
  logo: ReactNode
  name: string
  admins: string[]
  memberCount: number
}) => (
  <tr className="border-b border-edge-secondary last:border-b-0">
    <td className="py-3 pr-4">
      <div className="flex items-center gap-3">
        {logo}
        <span className="text-p1 font-medium text-content">{name}</span>
      </div>
    </td>
    <td className="py-3 pr-4">
      <div className="flex items-center gap-1">
        {admins.map(a => <SmallAvatar key={a} name={a} />)}
        <span className="text-p2 text-content-secondary ml-1">{admins.join(', ')}</span>
      </div>
    </td>
    <td className="py-3 pr-4">
      <span className="text-p1 text-content-secondary">Members {memberCount}</span>
    </td>
    <td className="py-3 w-10">
      <button className="size-8 rounded-lg flex items-center justify-center text-content-tertiary hover:bg-surface-secondary cursor-not-allowed">
        <IconThreeDots size={16} />
      </button>
    </td>
  </tr>
)

const TogglToolsSection = () => (
  <Card>
    <h2 className="text-h5 font-semibold text-content">Toggl Tools in Organization</h2>
    <p className="text-p2 text-content-secondary mt-1 mb-4">
      Listed below are the Toggl tools in your organization. Manage admin access and members for each tool.
    </p>
    <div className="border-t border-edge-secondary">
      <table className="w-full">
        <thead>
          <tr className="border-b border-edge-secondary">
            <th className="text-left text-p2 font-semibold uppercase text-content-tertiary py-2.5 pr-4">Toggl Tools</th>
            <th className="text-left text-p2 font-semibold uppercase text-content-tertiary py-2.5 pr-4">Admins</th>
            <th className="text-left text-p2 font-semibold uppercase text-content-tertiary py-2.5 pr-4">Members</th>
            <th className="w-10 py-2.5" />
          </tr>
        </thead>
        <tbody>
          <ToolRow logo={<TrackLogo size={24} />} name="Toggl Track" admins={['Sarah Chen', 'Marcus Rivera']} memberCount={10} />
          <ToolRow logo={<FocusLogo size={24} />} name="Toggl Focus" admins={['Sarah Chen', 'Marcus Rivera']} memberCount={10} />
          <ToolRow logo={<WorkLogo size={24} />} name="Toggl Work" admins={['Sarah Chen']} memberCount={8} />
        </tbody>
      </table>
    </div>
  </Card>
)

const Enforce2FASection = () => (
  <Card>
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-h5 font-semibold text-content">Enforce 2FA</h2>
        <p className="text-p2 text-content-secondary mt-1">
          Require all members to enable two-factor authentication before accessing the organization.
        </p>
      </div>
      <Switch checked={false} onCheckedChange={() => {}} />
    </div>
  </Card>
)

const OrgActionsSection = () => (
  <Card>
    <h2 className="text-h5 font-semibold text-content mb-3">Organization Actions</h2>
    <button className="px-4 py-2 rounded-lg text-p1 font-medium border border-destructive text-destructive cursor-not-allowed opacity-60">
      Delete Organization
    </button>
  </Card>
)

// --- Main page ---

export const OverviewPage = () => {
  const { state, dispatch } = useModuleState()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(true)
  const [showBuyNowDialog, setShowBuyNowDialog] = useState(false)
  const [showSubscribeDialog, setShowSubscribeDialog] = useState(false)
  const [showEnabledDialog, setShowEnabledDialog] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)

  const memberCount = MEMBERS.length

  const handleBuyNow = () => setShowBuyNowDialog(true)
  const handleConfirmBuyNow = () => {
    setShowBuyNowDialog(false)
    setShowSubscribeDialog(true)
  }
  const handleSubscribe = (memberCount: number) => {
    dispatch({ type: 'ACTIVATE', subscribedMemberCount: memberCount })
    setShowSubscribeDialog(false)
    setShowEnabledDialog(true)
  }

  const cancelsOnShort = state.cancelsOn
    ? new Date(state.cancelsOn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : null
  const cancelsOnLong = state.cancelsOn
    ? new Date(state.cancelsOn).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : null

  const statusBadge = (() => {
    switch (state.status) {
      case 'trial-active':
        return <Badge variant="success">{state.trialDaysRemaining !== null ? `Trial ${state.trialDaysRemaining} days left` : 'Trial active'}</Badge>
      case 'cancelled':
        return <Badge variant="warning">{`Cancels ${cancelsOnShort}`}</Badge>
      case 'disabled':
        return <Badge variant="passive">Disabled</Badge>
      default:
        return undefined
    }
  })()

  const renderModuleHeader = (showChevron: boolean, actionMenu?: ReactNode) => (
    <div className="flex items-center justify-between py-1">
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center rounded-sm size-6 bg-muted">
          <IconTimeOff className="size-4 text-accent" />
        </div>
        <span className="text-h4 font-semibold text-content">Time Off</span>
      </div>
      <div className="flex items-center gap-3">
        {statusBadge}
        {!isOpen && !statusBadge && showChevron && (
          <>
            <span className="text-p1 text-content">{MODULE_INFO.price}</span>
            <Badge variant="default"><span className="uppercase">{MODULE_INFO.badgeLabel}</span></Badge>
          </>
        )}
        {actionMenu}
        {showChevron && (isOpen ? <IconChevronUp size={16} className="text-content-secondary" /> : <IconChevronDown size={16} className="text-content-secondary" />)}
      </div>
    </div>
  )

  const renderUpsell = () => (
    <div className="flex gap-8 pt-4">
      <div className="flex flex-1 flex-col gap-6">
        <p className="text-p1 text-content-secondary">{MODULE_INFO.description}</p>
        <p className="text-p1 font-semibold text-accent">{MODULE_INFO.price}</p>
        <div className="flex gap-3">
          <Button onClick={() => { dispatch({ type: 'START_TRIAL' }); setShowEnabledDialog(true) }}>
            Start 30-day free trial
          </Button>
          <Button variant="secondary">Learn more</Button>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-6 px-2.5">
        {MODULE_INFO.features.map(f => (
          <div key={f.text} className="flex items-center gap-2">
            <f.icon className="size-4 shrink-0 text-accent" />
            <p className="text-p1 text-content-secondary">{f.text}</p>
          </div>
        ))}
      </div>
    </div>
  )

  const renderTrialActive = () => (
    <div className="flex flex-col gap-4 pt-4">
      <p className="text-p1 text-content-secondary">
        Your Time Off trial is active. Explore all features during your trial period.
      </p>
      <div className="flex gap-3">
        <Button onClick={handleBuyNow}>Subscribe</Button>
        <Button variant="tertiary" onClick={() => dispatch({ type: 'DISABLE' })}>Cancel trial</Button>
      </div>
    </div>
  )

  const renderDisabled = () => (
    <div className="flex flex-col gap-4 pt-4">
      <p className="text-p1 text-content-secondary">Time Off has been disabled for your organization.</p>
      <Button variant="secondary" onClick={() => dispatch({ type: 'RE_ENABLE' })}>Re-enable</Button>
    </div>
  )

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-h2 font-semibold text-content">Organization</h1>

      <OrgNameSection />
      <OrgOwnerSection />
      <TogglToolsSection />

      {/* Modules — Time Off (interactive) */}
      <Card>
        <h2 className="text-h5 font-semibold text-content mb-4">Modules</h2>

        {state.status === 'active' ? (
          <div>
            {renderModuleHeader(false,
              <ThreeDotsMenu
                items={[
                  { label: 'Manage members', onClick: () => navigate('/members') },
                  { label: 'Open in Toggl Track' },
                  { label: 'Open in Toggl Focus' },
                  { label: 'Remove Time Off', destructive: true, onClick: () => setShowCancelDialog(true) },
                ]}
              />
            )}
          </div>
        ) : state.status === 'cancelled' ? (
          <div>
            {renderModuleHeader(false,
              <ThreeDotsMenu items={[{ label: 'Reactivate', onClick: () => dispatch({ type: 'ACTIVATE' }) }]} />
            )}
            <p className="text-p2 text-warning pl-10">
              {`Cancels on ${cancelsOnLong} \u00b7 You have access until then.`}
            </p>
          </div>
        ) : (
          <div>
            <div className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
              {renderModuleHeader(true)}
            </div>
            {isOpen && (
              state.status === 'upsell' ? renderUpsell() :
              state.status === 'trial-active' ? renderTrialActive() :
              state.status === 'disabled' ? renderDisabled() : null
            )}
          </div>
        )}
      </Card>

      <Enforce2FASection />
      <OrgActionsSection />

      <BuyNowConfirmationDialog
        open={showBuyNowDialog}
        onOpenChange={setShowBuyNowDialog}
        onConfirm={handleConfirmBuyNow}
        trialDaysRemaining={state.trialDaysRemaining}
      />
      <SubscribeDialog
        open={showSubscribeDialog}
        onOpenChange={setShowSubscribeDialog}
        onConfirm={handleSubscribe}
      />
      <EnabledDialog
        open={showEnabledDialog}
        onOpenChange={setShowEnabledDialog}
        memberCount={memberCount}
      />

      {showCancelDialog && (
        <CancelDialog
          onConfirm={() => { dispatch({ type: 'CANCEL' }); setShowCancelDialog(false) }}
          onCancel={() => setShowCancelDialog(false)}
        />
      )}
    </div>
  )
}

function CancelDialog({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay" onClick={onCancel}>
      <div className="bg-surface rounded-xl shadow-xl p-6 w-[480px]" onClick={e => e.stopPropagation()}>
        <h2 className="text-h3 font-semibold text-content mb-4">Remove Time Off?</h2>
        <p className="text-p1 text-content-secondary mb-5">
          All members will lose access to Time Off. You can reactivate anytime.
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onCancel}>Keep Time Off</Button>
          <Button variant="destructive" className="flex-1" onClick={onConfirm}>Remove</Button>
        </div>
      </div>
    </div>
  )
}
