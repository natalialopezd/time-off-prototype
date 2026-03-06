import { type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sidebar } from './Sidebar'

const BackToTasksButton = () => {
  const navigate = useNavigate()
  return (
    <button
      onClick={() => navigate('/')}
      className="fixed top-4 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-accent text-on-accent text-p2 font-medium shadow-lg hover:bg-accent-hover transition-colors"
    >
      <svg width={14} height={14} viewBox="0 0 16 16" fill="none">
        <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Back to task list
    </button>
  )
}

export const Shell = ({ children }: { children: ReactNode }) => (
  <div className="flex h-screen overflow-hidden">
    <Sidebar />
    <main className="flex-1 overflow-y-auto bg-surface-secondary">
      <div className="max-w-[960px] mx-auto px-8 py-8">
        {children}
      </div>
    </main>
    <BackToTasksButton />
  </div>
)
