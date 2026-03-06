import { HashRouter, Routes, Route, Navigate, Outlet, useSearchParams, useLocation } from 'react-router-dom'
import { useRef } from 'react'
import { ToastProvider } from './components/ui/Toast'
import { ModuleProvider, type ModuleStatus } from './store/moduleState'
import { AccessProvider } from './store/accessStore'
import { Shell } from './components/layout/Shell'
import { LandingPage } from './pages/LandingPage'
import { OverviewPage } from './pages/OverviewPage'
import { MembersPage } from './pages/MembersPage'
import { BillingPage } from './pages/BillingPage'

function TaskRedirect() {
  const [params] = useSearchParams()
  const task = params.get('task')
  if (task === '1') return <Navigate to="/overview" replace />
  if (task === '2' || task === '3') return <Navigate to="/members" replace />
  return <LandingPage />
}

function ConsoleLayout() {
  const location = useLocation()
  const initialStatusRef = useRef<ModuleStatus>(
    location.pathname === '/members' ? 'active' : 'trial-active'
  )

  return (
    <ModuleProvider initialStatus={initialStatusRef.current}>
      <AccessProvider>
        <Shell><Outlet /></Shell>
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
          <Route element={<ConsoleLayout />}>
            <Route path="/overview" element={<OverviewPage />} />
            <Route path="/billing" element={<BillingPage />} />
            <Route path="/members" element={<MembersPage />} />
          </Route>
        </Routes>
      </ToastProvider>
    </HashRouter>
  )
}
