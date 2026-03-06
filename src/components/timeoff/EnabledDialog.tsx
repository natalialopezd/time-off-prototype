import { Button } from '../ui/Button'
import { Dialog } from '../ui/Dialog'
import successImg from '../../assets/time-off-success.svg'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  memberCount: number
}

export const EnabledDialog = ({ open, onOpenChange, memberCount: _memberCount }: Props) => (
  <Dialog open={open} onOpenChange={onOpenChange} title="Time Off is now active" width={480}>
    <div className="flex flex-col gap-5">
      <div className="flex justify-center">
        <img src={successImg} alt="" className="size-32" />
      </div>
      <p className="text-p1 text-secondary">
        Time Off has been enabled for your organization. It's now available in Toggl Track and Toggl Focus.
      </p>
      <Button className="w-full" onClick={() => onOpenChange(false)}>Done</Button>
      <div className="flex flex-col gap-2 border-t border-primary pt-4">
        <p className="text-p2 text-secondary">Want to configure now?</p>
        <div className="flex items-center gap-2">
          <span className="text-p2 text-accent hover:underline cursor-pointer">Open in Toggl Track</span>
          <span className="text-p2 text-tertiary">|</span>
          <span className="text-p2 text-accent hover:underline cursor-pointer">Open in Toggl Focus</span>
        </div>
      </div>
    </div>
  </Dialog>
)
