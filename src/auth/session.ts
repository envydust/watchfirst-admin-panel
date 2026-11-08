import { useSyncExternalStore } from 'react'
import type { SessionUser } from '../api/types'

export interface Session {
  token: string
  expiresAt: number
  absoluteExpiresAt: number
  user: SessionUser
}

const KEY = 'wfa.session'
let current: Session | null = read()
const listeners = new Set<() => void>()

function read(): Session | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Session
    if (!parsed?.token || !parsed.user) return null
    if (parsed.absoluteExpiresAt && parsed.absoluteExpiresAt <= Date.now()) return null
    return parsed
  } catch {
    return null
  }
}

function emit() {
  for (const l of listeners) l()
}

export function getSession() {
  return current
}

export function setSession(next: Session | null) {
  current = next
  try {
    if (next) localStorage.setItem(KEY, JSON.stringify(next))
    else localStorage.removeItem(KEY)
  } catch {
    /* storage unavailable: session lives in memory only */
  }
  emit()
}

export function patchSession(patch: Omit<Partial<Session>, 'user'> & { user?: Partial<SessionUser> }) {
  if (!current) return
  setSession({ ...current, ...patch, user: { ...current.user, ...(patch.user ?? {}) } })
}

export function clearSession() {
  setSession(null)
}

export function useSession() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    () => current,
    () => current,
  )
}

// Another tab logging out or in should be reflected here.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === KEY) {
      current = read()
      emit()
    }
  })
}
