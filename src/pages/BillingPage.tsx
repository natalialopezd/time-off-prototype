import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { useModuleState } from '../store/moduleState'
import { useAccess } from '../store/accessStore'
import { SUBSCRIPTION, formatCurrency } from '../data/subscription'
import { IconTimeOff } from '../components/icons'
import { ThreeDotsMenu } from '../components/ui/ThreeDotsMenu'
import { TrackLogo, FocusLogo, WorkLogo } from '../components/icons'

const Tooltip = ({ children, text }: { children: React.ReactNode; text: string }) => (
  <span className="relative group/tooltip inline-flex cursor-help">
    {children}
    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg bg-nav text-on-sidebar text-p2 whitespace-nowrap opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity z-50 shadow-lg">
      {text}
    </span>
  </span>
)

const InfoIcon = ({ size = 16, className = '', tooltip }: { size?: number; className?: string; tooltip?: string }) => {
  const icon = (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 7v4M8 5.5v-.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
  if (tooltip) return <Tooltip text={tooltip}>{icon}</Tooltip>
  return icon
}

type TabId = 'overview' | 'details' | 'history'

export const BillingPage = () => {
  const navigate = useNavigate()
  const { state } = useModuleState()
  const { usedSeats, totalSeats } = useAccess()
  const [activeTab] = useState<TabId>('overview')
  const memberCount = state.subscribedMemberCount ?? 10

  const { currentYearly, modulePricePerUserMonthly, renewalDate } = SUBSCRIPTION
  const timeOffYearly = memberCount * modulePricePerUserMonthly * 12
  const newTotal = currentYearly + timeOffYearly

  const isModuleVisible = state.status === 'trial-active' || state.status === 'active' || state.status === 'cancelled'
  const isTrial = state.status === 'trial-active'

  return (
    <div className="flex flex-col -mx-8 -mt-8">
      {/* Navigation */}
      <div className="border-b border-edge bg-surface">
        <div className="px-6 pt-4">
          <h1 className="text-h4 font-semibold text-content">Billing</h1>
        </div>
        <div className="flex gap-0 px-6 mt-2">
          {(['overview', 'details', 'history'] as TabId[]).map(tab => (
            <button
              key={tab}
              className={`px-4 py-2.5 text-p1 font-medium border-b-2 transition-colors capitalize ${
                activeTab === tab
                  ? 'border-accent text-accent'
                  : 'border-transparent text-content-secondary hover:text-content'
              }`}
            >
              {tab === 'overview' ? 'Overview' : tab === 'details' ? 'Details' : 'History'}
            </button>
          ))}
        </div>
      </div>

      {/* Overview content */}
      <div className="flex flex-col gap-4 px-6 pt-6 pb-10">

        {/* Estimated Payment */}
        <Card className="bg-surface border border-edge">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-p1 text-content-secondary">
              <span>Estimated next payment</span>
              <InfoIcon size={16} className="text-content-tertiary" tooltip="This is an estimate based on your current plans and seats. Final amount may vary." />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-h2 font-semibold text-content">
                {formatCurrency(newTotal)} EUR
              </span>
              <span className="text-p1 text-content-secondary">
                /yr on {renewalDate} {'\u2022'} Billed annually
              </span>
            </div>
          </div>
        </Card>

        {/* Your Plans */}
        <Card className="bg-surface border border-edge">
          <div className="mb-3">
            <h2 className="text-h5 font-semibold text-content">Your Plans</h2>
            <p className="text-p2 text-content-secondary mt-0.5">
              Next payment {renewalDate} in {formatCurrency(newTotal)} EUR
            </p>
          </div>
          <div className="w-full overflow-auto">
            <table className="w-full text-p1">
              <thead>
                <tr className="border-b border-edge-secondary">
                  <th className="text-left text-p2 font-semibold uppercase text-content-tertiary py-2.5 pr-4">Toggl Tools</th>
                  <th className="text-left text-p2 font-semibold uppercase text-content-tertiary py-2.5 pr-4">Plan</th>
                  <th className="text-right text-p2 font-semibold uppercase text-content-tertiary py-2.5 pr-4">
                    <span className="inline-flex items-center gap-1">
                      Price Estimate
                      <InfoIcon size={14} className="text-content-tertiary" tooltip="Final price might change based on usage" />
                    </span>
                  </th>
                  <th className="w-10 py-2.5" />
                </tr>
              </thead>
              <tbody>
                <PlanRow
                  logo={<TrackLogo size={24} />}
                  name="Toggl Track"
                  plan="Premium"
                  price="180.00 EUR"
                />
                <PlanRow
                  logo={<FocusLogo size={24} />}
                  name="Toggl Focus"
                  plan="Starter"
                  price="60.00 EUR"
                />
                <PlanRow
                  logo={<WorkLogo size={24} />}
                  name="Toggl Work"
                  plan="Free"
                  price=""
                  isAdd
                />
              </tbody>
            </table>
          </div>
        </Card>

        {/* Your Modules */}
        {isModuleVisible && (
          <Card className="bg-surface border border-edge">
            <h2 className="text-h5 font-semibold text-content mb-3">Your modules</h2>

            {state.status === 'cancelled' && state.cancelsOn && (
              <div className="flex items-center gap-2 px-1 py-2 mb-2">
                <svg width={16} height={16} viewBox="0 0 16 16" fill="none" className="shrink-0 text-warning">
                  <path d="M8 1l7 14H1L8 1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                  <path d="M8 6v4M8 12v.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span className="text-p2 text-warning">
                  Time Off has been cancelled. You'll have access until {new Date(state.cancelsOn).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.
                </span>
              </div>
            )}

            <div className="w-full overflow-auto">
              <table className="w-full text-p1">
                <thead>
                  <tr className="border-b border-edge-secondary">
                    <th className="text-left text-p2 font-semibold uppercase text-content-tertiary py-2.5 pr-4">Module</th>
                    <th className="text-left text-p2 font-semibold uppercase text-content-tertiary py-2.5 pr-4">
                      {isTrial ? 'Seats' : (
                        <span className="inline-flex items-center gap-1">
                          Billed Seats
                          <InfoIcon size={14} className="text-content-tertiary" tooltip="Members with seats in Toggl Track and Toggl Focus are only billed once" />
                        </span>
                      )}
                    </th>
                    <th className="text-left text-p2 font-semibold uppercase text-content-tertiary py-2.5 pr-4">Price per seat</th>
                    <th className="text-right text-p2 font-semibold uppercase text-content-tertiary py-2.5 pr-4">
                      <span className="inline-flex items-center gap-1 justify-end">
                        Price Estimate
                        <InfoIcon size={14} className="text-content-tertiary" tooltip="Final price might change based on usage" />
                      </span>
                    </th>
                    <th className="w-10 py-2.5" />
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-edge-secondary">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-8 items-center justify-center rounded-sm bg-muted">
                          <IconTimeOff size={16} className="text-accent" />
                        </div>
                        <span className="text-p1 text-content">{isTrial ? 'Time Off - Trial' : 'Time Off'}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-p1 text-content">
                      {isTrial ? usedSeats : `$${modulePricePerUserMonthly}/user/month`}
                    </td>
                    <td className="py-3 pr-4 text-p1 text-content">${modulePricePerUserMonthly}/user/month</td>
                    <td className="py-3 pr-4 text-p1 text-content text-right">
                      {isTrial ? '0 EUR' : `${formatCurrency(timeOffYearly)} EUR`}
                    </td>
                    <td className="py-3 w-10">
                      {state.status !== 'cancelled' && (
                        <ThreeDotsMenu
                          items={[
                            { label: 'Manage seats', onClick: () => navigate('/members') },
                            ...(!isTrial ? [{ label: 'Cancel subscription', destructive: true as const }] : []),
                          ]}
                        />
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Total Seats */}
        <Card className="bg-surface border border-edge">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-h5 font-semibold text-content">Total seats</div>
              <div className="text-content-secondary text-p1">{totalSeats}</div>
            </div>
            <Button variant="secondary" onClick={() => navigate('/members')}>
              Manage Seats
            </Button>
          </div>
        </Card>

        {/* Usage + Billing Cycle side by side */}
        <div className="flex gap-4">
          {/* Usage */}
          <Card className="bg-surface border border-edge flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-h5 font-semibold text-content">Usage details</h2>
                <p className="text-p2 text-content-secondary mt-0.5">You're using 42 of 500 report views</p>
              </div>
              <Button variant="secondary" className="cursor-not-allowed opacity-60">Upgrade</Button>
            </div>
            <div className="flex flex-col gap-1 px-2 pb-3">
              <div className="flex justify-between items-end">
                <div className="flex flex-col gap-4">
                  <span className="text-p1 text-content-secondary">Report views</span>
                  <span className="text-h4 font-semibold text-content">42 / 500</span>
                </div>
                <span className="text-p2 text-content-secondary">8%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-surface-tertiary overflow-hidden mt-1">
                <div className="h-full rounded-full bg-success" style={{ width: '8%' }} />
              </div>
            </div>
          </Card>

          {/* Billing Cycle */}
          <Card className="bg-surface border border-edge flex-1 self-start">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-h5 font-semibold text-content">Billing cycle</div>
                <div className="text-content-secondary text-p1">Billed annually</div>
              </div>
              <Button variant="secondary" className="cursor-not-allowed opacity-60">Switch to monthly</Button>
            </div>
          </Card>
        </div>

        {/* Footer */}
        <div className="flex flex-col items-center mt-16 w-full">
          <div className="w-[230px] h-px bg-surface-tertiary mb-8" />
          <span className="text-accent text-p1">
            Questions about subscriptions? <a href="#" className="underline hover:text-accent-hover">See our docs</a>
          </span>
        </div>
      </div>
    </div>
  )
}

function PlanRow({ logo, name, plan, price, isAdd }: {
  logo: React.ReactNode
  name: string
  plan: string
  price: string
  isAdd?: boolean
}) {
  return (
    <tr className="border-b border-edge-secondary last:border-b-0">
      <td className="py-3 pr-4">
        <div className="flex items-center gap-3">
          {logo}
          <span className="text-p1 font-medium text-content">{name}</span>
        </div>
      </td>
      <td className="py-3 pr-4">
        <span className="text-p1 text-content">{plan}</span>
      </td>
      <td className="py-3 pr-4 text-right text-p1 text-content">
        {price || '\u2014'}
      </td>
      <td className="py-3 w-10 text-right pr-1.5">
        {isAdd ? (
          <button className="size-8 rounded-lg flex items-center justify-center text-content-tertiary hover:bg-surface-secondary cursor-not-allowed">
            <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
              <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        ) : (
          <ThreeDotsMenu
            items={[
              { label: 'Change Plan' },
              { label: 'Manage Seats', onClick: () => {} },
              { label: 'Cancel Subscription', destructive: true },
            ]}
          />
        )}
      </td>
    </tr>
  )
}
