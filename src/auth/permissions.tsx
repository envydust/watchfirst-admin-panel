import type { ReactNode } from 'react'
import type { PermissionId, SessionUser } from '../api/types'
import { useSession } from './session'

export function can(user: SessionUser | null | undefined, perm: PermissionId): boolean {
  if (!user) return false
  if (user.role === 'owner') return true
  return user.permissions.includes('*') || user.permissions.includes(perm)
}

export function useCan() {
  const session = useSession()
  return (perm: PermissionId) => can(session?.user, perm)
}

/** Renders children only when the current user holds the permission. */
export function Can({ perm, children, fallback = null }: { perm: PermissionId; children: ReactNode; fallback?: ReactNode }) {
  const allowed = useCan()(perm)
  return <>{allowed ? children : fallback}</>
}
