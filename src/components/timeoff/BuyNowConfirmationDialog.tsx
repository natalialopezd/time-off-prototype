import { Button } from '../ui/Button'
import { Dialog } from '../ui/Dialog'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  trialDaysRemaining: number | null
}

export const BuyNowConfirmationDialog = ({ open, onOpenChange, onConfirm, trialDaysRemaining }: Props) => (
  <Dialog open={open} onOpenChange={onOpenChange} title="End trial and subscribe?" width={480}>
    <div className="flex flex-col gap-5">
      <p className="text-p1 text-secondary">
        {trialDaysRemaining !== null
          ? `You still have ${trialDaysRemaining} days left on your free trial. Subscribing now will end your trial immediately. You'll select members and confirm billing in the next step.`
          : "Subscribing now will end your free trial immediately. You'll select members and confirm billing in the next step."}
      </p>
      <p className="text-p1 text-secondary">Do you want to continue?</p>
      <div className="flex flex-col gap-3">
        <Button className="w-full" onClick={onConfirm}>Continue to member selection</Button>
        <Button variant="secondary" className="w-full" onClick={() => onOpenChange(false)}>Keep trial</Button>
      </div>
    </div>
  </Dialog>
)
