import { type ReactNode } from 'react'
import { Sidebar } from './Sidebar'

export const Shell = ({ children }: { children: ReactNode }) => (
  <div className="flex h-screen overflow-hidden">
    <Sidebar />
    <main className="flex-1 overflow-y-auto bg-secondary">
      <div className="max-w-[960px] mx-auto px-8 py-8">
        {children}
      </div>
    </main>
  </div>
)
