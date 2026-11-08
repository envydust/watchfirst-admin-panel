import { useQuery } from '@tanstack/react-query'
import { useEffect, type ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router'
import { auth } from '../api/endpoints'
import { keys } from '../app/queryClient'
import { patchSession, useSession } from './session'

/**
 * Gate for everything behind login. Re-validates the session with the service on mount and on focus,
 * so a permission change made by the owner reaches an open tab, and a revoked session drops out.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const session = useSession()
  const location = useLocation()
  const me = useQuery({
    queryKey: keys.me,
    queryFn: auth.me,
    enabled: !!session,
    staleTime: 60_000,
    refetchInterval: 5 * 60_000,
  })
  useEffect(() => {
    if (me.data) {
      patchSession({
        user: me.data.user,
        ...(me.data.sessionExpiresAt ? { expiresAt: me.data.sessionExpiresAt } : {}),
        ...(me.data.absoluteExpiresAt ? { absoluteExpiresAt: me.data.absoluteExpiresAt } : {}),
      })
    }
  }, [me.data])

  if (!session) {
    const next = location.pathname === '/' ? '' : `?next=${encodeURIComponent(location.pathname + location.search)}`
    return <Navigate to={`/entrar${next}`} replace />
  }
  if (session.user.mustChangePassword && location.pathname !== '/trocar-senha') {
    return <Navigate to="/trocar-senha" replace />
  }
  return <>{children}</>
}
