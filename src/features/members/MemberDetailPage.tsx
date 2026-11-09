import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, MonitorSmartphone, Pencil } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { audit as auditApi } from '../../api/endpoints'
import type { Member, MemberInput } from '../../api/types'
import { keys } from '../../app/queryClient'
import { useCan } from '../../auth/permissions'
import { PlanChip, StatusChip, ValidityChip } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { ConfirmDialog, Dialog, DialogContent } from '../../components/ui/dialog'
import { EmptyState, Skeleton } from '../../components/ui/misc'
import { Panel } from '../../components/ui/page'
import { Ticket } from '../../components/ui/ticket'
import { DAY, displayEmail, formatDate, formatDateTime, isLifetime, planLabel, relativeTime, validity } from '../../lib/format'
import { accessCodeMessage } from '../../lib/whatsapp'
import { ActivityList } from '../activity/ActivityList'
import { MemberForm } from './MemberForm'
import { RowMenu } from './MembersPage'
import { useMemberMutations, useSnapshot } from './hooks'

export function MemberDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const can = useCan()
  const snapshot = useSnapshot()
  const { update, remove, rotate, disconnect } = useMemberMutations()
  const member = snapshot.data?.members.find((m) => m.id === id)
  const history = useQuery({
    queryKey: keys.audit({ subject: id }),
    queryFn: () => auditApi.list({ subject: id, limit: 50 }),
    enabled: can('audit.read') && !!id,
  })
  const [editing, setEditing] = useState(false)
  const [ticket, setTicket] = useState<string | null>(null)
  const [confirm, setConfirm] = useState<'rotate' | 'disconnect' | 'delete' | 'block' | 'unblock' | null>(null)

  if (snapshot.isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-9 w-72" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }
  if (!member) {
    return <EmptyState title="Membro não encontrado" description="Ele pode ter sido excluído." action={<Button onClick={() => navigate('/membros')}>Voltar para membros</Button>} />
  }

  const now = Date.now()
  const v = validity(member.expires_at, now)
  const toInput = (m: Member, patch: Partial<MemberInput> = {}): MemberInput => ({
    name: m.name,
    email: m.email,
    plan: m.plan,
    status: m.status,
    ...(isLifetime(m.expires_at) ? { lifetime: true } : { expiresAt: m.expires_at }),
    maxDevices: m.max_devices,
    notes: m.notes,
    ...patch,
  })

  async function runConfirm() {
    if (!confirm || !member) return
    if (confirm === 'rotate') setTicket((await rotate.mutateAsync(member.id)).code)
    else if (confirm === 'disconnect') await disconnect.mutateAsync(member.id)
    else if (confirm === 'delete') {
      await remove.mutateAsync(member.id)
      navigate('/membros', { replace: true })
    } else if (confirm === 'block') await update.mutateAsync({ id: member.id, input: toInput(member, { status: 'blocked' }) })
    else if (confirm === 'unblock') await update.mutateAsync({ id: member.id, input: toInput(member, { status: 'active' }) })
  }
  const copy = {
    rotate: { title: 'Renovar o código?', description: 'O código atual deixa de funcionar e todos os dispositivos são desconectados. O novo aparece uma única vez.', label: 'Renovar código', tone: 'default' as const },
    disconnect: { title: 'Desconectar os dispositivos?', description: 'As sessões do app são encerradas. O código continua valendo.', label: 'Desconectar', tone: 'default' as const },
    block: { title: `Bloquear ${member.name}?`, description: 'O acesso para imediatamente no app e nos sites. Você pode liberar depois.', label: 'Bloquear', tone: 'danger' as const },
    unblock: { title: `Liberar ${member.name}?`, description: 'O acesso volta com o mesmo código, respeitando a validade.', label: 'Liberar', tone: 'default' as const },
    delete: { title: `Excluir ${member.name}?`, description: 'Remove cadastro, código e sessões em definitivo. Para só impedir o acesso, prefira bloquear.', label: 'Excluir membro', tone: 'danger' as const },
  }

  return (
    <div className="flex flex-col gap-6">
      <Link to="/membros" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-fg-muted no-underline hover:text-fg">
        <ArrowLeft className="size-4" /> Membros
      </Link>

      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-[26px] font-semibold leading-none tracking-[-0.02em] sm:text-[30px]">{member.name}</h1>
            <PlanChip plan={member.plan} />
            {member.status === 'blocked' ? <StatusChip status="blocked" /> : <ValidityChip state={v.state} label={v.label} />}
          </div>
          <p className="mt-2 text-[14px] text-fg-muted">
            {displayEmail(member.email) || <span className="italic text-amber/80">Sem e-mail informado — edite para registrar</span>} · membro desde {formatDate(member.created_at)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {can('members.write') && (
            <Button icon={<Pencil className="size-4" />} onClick={() => setEditing(true)}>
              Editar
            </Button>
          )}
          <RowMenu
            member={member}
            onEdit={() => setEditing(true)}
            onRotate={() => setConfirm('rotate')}
            onDisconnect={() => setConfirm('disconnect')}
            onBlock={() => setConfirm(member.status === 'blocked' ? 'unblock' : 'block')}
            onExtend={(d) => {
              const base = Math.max(member.expires_at, now)
              void update.mutateAsync({ id: member.id, input: toInput(member, { expiresAt: base + d * DAY }) })
            }}
            onDelete={() => setConfirm('delete')}
            trigger={<Button variant="secondary">Mais ações</Button>}
          />
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="flex flex-col gap-6">
          <Panel title="Acesso">
            <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 px-5 py-4 text-[13.5px]">
              <dt className="text-fg-muted">Plano</dt>
              <dd>{planLabel(member.plan)}</dd>
              <dt className="text-fg-muted">Validade</dt>
              <dd>{isLifetime(member.expires_at) ? 'Vitalício' : `${formatDate(member.expires_at)} (${v.label.toLowerCase()})`}</dd>
              <dt className="text-fg-muted">Dispositivos</dt>
              <dd className="tabular-nums">
                {member.devices.length} de {member.max_devices} em uso
              </dd>
              <dt className="text-fg-muted">Situação</dt>
              <dd>{member.status === 'blocked' ? 'Bloqueado' : v.state === 'expired' ? 'Vencido' : 'Ativo'}</dd>
              <dt className="text-fg-muted">Atualizado</dt>
              <dd>{formatDateTime(member.updated_at)}</dd>
              {member.notes && (
                <>
                  <dt className="text-fg-muted">Observações</dt>
                  <dd className="whitespace-pre-wrap">{member.notes}</dd>
                </>
              )}
            </dl>
          </Panel>

          <Panel
            title="Dispositivos conectados"
            actions={
              can('members.devices') && member.devices.length > 0 ? (
                <Button size="sm" variant="ghost" onClick={() => setConfirm('disconnect')}>
                  Desconectar todos
                </Button>
              ) : undefined
            }
          >
            {member.devices.length === 0 ? (
              <EmptyState icon={<MonitorSmartphone />} title="Nenhum dispositivo conectado" description="Quando a pessoa entrar no app com o código, o aparelho aparece aqui." className="py-10" />
            ) : (
              <ul className="divide-y divide-line">
                {member.devices.map((d, i) => (
                  <li key={i} className="flex items-center justify-between gap-3 px-5 py-3 text-[13.5px]">
                    <div className="flex items-center gap-3">
                      <MonitorSmartphone className="size-4 text-fg-dim" />
                      <span>{d.device_name}</span>
                    </div>
                    <span className="text-[12.5px] text-fg-dim">visto {relativeTime(d.last_seen)}</span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        {can('audit.read') && (
          <Panel title="Histórico deste membro">
            <ActivityList entries={history.data?.entries ?? []} loading={history.isLoading} />
          </Panel>
        )}
      </div>

      <Dialog open={editing} onOpenChange={setEditing}>
        <DialogContent title={`Editar ${member.name}`} size="lg">
          <MemberForm
            member={member}
            onSubmit={async (input) => {
              await update.mutateAsync({ id: member.id, input })
              setEditing(false)
            }}
            onCancel={() => setEditing(false)}
            busy={update.isPending}
            submitLabel="Salvar"
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!ticket} onOpenChange={(o) => !o && setTicket(null)}>
        <DialogContent title="Código renovado" description="Envie o novo código. Depois de fechar, ele não pode mais ser consultado." hideClose>
          {ticket && <Ticket code={ticket} title={`Código de acesso · ${planLabel(member.plan)}`} subtitle={member.name} whatsappText={accessCodeMessage(member.name, member.plan, ticket)} />}
          <div className="mt-5 flex justify-end">
            <Button variant="primary" onClick={() => setTicket(null)}>Já enviei, fechar</Button>
          </div>
        </DialogContent>
      </Dialog>

      {confirm && (
        <ConfirmDialog
          open
          onOpenChange={(o) => !o && setConfirm(null)}
          title={copy[confirm].title}
          description={copy[confirm].description}
          confirmLabel={copy[confirm].label}
          tone={copy[confirm].tone}
          typeToConfirm={confirm === 'delete' ? member.name : undefined}
          onConfirm={runConfirm}
        />
      )}
    </div>
  )
}
