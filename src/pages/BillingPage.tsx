import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { useModuleState } from '../store/moduleState'
import { SUBSCRIPTION, formatCurrency } from '../data/subscription'
import { IconTimeOff } from '../components/icons'

export const BillingPage = () => {
  const { state } = useModuleState()
  const memberCount = state.subscribedMemberCount ?? 10

  const { currentYearly, modulePricePerUserMonthly, renewalDate, daysRemainingInPeriod } = SUBSCRIPTION
  const timeOffYearly = memberCount * modulePricePerUserMonthly * 12
  const newTotal = currentYearly + timeOffYearly
  const prorated = Math.round(((timeOffYearly / 365) * daysRemainingInPeriod + Number.EPSILON) * 100) / 100

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-h2 font-semibold text-content">Billing</h1>

      {/* Current Plan */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-h5 font-semibold text-content">Current Plan</h2>
          <Badge variant="success">Active</Badge>
        </div>
        <div className="flex items-center justify-between py-3 border-b border-edge-secondary">
          <div>
            <p className="text-p1 font-medium text-content">Premium</p>
            <p className="text-p2 text-content-secondary">10 members</p>
          </div>
          <span className="text-p1 text-content">{formatCurrency(currentYearly)}/year</span>
        </div>
        {state.status === 'active' && (
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center rounded-sm size-6 bg-muted">
                <IconTimeOff className="size-4 text-accent" />
              </div>
              <div>
                <p className="text-p1 font-medium text-content">Time Off</p>
                <p className="text-p2 text-content-secondary">
                  {memberCount} member{memberCount !== 1 ? 's' : ''} &middot; ${modulePricePerUserMonthly}/user/month
                </p>
              </div>
            </div>
            <span className="text-p1 text-content">{formatCurrency(timeOffYearly)}/year</span>
          </div>
        )}
      </Card>

      {/* Billing Summary */}
      <Card>
        <h2 className="text-h5 font-semibold text-content mb-4">Billing Summary</h2>
        <div className="flex flex-col gap-3 rounded-lg bg-surface-secondary p-4">
          <div className="flex items-center justify-between">
            <span className="text-p1 text-content">Base subscription (Premium)</span>
            <span className="text-p1 text-content">{formatCurrency(currentYearly)}/year</span>
          </div>
          {state.status === 'active' && (
            <div className="flex items-start justify-between">
              <span className="text-p1 text-content">
                Time Off ({memberCount} member{memberCount !== 1 ? 's' : ''})
              </span>
              <div className="flex flex-col items-end">
                <span className="text-p1 text-content">${modulePricePerUserMonthly}/user/month</span>
                <span className="text-p2 text-content-secondary">Billed annually: {formatCurrency(timeOffYearly)}</span>
              </div>
            </div>
          )}
          <div className="border-t border-edge-secondary" />
          <div className="flex items-center justify-between">
            <span className="text-p1 font-semibold text-content">Total</span>
            <span className="text-p1 font-semibold text-content">{formatCurrency(newTotal)}/year</span>
          </div>
          {state.status === 'active' && prorated > 0 && (
            <>
              <div className="border-t border-dashed border-edge-secondary" />
              <div className="flex items-center justify-between">
                <span className="text-p1 text-content">Prorated charge (Time Off)</span>
                <span className="text-p1 text-content">${prorated.toFixed(2)}</span>
              </div>
            </>
          )}
        </div>
      </Card>

      {/* Next Payment */}
      <Card>
        <h2 className="text-h5 font-semibold text-content mb-4">Next Payment</h2>
        <div className="flex items-center justify-between py-3 border-b border-edge-secondary">
          <span className="text-p1 text-content">Renewal date</span>
          <span className="text-p1 text-content">{renewalDate}</span>
        </div>
        <div className="flex items-center justify-between py-3 border-b border-edge-secondary">
          <span className="text-p1 text-content">Amount due at renewal</span>
          <span className="text-p1 font-semibold text-content">{formatCurrency(newTotal)}</span>
        </div>
        <div className="flex items-center justify-between py-3">
          <span className="text-p1 text-content">Payment method</span>
          <div className="flex items-center gap-2">
            <div className="px-2 py-1 rounded bg-surface-secondary border border-edge">
              <span className="text-p2 font-semibold text-content">VISA</span>
            </div>
            <span className="text-p1 text-content-secondary">&bull;&bull;&bull;&bull; 4242</span>
          </div>
        </div>
      </Card>

      {/* Invoices */}
      <Card>
        <h2 className="text-h5 font-semibold text-content mb-4">Recent Invoices</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b border-edge-secondary">
              <th className="text-left text-p2 font-semibold uppercase text-content-tertiary py-2.5 pr-4">Date</th>
              <th className="text-left text-p2 font-semibold uppercase text-content-tertiary py-2.5 pr-4">Description</th>
              <th className="text-right text-p2 font-semibold uppercase text-content-tertiary py-2.5 pr-4">Amount</th>
              <th className="text-left text-p2 font-semibold uppercase text-content-tertiary py-2.5">Status</th>
            </tr>
          </thead>
          <tbody>
            {state.status === 'active' && (
              <tr className="border-b border-edge-secondary">
                <td className="py-3 pr-4 text-p1 text-content">Today</td>
                <td className="py-3 pr-4 text-p1 text-content">Time Off — Prorated charge</td>
                <td className="py-3 pr-4 text-p1 text-content text-right">${prorated.toFixed(2)}</td>
                <td className="py-3"><Badge variant="success">Paid</Badge></td>
              </tr>
            )}
            <tr className="border-b border-edge-secondary">
              <td className="py-3 pr-4 text-p1 text-content">Mar 1, 2025</td>
              <td className="py-3 pr-4 text-p1 text-content">Premium — Annual subscription</td>
              <td className="py-3 pr-4 text-p1 text-content text-right">{formatCurrency(currentYearly)}</td>
              <td className="py-3"><Badge variant="success">Paid</Badge></td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-p1 text-content">Mar 1, 2024</td>
              <td className="py-3 pr-4 text-p1 text-content">Premium — Annual subscription</td>
              <td className="py-3 pr-4 text-p1 text-content text-right">{formatCurrency(currentYearly)}</td>
              <td className="py-3"><Badge variant="success">Paid</Badge></td>
            </tr>
          </tbody>
        </table>
      </Card>

      <div className="flex gap-3">
        <Button variant="secondary" className="cursor-not-allowed opacity-60">Download all invoices</Button>
        <Button variant="secondary" className="cursor-not-allowed opacity-60">Update payment method</Button>
      </div>
    </div>
  )
}
