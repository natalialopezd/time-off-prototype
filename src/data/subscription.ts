export const SUBSCRIPTION = {
  currentYearly: 2592,
  modulePricePerUserMonthly: 24,
  renewalDate: 'March 1, 2026',
  daysRemainingInPeriod: 2,
}

export function formatCurrency(amount: number) {
  return `$${amount.toLocaleString('en-US')}`
}
