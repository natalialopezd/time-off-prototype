import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from 'react'

export type ModuleStatus = 'upsell' | 'trial-active' | 'active' | 'cancelled' | 'disabled'

export type ModuleAction =
  | { type: 'START_TRIAL' }
  | { type: 'ACTIVATE' }
  | { type: 'CANCEL' }
  | { type: 'DISABLE' }
  | { type: 'RE_ENABLE' }
  | { type: 'RESET'; initialStatus?: ModuleStatus }

export type ModuleState = {
  status: ModuleStatus
  trialDaysRemaining: number | null
  cancelsOn: string | null
}

function createInitialState(status: ModuleStatus = 'upsell'): ModuleState {
  return {
    status,
    trialDaysRemaining: status === 'trial-active' ? 5 : null,
    cancelsOn: null,
  }
}

function moduleReducer(state: ModuleState, action: ModuleAction): ModuleState {
  switch (action.type) {
    case 'START_TRIAL':
      if (state.status !== 'upsell') return state
      return { status: 'trial-active', trialDaysRemaining: 30, cancelsOn: null }
    case 'ACTIVATE':
      if (state.status !== 'trial-active' && state.status !== 'cancelled') return state
      return { status: 'active', trialDaysRemaining: null, cancelsOn: null }
    case 'CANCEL':
      if (state.status !== 'active') return state
      return { status: 'cancelled', trialDaysRemaining: null, cancelsOn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() }
    case 'DISABLE':
      if (state.status !== 'trial-active' && state.status !== 'active') return state
      return { status: 'disabled', trialDaysRemaining: null, cancelsOn: null }
    case 'RE_ENABLE':
      if (state.status !== 'disabled') return state
      return { status: 'upsell', trialDaysRemaining: null, cancelsOn: null }
    case 'RESET':
      return createInitialState(action.initialStatus ?? 'upsell')
    default:
      return state
  }
}

interface ModuleContextValue {
  state: ModuleState
  dispatch: Dispatch<ModuleAction>
}

const ModuleContext = createContext<ModuleContextValue | null>(null)

export function ModuleProvider({ initialStatus = 'trial-active', children }: { initialStatus?: ModuleStatus; children: ReactNode }) {
  const [state, dispatch] = useReducer(moduleReducer, initialStatus, createInitialState)
  return <ModuleContext.Provider value={{ state, dispatch }}>{children}</ModuleContext.Provider>
}

export function useModuleState() {
  const ctx = useContext(ModuleContext)
  if (!ctx) throw new Error('useModuleState must be used within ModuleProvider')
  return ctx
}
