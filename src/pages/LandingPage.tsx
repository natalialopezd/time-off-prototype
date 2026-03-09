import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'

const tasks = [
  {
    id: 1,
    title: 'Task 1: Subscribe to Time Off',
    description: 'You\u2019re an admin at a company using Toggl. Your team has been trialing the Time Off module for the past 25 days. Your trial is ending soon \u2014 subscribe to keep access for your team.',
    path: '/overview',
  },
  {
    id: 2,
    title: 'Task 2: Give a team member access',
    description: 'You\u2019ve subscribed to Time Off. A new person has joined your team and needs access. Add them to the module.',
    path: '/members?entry=active',
  },
  {
    id: 3,
    title: 'Task 3: Give multiple people access',
    description: 'You want to give 5 additional people in your organization access to Time Off. Go ahead and do that.',
    path: '/members?entry=active',
  },
]

export const LandingPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-surface-secondary flex items-center justify-center p-8">
      <div className="max-w-[800px] w-full">
        <div className="text-center mb-10">
          <h1 className="text-h1 font-bold text-content mb-3">Time Off Module — User Testing</h1>
          <p className="text-p1 text-content-secondary">Select a task to begin. Each task simulates a different admin workflow.</p>
        </div>
        <div className="flex flex-col gap-4">
          {tasks.map(task => (
            <div key={task.id} className="bg-surface rounded-xl border border-edge p-6 flex items-center justify-between gap-6">
              <div className="flex-1">
                <h2 className="text-h4 font-semibold text-content mb-2">{task.title}</h2>
                <p className="text-p1 text-content-secondary">{task.description}</p>
              </div>
              <Button onClick={() => navigate(task.path)}>Start</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
