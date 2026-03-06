import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { MEMBERS } from '../data/members'

const DEFAULT_NO_ACCESS = new Set([3001, 3007, 3004, 3010])

function defaultAccess(userId: number): boolean {
  return !DEFAULT_NO_ACCESS.has(userId)
}

interface AccessContextValue {
  getAccess: (userId: number) => boolean
  setAccess: (userId: number, enabled: boolean) => void
  setBulkAccess: (userIds: number[], enabled: boolean) => void
  usedSeats: number
  totalSeats: number
}

const AccessContext = createContext<AccessContextValue | null>(null)

export function AccessProvider({ children }: { children: ReactNode }) {
  const [accessMap, setAccessMap] = useState<Record<number, boolean>>({})

  const getAccess = useCallback((userId: number) => {
    return accessMap[userId] ?? defaultAccess(userId)
  }, [accessMap])

  const setAccess = useCallback((userId: number, enabled: boolean) => {
    setAccessMap(prev => ({ ...prev, [userId]: enabled }))
  }, [])

  const setBulkAccess = useCallback((userIds: number[], enabled: boolean) => {
    setAccessMap(prev => {
      const next = { ...prev }
      userIds.forEach(id => { next[id] = enabled })
      return next
    })
  }, [])

  const usedSeats = MEMBERS.filter(m => accessMap[m.id] ?? defaultAccess(m.id)).length
  const totalSeats = 8

  return (
    <AccessContext.Provider value={{ getAccess, setAccess, setBulkAccess, usedSeats, totalSeats }}>
      {children}
    </AccessContext.Provider>
  )
}

export function useAccess() {
  const ctx = useContext(AccessContext)
  if (!ctx) throw new Error('useAccess must be used within AccessProvider')
  return ctx
}
