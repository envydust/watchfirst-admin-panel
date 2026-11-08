import { useQuery } from '@tanstack/react-query'
import { ArrowRight, Inbox, Plus, RefreshCw } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { requests as requestsApi } from '../../api/endpoints'
import { keys } from '../../app/queryClient'
import { useCan } from '../../auth/permissions'
import { useSession } from '../../auth/session'
import { Button, LinkButton } from '../../components/ui/button'
import { EmptyState, Skeleton } from '../../components/ui/misc'
import { PageHeader, Panel, StatRow, StatTile } from '../../components/ui/page'
import { DAY, plural, relativeTime, validity } from '../../lib/format'
import { useSnapshot } from '../members/hooks'
import { ActivityList } from '../activity/ActivityList'

export function OverviewPage() {
  const session = useSession()
  const can = useCan()
  const navigate = useNavigate()
  const snapshot = useSnapshot()
  const requests = useQuery({ queryKey: keys.requests, queryFn: requestsApi.list, enabled: can('requests.manage'), refetchInterval: 10_000 })

  const now = Date.now()
  const members = snapshot.data?.members ?? []
  const active = members.filter((m) => m.status === 'active' && m.expires_at > now)
  const soon = active.filter((m) => validity(m.expires_at, now).state === 'soon')
  const blocked = members.filter((m) => m.status === 'blocked')
  const expired = members.filter((m) => m.status === 'active' && m.expires_at <= now)
  const pending = (requests.data?.requests ?? []).filter((r) => r.status === 'pending' && r.expires_at > now)
  const online = members.filter((m) => m.devices.some((d) => now - d.last_seen < DAY)).length

  const first = session?.user.name.split(' ')[0] ?? ''
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`${greeting}, ${first}`}
        description={
          pending.length > 0
            ? `${pending.length === 1 ? 'Uma pessoa está esperando' : `${pending.length} pessoas estão esperando`} aprovação agora.`
            : 'Nenhuma solicitação pendente. Tudo em dia.'
        }
        actions={
          <Button variant="ghost" icon={<RefreshCw className="size-4" />} onClick={() => void snapshot.refetch()} loading={snapshot.isFetching}>
            Atualizar
          </Button>
        }
        primary={
          can('members.write') ? (
            <Button variant="primary" icon={<Plus className="size-4" />} onClick={() => navigate('/membros/novo')}>
              Novo membro
            </Button>
          ) : undefined
        }
      />

      <StatRow>
        {can('requests.manage') && (
          <StatTile
            label="Solicitações pendentes"
            value={
              <span className="inline-flex items-center gap-2">
                {pending.length}
                {pending.length > 0 && <span className="live-dot" aria-hidden />}
              </span>
            }
            tone={pending.length > 0 ? 'accent' : 'neutral'}
            hint={pending.length > 0 ? 'Alguém esperando' : 'Nada por enquanto'}
            onClick={() => navigate('/solicitacoes')}
            loading={requests.isLoading}
          />
        )}
        {can('members.read') && (
          <>
            <StatTile label="Membros ativos" value={active.length} hint={`${online} online nas últimas 24 h`} onClick={() => navigate('/membros?status=active')} loading={snapshot.isLoading} />
            <StatTile
              label="Vencem em 7 dias"
              value={soon.length}
              tone={soon.length > 0 ? 'amber' : 'neutral'}
              hint={expired.length > 0 ? plural(expired.length, 'já vencido', 'já vencidos') : 'Acompanhe as renovações'}
              onClick={() => navigate('/membros?validade=soon')}
              loading={snapshot.isLoading}
            />
            <StatTile
              label="Bloqueados"
              value={blocked.length}
              tone={blocked.length > 0 ? 'red' : 'neutral'}
              onClick={() => navigate('/membros?status=blocked')}
              loading={snapshot.isLoading}
            />
          </>
        )}
      </StatRow>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_1fr]">
        {can('requests.manage') && (
          <Panel
            title="Esperando aprovação"
            actions={
              <LinkButton href="#" onClick={(e) => { e.preventDefault(); navigate('/solicitacoes') }} variant="ghost" size="sm" icon={<ArrowRight className="size-4" />}>
                Ver todas
              </LinkButton>
            }
          >
            {requests.isLoading ? (
              <div className="flex flex-col gap-3 p-5">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-5 w-1/2" />
              </div>
            ) : pending.length === 0 ? (
              <EmptyState icon={<Inbox />} title="Ninguém esperando" description="Quando alguém pedir acesso pelo app ou pelo site, aparece aqui e na barra lateral." />
            ) : (
              <ul className="divide-y divide-line">
                {pending.slice(0, 5).map((r) => (
                  <li key={r.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-medium">{r.email}</p>
                      <p className="text-[12.5px] text-fg-dim">
                        {r.device_name} · pediu {relativeTime(r.created_at)} · vence {relativeTime(r.expires_at)}
                      </p>
                    </div>
                    <Link to={`/solicitacoes#${r.id}`} className="shrink-0 text-[13px] font-medium">
                      Decidir
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        )}
        {can('audit.read') && (
          <Panel
            title="Últimas atividades"
            actions={
              <LinkButton href="#" onClick={(e) => { e.preventDefault(); navigate('/atividade') }} variant="ghost" size="sm" icon={<ArrowRight className="size-4" />}>
                Ver tudo
              </LinkButton>
            }
          >
            <ActivityList entries={snapshot.data?.audit.slice(0, 8) ?? []} loading={snapshot.isLoading} compact />
          </Panel>
        )}
      </div>
    </div>
  )
}
