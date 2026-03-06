import { HashRouter, Routes, Route, Navigate, Outlet, useSearchParams } from 'react-router-dom'
import { ToastProvider } from './components/ui/Toast'
import { ModuleProvider } from './store/moduleState'
import { AccessProvider } from './store/accessStore'
import { Shell } from './components/layout/Shell'
import { LandingPage } from './pages/LandingPage'
import { OverviewPage } from './pages/OverviewPage'
import { MembersPage } from './pages/MembersPage'
import { BillingPage } from './pages/BillingPage'
import type { ReactNode } from 'react'

function TaskRedirect() {
  const [params] = useSearchParams()
  const task = params.get('task')
  if (task === '1') return <Navigate to="/overview" replace />
  if (task === '2' || task === '3') return <Navigate to="/members" replace />
  return <LandingPage />
}

function WithShell({ children }: { children: ReactNode }) {
  return <Shell>{children}</Shell>
}

function Task1Layout() {
  return (
    <ModuleProvider initialStatus="trial-active">
      <AccessProvider>
        <WithShell><Outlet /></WithShell>
      </AccessProvider>
    </ModuleProvider>
  )
}

function MembersRoute() {
  return (
    <ModuleProvider initialStatus="active">
      <AccessProvider>
        <WithShell><MembersPage /></WithShell>
      </AccessProvider>
    </ModuleProvider>
  )
}

export default function App() {
  return (
    <HashRouter>
      <ToastProvider>
        <Routes>
          <Route path="/" element={<TaskRedirect />} />
          <Route element={<Task1Layout />}>
            <Route path="/overview" element={<OverviewPage />} />
            <Route path="/billing" element={<BillingPage />} />
          </Route>
          <Route path="/members" element={<MembersRoute />} />
        </Routes>
      </ToastProvider>
    </HashRouter>
  )
}
