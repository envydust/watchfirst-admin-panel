import { Download, MoreHorizontal, Plus, RefreshCw, Search, UserRoundX, Users } from 'lucide-react'
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { toast } from 'sonner'
import type { Member, MemberInput } from '../../api/types'
import { useCan } from '../../auth/permissions'
import { PlanChip, StatusChip, ValidityChip } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { ConfirmDialog, Dialog, DialogContent } from '../../components/ui/dialog'
import { Input, Select } from '../../components/ui/field'
import { DropdownContent, DropdownItem, DropdownMenu, DropdownSeparator, DropdownTrigger } from '../../components/ui/menu'
import { EmptyState, Skeleton } from '../../components/ui/misc'
import { PageHeader, StatTile } from '../../components/ui/page'
import { Table, TBody, TD, TH, THead, TR } from '../../components/ui/table'
import { Ticket } from '../../components/ui/ticket'
import { downloadCsv } from '../../lib/csv'
import { DAY, formatDate, isLifetime, planLabel, relativeTime, statusLabel, validity } from '../../lib/format'
import { accessCodeMessage } from '../../lib/whatsapp'
import { useMemberMutations, useSnapshot } from './hooks'
import { MemberForm } from './MemberForm'

type SortKey = 'name' | 'plan' | 'status' | 'expires_at' | 'devices' | 'created_at'
const PAGE = 25

export function MembersPage() {
  const navigate = useNavigate()
  const can = useCan()
  const [params, setParams] = useSearchParams()
  const snapshot = useSnapshot()
  const { create, update, remove, rotate, disconnect } = useMemberMutations()

  const q = params.get('q') ?? ''
  const plan = params.get('plano') ?? ''
  const status = params.get('status') ?? ''
  const val = params.get('validade') ?? ''
  const sortKey = (params.get('ordem') as SortKey) || 'created_at'
  const sortDir = (params.get('dir') as 'asc' | 'desc') || 'desc'
  const page = Math.max(1, Number(params.get('p')) || 1)

  const setMany = (patch: Record<string, string>) => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        for (const [k, v] of Object.entries(patch)) {
          if (v) next.set(k, v)
          else next.delete(k)
          if (k !== 'p') next.delete('p')
        }
        return next
      },
      { replace: true },
    )
  }
  const setParam = (k: string, v: string) => setMany({ [k]: v })
  const toggleSort = (k: SortKey) => {
    const next = new URLSearchParams(params)
    if (sortKey === k) next.set('dir', sortDir === 'asc' ? 'desc' : 'asc')
    else {
      next.set('ordem', k)
      next.set('dir', k === 'name' ? 'asc' : 'desc')
    }
    setParams(next, { replace: true })
  }

  const now = Date.now()
  const all = snapshot.data?.members ?? []
  const stats = useMemo(() => {
    const active = all.filter((m) => m.status === 'active' && m.expires_at > now)
    return {
      active: active.length,
      basic: active.filter((m) => m.plan === 'basic').length,
      max: active.filter((m) => m.plan === 'max').length,
      soon: active.filter((m) => validity(m.expires_at, now).state === 'soon').length,
    }
  }, [all, now])

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    const list = all.filter((m) => {
      if (needle && !`${m.name} ${m.email} ${m.notes}`.toLowerCase().includes(needle)) return false
      if (plan && m.plan !== plan) return false
      if (status === 'active' && !(m.status === 'active' && m.expires_at > now)) return false
      if (status === 'blocked' && m.status !== 'blocked') return false
      if (status === 'expired' && !(m.status === 'active' && m.expires_at <= now)) return false
      if (val) {
        const s = validity(m.expires_at, now).state
        if (val === 'soon' && s !== 'soon') return false
        if (val === 'lifetime' && s !== 'lifetime') return false
        if (val === 'expired' && s !== 'expired') return false
        if (val === 'dated' && (s === 'lifetime' || s === 'expired')) return false
      }
      return true
    })
    const dir = sortDir === 'asc' ? 1 : -1
    list.sort((a, b) => {
      switch (sortKey) {
        case 'name':
          return a.name.localeCompare(b.name, 'pt-BR') * dir
        case 'plan':
          return a.plan.localeCompare(b.plan) * dir
        case 'status':
          return a.status.localeCompare(b.status) * dir
        case 'expires_at':
          return (a.expires_at - b.expires_at) * dir
        case 'devices':
          return (a.devices.length - b.devices.length) * dir
        default:
          return (a.created_at - b.created_at) * dir
      }
    })
    return list
  }, [all, q, plan, status, val, sortKey, sortDir, now])

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE))
  const slice = filtered.slice((page - 1) * PAGE, page * PAGE)
  const anyFilter = !!(q || plan || status || val)

  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<Member | null>(null)
  // "/membros/novo" lands here with ?novo=1 so the create dialog opens over the list.
  const wantsNew = params.get('novo') === '1'
  useEffect(() => {
    if (wantsNew) {
      setCreating(true)
      setParam('novo', '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wantsNew])
  const [ticket, setTicket] = useState<{ member: Pick<Member, 'name' | 'plan'>; code: string; kind: 'new' | 'rotate' } | null>(null)
  const [confirm, setConfirm] = useState<{ kind: 'rotate' | 'disconnect' | 'delete' | 'block' | 'unblock'; member: Member } | null>(null)

  async function onCreate(input: MemberInput) {
    const r = await create.mutateAsync(input)
    setCreating(false)
    setTicket({ member: { name: input.name, plan: input.plan }, code: r.code, kind: 'new' })
  }
  async function onEdit(input: MemberInput) {
    if (!editing) return
    await update.mutateAsync({ id: editing.id, input })
    setEditing(null)
  }
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
    if (!confirm) return
    const m = confirm.member
    if (confirm.kind === 'rotate') {
      const r = await rotate.mutateAsync(m.id)
      setTicket({ member: m, code: r.code, kind: 'rotate' })
    } else if (confirm.kind === 'disconnect') await disconnect.mutateAsync(m.id)
    else if (confirm.kind === 'delete') await remove.mutateAsync(m.id)
    else if (confirm.kind === 'block') await update.mutateAsync({ id: m.id, input: toInput(m, { status: 'blocked' }) })
    else if (confirm.kind === 'unblock') await update.mutateAsync({ id: m.id, input: toInput(m, { status: 'active' }) })
  }
  async function extend(m: Member, days: number) {
    const base = isLifetime(m.expires_at) ? null : Math.max(m.expires_at, now)
    if (base === null) return toast('Esse membro já é vitalício.')
    await update.mutateAsync({ id: m.id, input: toInput(m, { expiresAt: base + days * DAY }) })
  }
  function exportCsv() {
    downloadCsv(
      `membros-watchfirst-${formatDate(now, 'yyyy-MM-dd')}.csv`,
      ['Nome', 'E-mail', 'Plano', 'Situação', 'Validade', 'Dispositivos', 'Limite', 'Observações', 'Criado em'],
      filtered.map((m) => [
        m.name,
        m.email,
        planLabel(m.plan),
        statusLabel(m.status),
        isLifetime(m.expires_at) ? 'Vitalício' : formatDate(m.expires_at),
        m.devices.length,
        m.max_devices,
        m.notes,
        formatDate(m.created_at),
      ]),
    )
  }

  const confirmCopy = confirm && {
    rotate: {
      title: `Renovar o código de ${confirm.member.name}?`,
      description: 'O código atual deixa de funcionar e todos os dispositivos do app são desconectados. O novo código aparece uma única vez.',
      label: 'Renovar código',
      tone: 'default' as const,
    },
    disconnect: {
      title: `Desconectar os dispositivos de ${confirm.member.name}?`,
      description: `${confirm.member.devices.length} ${confirm.member.devices.length === 1 ? 'sessão ativa será encerrada' : 'sessões ativas serão encerradas'}. O código de acesso continua valendo e a pessoa pode entrar de novo.`,
      label: 'Desconectar',
      tone: 'default' as const,
    },
    block: {
      title: `Bloquear ${confirm.member.name}?`,
      description: 'O acesso para de funcionar imediatamente, no app e nos sites. Você pode liberar depois.',
      label: 'Bloquear',
      tone: 'danger' as const,
    },
    unblock: {
      title: `Liberar ${confirm.member.name}?`,
      description: 'O acesso volta a funcionar com o mesmo código, respeitando a validade.',
      label: 'Liberar',
      tone: 'default' as const,
    },
    delete: {
      title: `Excluir ${confirm.member.name}?`,
      description: 'Remove o cadastro, o código e as sessões em definitivo. Para apenas impedir o acesso, prefira bloquear.',
      label: 'Excluir membro',
      tone: 'danger' as const,
    },
  }[confirm.kind]

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Membros"
        description="Quem entra e o que cada um pode assistir."
        actions={
          <>
            <Button variant="ghost" icon={<RefreshCw className="size-4" />} onClick={() => void snapshot.refetch()} loading={snapshot.isFetching}>
              Atualizar
            </Button>
            <Button variant="ghost" icon={<Download className="size-4" />} onClick={exportCsv} disabled={filtered.length === 0}>
              CSV
            </Button>
            {can('members.write') && (
              <Button variant="primary" icon={<Plus className="size-4" />} onClick={() => setCreating(true)}>
                Novo membro
              </Button>
            )}
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile
          label="Membros ativos"
          value={stats.active}
          hint="Com acesso liberado"
          active={status === 'active' && !plan && !val}
          onClick={() => setMany({ status: status === 'active' && !plan && !val ? '' : 'active', plano: '', validade: '' })}
          loading={snapshot.isLoading}
        />
        <StatTile label="Básico" value={stats.basic} hint="Filmes, séries e animes" active={plan === 'basic'} onClick={() => setParam('plano', plan === 'basic' ? '' : 'basic')} loading={snapshot.isLoading} />
        <StatTile label="MAX" value={stats.max} hint="Experiência completa" active={plan === 'max'} onClick={() => setParam('plano', plan === 'max' ? '' : 'max')} loading={snapshot.isLoading} />
        <StatTile label="Vencem em 7 dias" value={stats.soon} tone={stats.soon > 0 ? 'amber' : 'neutral'} hint="Acompanhe as renovações" active={val === 'soon'} onClick={() => setParam('validade', val === 'soon' ? '' : 'soon')} loading={snapshot.isLoading} />
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-fg-dim" aria-hidden />
          <Input value={q} onChange={(e) => setParam('q', e.target.value)} placeholder="Buscar por nome, e-mail ou observação" className="pl-9" aria-label="Buscar membros" />
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:flex">
          <Select value={plan} onChange={(e) => setParam('plano', e.target.value)} aria-label="Plano" className="md:w-44">
            <option value="">Todos os planos</option>
            <option value="basic">Básico</option>
            <option value="max">MAX</option>
          </Select>
          <Select value={status} onChange={(e) => setParam('status', e.target.value)} aria-label="Situação" className="md:w-48">
            <option value="">Qualquer situação</option>
            <option value="active">Ativos</option>
            <option value="blocked">Bloqueados</option>
            <option value="expired">Vencidos</option>
          </Select>
          <Select value={val} onChange={(e) => setParam('validade', e.target.value)} aria-label="Validade" className="md:w-48">
            <option value="">Qualquer validade</option>
            <option value="soon">Vencem em 7 dias</option>
            <option value="dated">Com data</option>
            <option value="lifetime">Vitalícios</option>
            <option value="expired">Vencidos</option>
          </Select>
        </div>
      </div>

      {snapshot.isLoading ? (
        <Table>
          <THead>
            <tr>
              <TH>Membro</TH>
              <TH>Plano</TH>
              <TH>Situação</TH>
              <TH>Validade</TH>
              <TH>Dispositivos</TH>
              <TH className="w-12" />
            </tr>
          </THead>
          <TBody>
            {Array.from({ length: 6 }).map((_, i) => (
              <TR key={i}>
                <TD><Skeleton className="h-4 w-40" /><Skeleton className="mt-1.5 h-3 w-56" /></TD>
                <TD><Skeleton className="h-5 w-14" /></TD>
                <TD><Skeleton className="h-5 w-16" /></TD>
                <TD><Skeleton className="h-5 w-24" /></TD>
                <TD><Skeleton className="h-4 w-10" /></TD>
                <TD />
              </TR>
            ))}
          </TBody>
        </Table>
      ) : snapshot.isError ? (
        <EmptyState icon={<UserRoundX />} title="Não foi possível carregar os membros" description={(snapshot.error as Error).message} action={<Button onClick={() => void snapshot.refetch()}>Tentar de novo</Button>} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Users />}
          title={anyFilter ? 'Nenhum membro com esses filtros' : 'Nenhum membro ainda'}
          description={anyFilter ? 'Ajuste a busca ou limpe os filtros.' : 'Cadastre o primeiro membro: ele recebe um código de acesso para usar no app.'}
          action={
            anyFilter ? (
              <Button onClick={() => setParams({}, { replace: true })}>Limpar filtros</Button>
            ) : can('members.write') ? (
              <Button variant="primary" icon={<Plus className="size-4" />} onClick={() => setCreating(true)}>Novo membro</Button>
            ) : undefined
          }
        />
      ) : (
        <>
          {/* Phone: one card per member; the table needs more width than a phone has. */}
          <ul className="flex flex-col gap-2 md:hidden">
            {slice.map((m) => {
              const v = validity(m.expires_at, now)
              return (
                <li key={m.id} className="rounded-lg border border-line bg-panel p-4">
                  <div className="flex items-start justify-between gap-3">
                    <button type="button" onClick={() => navigate(`/membros/${m.id}`)} className="min-w-0 flex-1 text-left">
                      <p className="truncate text-[15px] font-medium">{m.name}</p>
                      <p className="truncate text-[12.5px] text-fg-dim">{m.email || 'sem e-mail'}</p>
                    </button>
                    <RowMenu
                      member={m}
                      onEdit={() => setEditing(m)}
                      onRotate={() => setConfirm({ kind: 'rotate', member: m })}
                      onDisconnect={() => setConfirm({ kind: 'disconnect', member: m })}
                      onBlock={() => setConfirm({ kind: m.status === 'blocked' ? 'unblock' : 'block', member: m })}
                      onExtend={(d) => void extend(m, d)}
                      onDelete={() => setConfirm({ kind: 'delete', member: m })}
                    />
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <PlanChip plan={m.plan} />
                    {m.status === 'blocked' ? <StatusChip status="blocked" /> : <ValidityChip state={v.state} label={v.state === 'ok' ? `Até ${v.label}` : v.label} />}
                    <span className="ml-auto text-[12.5px] tabular-nums text-fg-muted">
                      {m.devices.length}/{m.max_devices} {m.devices.length === 1 ? 'dispositivo' : 'dispositivos'}
                    </span>
                  </div>
                </li>
              )
            })}
          </ul>
          <Table className="hidden md:block">
            <THead>
              <tr>
                <TH sort={sortKey === 'name' ? sortDir : null} onSort={() => toggleSort('name')}>Membro</TH>
                <TH sort={sortKey === 'plan' ? sortDir : null} onSort={() => toggleSort('plan')}>Plano</TH>
                <TH sort={sortKey === 'status' ? sortDir : null} onSort={() => toggleSort('status')}>Situação</TH>
                <TH sort={sortKey === 'expires_at' ? sortDir : null} onSort={() => toggleSort('expires_at')}>Validade</TH>
                <TH sort={sortKey === 'devices' ? sortDir : null} onSort={() => toggleSort('devices')}>Dispositivos</TH>
                <TH className="w-12"><span className="sr-only">Ações</span></TH>
              </tr>
            </THead>
            <TBody>
              {slice.map((m) => {
                const v = validity(m.expires_at, now)
                const lastSeen = m.devices.reduce((acc, d) => Math.max(acc, d.last_seen), 0)
                return (
                  <TR key={m.id} onClick={() => navigate(`/membros/${m.id}`)}>
                    <TD>
                      <p className="font-medium">{m.name}</p>
                      <p className="text-[12.5px] text-fg-dim">{m.email || 'sem e-mail'}</p>
                    </TD>
                    <TD><PlanChip plan={m.plan} /></TD>
                    <TD>{m.status === 'blocked' ? <StatusChip status="blocked" /> : v.state === 'expired' ? <ValidityChip state="expired" label="Vencido" /> : <StatusChip status="active" />}</TD>
                    <TD>{m.status === 'blocked' && v.state === 'expired' ? <span className="text-fg-dim">{formatDate(m.expires_at)}</span> : <ValidityChip state={v.state} label={v.label} />}</TD>
                    <TD className="whitespace-nowrap">
                      <span className="tabular-nums">{m.devices.length}/{m.max_devices}</span>
                      {lastSeen > 0 && <span className="ml-2 hidden text-[12px] text-fg-dim xl:inline">visto {relativeTime(lastSeen)}</span>}
                    </TD>
                    <TD onClick={(e) => e.stopPropagation()}>
                      <RowMenu
                        member={m}
                        onEdit={() => setEditing(m)}
                        onRotate={() => setConfirm({ kind: 'rotate', member: m })}
                        onDisconnect={() => setConfirm({ kind: 'disconnect', member: m })}
                        onBlock={() => setConfirm({ kind: m.status === 'blocked' ? 'unblock' : 'block', member: m })}
                        onExtend={(d) => void extend(m, d)}
                        onDelete={() => setConfirm({ kind: 'delete', member: m })}
                      />
                    </TD>
                  </TR>
                )
              })}
            </TBody>
          </Table>
          <div className="flex flex-col items-center justify-between gap-3 text-[13px] text-fg-muted sm:flex-row">
            <span>
              {filtered.length} {filtered.length === 1 ? 'membro' : 'membros'}
              {anyFilter && ` de ${all.length}`}
            </span>
            {pages > 1 && (
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" disabled={page <= 1} onClick={() => setParam('p', String(page - 1))}>Anterior</Button>
                <span className="tabular-nums">{page} / {pages}</span>
                <Button size="sm" variant="ghost" disabled={page >= pages} onClick={() => setParam('p', String(page + 1))}>Próxima</Button>
              </div>
            )}
          </div>
        </>
      )}

      <Dialog open={creating} onOpenChange={setCreating}>
        <DialogContent title="Novo membro" description="Ao salvar, o código de acesso aparece uma única vez para você enviar." size="lg">
          <MemberForm onSubmit={onCreate} onCancel={() => setCreating(false)} busy={create.isPending} submitLabel="Cadastrar e gerar código" />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent title={editing ? `Editar ${editing.name}` : ''} size="lg">
          {editing && <MemberForm member={editing} onSubmit={onEdit} onCancel={() => setEditing(null)} busy={update.isPending} submitLabel="Salvar" />}
        </DialogContent>
      </Dialog>

      <Dialog open={!!ticket} onOpenChange={(o) => !o && setTicket(null)}>
        <DialogContent title={ticket?.kind === 'new' ? 'Membro cadastrado' : 'Código renovado'} description="Envie o código para a pessoa. Depois de fechar, ele não pode mais ser consultado." hideClose>
          {ticket && (
            <Ticket
              code={ticket.code}
              title={`Código de acesso · ${planLabel(ticket.member.plan)}`}
              subtitle={ticket.member.name}
              whatsappText={accessCodeMessage(ticket.member.name, ticket.member.plan, ticket.code)}
            />
          )}
          <div className="mt-5 flex justify-end">
            <Button variant="primary" onClick={() => setTicket(null)}>Já enviei, fechar</Button>
          </div>
        </DialogContent>
      </Dialog>

      {confirm && confirmCopy && (
        <ConfirmDialog
          open
          onOpenChange={(o) => !o && setConfirm(null)}
          title={confirmCopy.title}
          description={confirmCopy.description}
          confirmLabel={confirmCopy.label}
          tone={confirmCopy.tone}
          typeToConfirm={confirm.kind === 'delete' ? confirm.member.name : undefined}
          onConfirm={runConfirm}
        />
      )}
    </div>
  )
}

export function RowMenu({
  member,
  onEdit,
  onRotate,
  onDisconnect,
  onBlock,
  onExtend,
  onDelete,
  trigger,
}: {
  member: Member
  onEdit: () => void
  onRotate: () => void
  onDisconnect: () => void
  onBlock: () => void
  onExtend: (days: number) => void
  onDelete: () => void
  trigger?: ReactNode
}) {
  const can = useCan()
  const lifetime = isLifetime(member.expires_at)
  return (
    <DropdownMenu>
      <DropdownTrigger asChild>
        {trigger ?? (
          <Button variant="ghost" size="icon" aria-label={`Ações de ${member.name}`}>
            <MoreHorizontal className="size-4" />
          </Button>
        )}
      </DropdownTrigger>
      <DropdownContent>
        {can('members.write') && <DropdownItem onSelect={onEdit}>Editar</DropdownItem>}
        {can('members.write') && !lifetime && (
          <>
            <DropdownItem onSelect={() => onExtend(30)}>Estender +30 dias</DropdownItem>
            <DropdownItem onSelect={() => onExtend(90)}>Estender +90 dias</DropdownItem>
          </>
        )}
        {can('members.codes') && <DropdownItem onSelect={onRotate}>Renovar código</DropdownItem>}
        {can('members.devices') && <DropdownItem onSelect={onDisconnect} disabled={member.devices.length === 0}>Desconectar dispositivos</DropdownItem>}
        {can('members.write') && (
          <DropdownItem onSelect={onBlock} tone={member.status === 'blocked' ? 'default' : 'danger'}>
            {member.status === 'blocked' ? 'Liberar acesso' : 'Bloquear acesso'}
          </DropdownItem>
        )}
        {can('members.delete') && (
          <>
            <DropdownSeparator />
            <DropdownItem onSelect={onDelete} tone="danger">Excluir membro</DropdownItem>
          </>
        )}
      </DropdownContent>
    </DropdownMenu>
  )
}
