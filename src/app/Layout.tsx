import * as DialogPrimitive from '@radix-ui/react-dialog'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Activity, Inbox, LayoutDashboard, LogOut, Menu as MenuIcon, Puzzle, Settings, ShieldCheck, UserRound, Users, X } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { auth, requests as requestsApi } from '../api/endpoints'
import type { PermissionId } from '../api/types'
import { useCan } from '../auth/permissions'
import { clearSession, useSession } from '../auth/session'
import { Button } from '../components/ui/button'
import { DropdownContent, DropdownItem, DropdownMenu, DropdownSeparator, DropdownTrigger } from '../components/ui/menu'
import { cn } from '../lib/cn'
import { initials } from '../lib/format'
import { keys } from './queryClient'

interface NavItem {
  to: string
  label: string
  icon: ReactNode
  perm?: PermissionId
  end?: boolean
}

const NAV: NavItem[] = [
  { to: '/', label: 'Visão geral', icon: <LayoutDashboard />, end: true },
  { to: '/membros', label: 'Membros', icon: <Users />, perm: 'members.read' },
  { to: '/solicitacoes', label: 'Solicitações', icon: <Inbox />, perm: 'requests.manage' },
  { to: '/addons', label: 'Addons e conteúdo', icon: <Puzzle />, perm: 'addons.manage' },
  { to: '/atividade', label: 'Atividade', icon: <Activity />, perm: 'audit.read' },
  { to: '/equipe', label: 'Equipe', icon: <ShieldCheck />, perm: 'admins.manage' },
  { to: '/configuracoes', label: 'Configurações', icon: <Settings /> },
]

/** Pending access requests are the most urgent object in the product: polled every 10 s from the shell. */
export function usePendingCount() {
  const can = useCan()
  const q = useQuery({
    queryKey: keys.requests,
    queryFn: requestsApi.list,
    enabled: can('requests.manage'),
    refetchInterval: 10_000,
  })
  const now = Date.now()
  return q.data?.requests.filter((r) => r.status === 'pending' && r.expires_at > now).length ?? 0
}

function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-baseline gap-0 text-[17px] font-extrabold tracking-[-0.02em]', className)}>
      <span className="text-fg">WATCH</span>
      <span className="text-accent">FIRST</span>
    </span>
  )
}

function Nav({ onNavigate, pending }: { onNavigate?: () => void; pending: number }) {
  const can = useCan()
  return (
    <nav aria-label="Principal" className="flex flex-col gap-0.5">
      {NAV.filter((item) => !item.perm || can(item.perm)).map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'group flex h-10 items-center gap-3 rounded-md px-3 text-[14px] font-medium no-underline transition-colors',
              isActive ? 'bg-accent-dim text-fg' : 'text-fg-muted hover:bg-[rgba(255,255,255,0.05)] hover:text-fg',
            )
          }
        >
          {({ isActive }) => (
            <>
              <span className={cn('[&>svg]:size-[18px]', isActive ? 'text-accent' : 'text-fg-dim group-hover:text-fg-muted')}>{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {item.to === '/solicitacoes' && pending > 0 && (
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-[11.5px] font-bold tabular-nums text-accent-ink">
                  {pending}
                </span>
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

function UserMenu() {
  const session = useSession()
  const navigate = useNavigate()
  const qc = useQueryClient()
  if (!session) return null
  const { user } = session
  async function logout() {
    try {
      await auth.logout()
    } catch {
      /* the token is dropped locally either way */
    }
    clearSession()
    qc.clear()
    navigate('/entrar', { replace: true })
    toast('Você saiu do painel.')
  }
  return (
    <DropdownMenu>
      <DropdownTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-colors hover:bg-[rgba(255,255,255,0.05)]"
          aria-label="Menu da conta"
        >
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-raised text-[12px] font-bold text-accent-soft ring-1 ring-line-strong">
            {initials(user.name) || 'WF'}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13.5px] font-medium">{user.name}</span>
            <span className="block truncate text-[12px] text-fg-dim">{user.role === 'owner' ? 'Dono' : 'Suporte'}</span>
          </span>
        </button>
      </DropdownTrigger>
      <DropdownContent align="start" className="w-56">
        <DropdownItem icon={<UserRound />} onSelect={() => navigate('/conta')}>
          Minha conta
        </DropdownItem>
        <DropdownSeparator />
        <DropdownItem icon={<LogOut />} onSelect={logout}>
          Sair
        </DropdownItem>
      </DropdownContent>
    </DropdownMenu>
  )
}

function Sidebar({ onNavigate, pending }: { onNavigate?: () => void; pending: number }) {
  return (
    <div className="flex h-full flex-col bg-rail">
      <div className="px-5 pb-4 pt-5">
        <Wordmark />
        <p className="mt-0.5 text-[11.5px] font-medium uppercase tracking-[0.14em] text-fg-dim">Central de controle</p>
      </div>
      <div className="flex-1 overflow-y-auto px-3">
        <Nav onNavigate={onNavigate} pending={pending} />
      </div>
      <div className="border-t border-line p-2">
        <UserMenu />
      </div>
    </div>
  )
}

export function Layout() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const pending = usePendingCount()

  useEffect(() => {
    document.title = pending > 0 ? `(${pending}) WATCHFIRST Admin` : 'WATCHFIRST Admin'
  }, [pending])
  useEffect(() => setOpen(false), [location.pathname])

  return (
    <div className="min-h-svh lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="sticky top-0 hidden h-svh border-r border-line lg:block">
        <Sidebar pending={pending} />
      </aside>

      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-rail/95 px-3 backdrop-blur-sm lg:hidden">
        <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
          <DialogPrimitive.Trigger asChild>
            <Button variant="ghost" size="icon" aria-label="Abrir menu">
              <MenuIcon className="size-5" />
            </Button>
          </DialogPrimitive.Trigger>
          <DialogPrimitive.Portal>
            <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-[rgba(4,7,10,0.7)] data-[state=open]:animate-[fade-in_180ms_ease-out]" />
            <DialogPrimitive.Content className="fixed inset-y-0 left-0 z-50 w-[280px] border-r border-line-strong shadow-pop focus:outline-none data-[state=open]:animate-[slide-in_220ms_var(--ease-out)]">
              <DialogPrimitive.Title className="sr-only">Menu</DialogPrimitive.Title>
              <DialogPrimitive.Description className="sr-only">Navegação do painel</DialogPrimitive.Description>
              <DialogPrimitive.Close asChild>
                <Button variant="ghost" size="icon" aria-label="Fechar menu" className="absolute right-2 top-3 z-10">
                  <X className="size-5" />
                </Button>
              </DialogPrimitive.Close>
              <Sidebar onNavigate={() => setOpen(false)} pending={pending} />
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
        <Wordmark className="text-[15px]" />
        <span className="w-9">
          {pending > 0 && (
            <NavLink to="/solicitacoes" className="grid size-9 place-items-center no-underline" aria-label={`${pending} solicitações pendentes`}>
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-[11.5px] font-bold text-accent-ink">{pending}</span>
            </NavLink>
          )}
        </span>
      </header>

      <main className="min-w-0 px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pt-8">
        <div className="mx-auto w-full max-w-[1400px]">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
