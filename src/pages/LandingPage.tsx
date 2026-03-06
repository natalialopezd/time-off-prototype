import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'

const tasks = [
  {
    id: 1,
    title: 'Task 1: Convert trial to paid',
    description: 'You are the admin of an organization that has been trialing the Time Off module. Your trial is ending in 5 days. Subscribe to keep Time Off for your team.',
    path: '/overview',
  },
  {
    id: 2,
    title: 'Task 2: Add a single user',
    description: 'Your organization has Time Off active. One of your team members, Sarah Chen, doesn\'t have access yet. Give her access to Time Off.',
    path: '/members',
  },
  {
    id: 3,
    title: 'Task 3: Bulk add/remove users',
    description: 'You need to give Time Off access to multiple team members at once. Select several users and manage their module access in bulk.',
    path: '/members',
  },
]

export const LandingPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-surface-secondary flex items-center justify-center p-8">
      <div className="max-w-[800px] w-full">
        <div className="text-center mb-10">
          <h1 className="text-h1 font-bold text-content mb-3">Time Off Module -- User Testing</h1>
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
