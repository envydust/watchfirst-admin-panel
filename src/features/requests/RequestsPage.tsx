import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Check, Inbox, MonitorSmartphone, Globe, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { toast } from 'sonner'
import { requests as requestsApi } from '../../api/endpoints'
import type { AccessRequest } from '../../api/types'
import { keys } from '../../app/queryClient'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { ConfirmDialog } from '../../components/ui/dialog'
import { EmptyState, Skeleton } from '../../components/ui/misc'
import { PageHeader, Panel } from '../../components/ui/page'
import { cn } from '../../lib/cn'
import { formatDateTime, relativeTime } from '../../lib/format'

function audienceLabel(a: AccessRequest['audience']) {
  return a === 'windows' ? 'App Windows' : a === 'max' ? 'Site MAX' : a === 'basic' ? 'Site Básico' : 'Código do app'
}

function useNow(ms = 1000) {
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), ms)
    return () => clearInterval(t)
  }, [ms])
  return now
}

function countdown(expiresAt: number, now: number) {
  const s = Math.max(0, Math.floor((expiresAt - now) / 1000))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

export function RequestsPage() {
  const qc = useQueryClient()
  const now = useNow()
  const q = useQuery({ queryKey: keys.requests, queryFn: requestsApi.list, refetchInterval: 10_000 })
  const invalidate = () => {
    void qc.invalidateQueries({ queryKey: keys.requests })
    void qc.invalidateQueries({ queryKey: keys.snapshot })
  }
  const approve = useMutation({
    mutationFn: ({ id, choice }: { id: string; choice: { memberId: string } | { plan: 'basic' | 'max' } }) => requestsApi.approve(id, choice),
    onSuccess: () => {
      invalidate()
      toast.success('Acesso liberado. A pessoa entra em alguns segundos.')
    },
    onError: (e: Error) => {
      invalidate()
      toast.error(e.message)
    },
  })
  const reject = useMutation({
    mutationFn: (id: string) => requestsApi.reject(id),
    onSuccess: () => {
      invalidate()
      toast('Solicitação rejeitada.')
    },
    onError: (e: Error) => {
      invalidate()
      toast.error(e.message)
    },
  })
  const [rejecting, setRejecting] = useState<AccessRequest | null>(null)
  const [creating, setCreating] = useState<{ req: AccessRequest; plan: 'basic' | 'max' } | null>(null)

  const all = q.data?.requests ?? []
  const pending = all.filter((r) => r.status === 'pending' && r.expires_at > now).sort((a, b) => a.created_at - b.created_at)
  const decided = all.filter((r) => !(r.status === 'pending' && r.expires_at > now)).sort((a, b) => (b.decided_at ?? b.created_at) - (a.decided_at ?? a.created_at))

  useEffect(() => {
    if (location.hash && q.data) document.getElementById(location.hash.slice(1))?.scrollIntoView({ block: 'center' })
  }, [q.data])

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Solicitações de acesso"
        description={pending.length === 0 ? 'Ninguém esperando. A lista atualiza sozinha a cada 10 segundos.' : `${pending.length === 1 ? '1 pessoa espera' : `${pending.length} pessoas esperam`} sua decisão. Cada pedido vale por 30 minutos.`}
      />

      <p className="rounded-md border border-line bg-panel px-4 py-3 text-[13px] text-fg-muted">
        O e-mail informado não comprova identidade. Reconheça a pessoa antes de aceitar: aprovar libera só aquele navegador ou computador, uma única vez.
      </p>

      {q.isLoading ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : q.isError ? (
        <EmptyState title="Não foi possível carregar" description={(q.error as Error).message} action={<Button onClick={() => void q.refetch()}>Tentar de novo</Button>} />
      ) : pending.length === 0 ? (
        <EmptyState icon={<Inbox />} title="Nenhuma solicitação pendente" description="Quando alguém clicar em “Solicitar acesso” no app ou em “Inserir e-mail” nos sites, aparece aqui." />
      ) : (
        <ul className="flex flex-col gap-3">
          {pending.map((r) => {
            const urgent = r.expires_at - now < 5 * 60_000
            const busy = (approve.isPending && approve.variables?.id === r.id) || (reject.isPending && reject.variables === r.id)
            return (
              <li key={r.id} id={r.id} className={cn('rounded-lg border bg-panel p-5 transition-colors', urgent ? 'border-[rgba(255,200,87,0.4)]' : 'border-line')}>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[16px] font-semibold">{r.email}</p>
                      <Badge tone="neutral">
                        {r.audience === 'windows' ? <MonitorSmartphone className="size-3" /> : <Globe className="size-3" />}
                        {audienceLabel(r.audience)}
                      </Badge>
                      <Badge tone={urgent ? 'amber' : 'neutral'} className="tabular-nums">
                        vence em {countdown(r.expires_at, now)}
                      </Badge>
                    </div>
                    <p className="mt-1 text-[12.5px] text-fg-dim">
                      {r.device_name} · pedido {relativeTime(r.created_at)}
                    </p>
                    <div className="mt-3">
                      {r.members.length === 0 ? (
                        <p className="text-[13px] text-fg-muted">
                          Nenhum membro ativo com esse e-mail. Você pode criar um agora (vitalício, 1 dispositivo) ou cadastrar em{' '}
                          <Link to={`/membros?q=${encodeURIComponent(r.email)}`}>Membros</Link>.
                        </p>
                      ) : (
                        <div className="flex flex-col gap-2">
                          <p className="text-[13px] font-medium text-fg-muted">Liberar como</p>
                          <div className="flex flex-wrap gap-2">
                            {r.members.map((m) => (
                              <Button key={m.id} variant="primary" size="sm" icon={<Check className="size-4" />} loading={busy} onClick={() => approve.mutate({ id: r.id, choice: { memberId: m.id } })}>
                                {m.name} <span className="font-normal opacity-80">· {m.plan === 'max' ? 'MAX' : 'Básico'}</span>
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col gap-2 lg:items-end">
                    {r.members.length === 0 && (
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="primary" icon={<Check className="size-4" />} loading={busy} onClick={() => setCreating({ req: r, plan: 'basic' })}>
                          Criar membro Básico
                        </Button>
                        <Button size="sm" variant="primary" icon={<Check className="size-4" />} loading={busy} onClick={() => setCreating({ req: r, plan: 'max' })}>
                          Criar membro MAX
                        </Button>
                      </div>
                    )}
                    <Button size="sm" variant="danger" icon={<X className="size-4" />} loading={busy} onClick={() => setRejecting(r)} className="self-start lg:self-end">
                      Rejeitar
                    </Button>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      {decided.length > 0 && (
        <Panel title="Histórico recente">
          <ul className="divide-y divide-line">
            {decided.slice(0, 30).map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-3 px-5 py-3 text-[13.5px]">
                <div className="min-w-0">
                  <p className="truncate font-medium">{r.email}</p>
                  <p className="text-[12.5px] text-fg-dim">
                    {audienceLabel(r.audience)} · {r.device_name} · {formatDateTime(r.decided_at ?? r.created_at)}
                  </p>
                </div>
                <Badge tone={r.status === 'approved' ? 'accent' : r.status === 'rejected' ? 'red' : 'neutral'}>
                  {r.status === 'approved' ? 'Aceita' : r.status === 'rejected' ? 'Rejeitada' : 'Expirada'}
                </Badge>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      <ConfirmDialog
        open={!!rejecting}
        onOpenChange={(o) => !o && setRejecting(null)}
        title={`Rejeitar o pedido de ${rejecting?.email ?? ''}?`}
        description="A pessoa vê a recusa na tela e precisa pedir de novo se for o caso. Nada é alterado no cadastro."
        confirmLabel="Rejeitar"
        tone="danger"
        onConfirm={() => rejecting && reject.mutateAsync(rejecting.id)}
      />
      <ConfirmDialog
        open={!!creating}
        onOpenChange={(o) => !o && setCreating(null)}
        title={`Criar membro ${creating?.plan === 'max' ? 'MAX' : 'Básico'} e liberar?`}
        description={`Um membro com o e-mail ${creating?.req.email ?? ''} é criado agora, vitalício e com 1 dispositivo, e este pedido é aceito na mesma hora. Você pode ajustar validade e dispositivos depois em Membros.`}
        confirmLabel="Criar e liberar"
        onConfirm={() => creating && approve.mutateAsync({ id: creating.req.id, choice: { plan: creating.plan } })}
      />
    </div>
  )
}
