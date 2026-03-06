import { useLocation, useNavigate } from 'react-router-dom'
import {
  IconOrganization, IconUsers, IconIntegrations, IconTeam,
  IconKey, IconCreditCard, IconChart, IconQuestion, IconCollapse,
  TrackLogo, FocusLogo, WorkLogo,
} from '../icons'
import { useModuleState } from '../../store/moduleState'

const TogglLogo = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="6" fill="#E57CD8" />
    <path d="M7 8h10M7 12h7M7 16h10" stroke="white" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

type NavItem = {
  label: string
  path?: string
  icon: typeof IconOrganization
  badge?: string
  enabled: boolean
}

function useNavItems(): NavItem[] {
  const { state } = useModuleState()
  const billingEnabled = state.status === 'active'
  return [
    { label: 'Organization', path: '/overview', icon: IconOrganization, enabled: true },
    { label: 'Members', path: '/members', icon: IconUsers, enabled: true },
    { label: 'Integrations', icon: IconIntegrations, badge: 'New', enabled: false },
    { label: 'Teams', icon: IconTeam, enabled: false },
    { label: 'Single Sign-On', icon: IconKey, enabled: false },
    { label: 'Billing', path: '/billing', icon: IconCreditCard, enabled: billingEnabled },
    { label: 'Explore Plans', icon: IconChart, enabled: false },
  ]
}

export const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const navItems = useNavItems()

  return (
    <div className="flex h-full">
      {/* Tray */}
      <div className="w-[52px] bg-nav flex flex-col items-center py-3">
        <div className="flex flex-col items-center gap-3 flex-1">
          <TogglLogo />
          <div className="w-7 h-[1px] bg-white/15 my-1" />

          <div className="flex flex-col items-center gap-2">
            <TrackLogo size={32} />
            <FocusLogo size={32} />
            <WorkLogo size={32} />
          </div>

          <div className="flex-1" />

          <button className="size-8 rounded-lg flex items-center justify-center text-sidebar-muted hover:bg-sidebar-hover hover:text-on-sidebar transition-colors">
            <IconCollapse size={16} />
          </button>
        </div>

        <div className="mt-auto pt-3">
          <button className="size-8 rounded-lg flex items-center justify-center text-sidebar-muted hover:bg-sidebar-hover hover:text-on-sidebar transition-colors">
            <IconQuestion size={16} />
          </button>
        </div>
      </div>

      {/* Content panel */}
      <div className="w-[200px] bg-sidebar flex flex-col">
        <div className="px-3 py-4 border-b border-white/10">
          <p className="text-on-sidebar text-h5 font-semibold truncate">Acme Design Studio</p>
          <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide bg-white/15 text-sidebar-muted">
            Premium
          </span>
        </div>

        <nav className="flex flex-col px-2 gap-0.5 pt-3">
          {navItems.map(item => {
            const isActive = item.path ? location.pathname === item.path : false
            const Icon = item.icon
            return (
              <button
                key={item.label}
                onClick={() => item.enabled && item.path && navigate(item.path)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-p1 text-left w-full transition-colors ${
                  isActive
                    ? 'bg-sidebar-hover text-on-sidebar'
                    : item.enabled
                      ? 'text-sidebar-muted hover:bg-sidebar-hover hover:text-on-sidebar'
                      : 'text-sidebar-muted/50 cursor-not-allowed'
                }`}
              >
                <Icon size={16} className="shrink-0" />
                <span className="truncate">{item.label}</span>
                {item.badge && (
                  <span className="ml-auto px-1.5 py-0.5 rounded text-[10px] font-semibold bg-accent text-on-accent leading-none">
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
