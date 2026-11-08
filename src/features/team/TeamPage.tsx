import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { MoreHorizontal, Plus, ShieldCheck, UserRound } from 'lucide-react'
import { useMemo, useState, type FormEvent } from 'react'
import { toast } from 'sonner'
import { team as teamApi, type UserInput } from '../../api/endpoints'
import type { AdminUser, PermissionId, PermissionInfo, Role } from '../../api/types'
import { keys } from '../../app/queryClient'
import { useSession } from '../../auth/session'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { ConfirmDialog, Dialog, DialogContent, DialogFooter } from '../../components/ui/dialog'
import { Field, Input } from '../../components/ui/field'
import { DropdownContent, DropdownItem, DropdownMenu, DropdownSeparator, DropdownTrigger } from '../../components/ui/menu'
import { EmptyState, Skeleton } from '../../components/ui/misc'
import { PageHeader } from '../../components/ui/page'
import { Table, TBody, TD, TH, THead, TR } from '../../components/ui/table'
import { Ticket } from '../../components/ui/ticket'
import { cn } from '../../lib/cn'
import { initials, relativeTime } from '../../lib/format'
import { temporaryPasswordMessage } from '../../lib/whatsapp'

export function TeamPage() {
  const qc = useQueryClient()
  const session = useSession()
  const q = useQuery({ queryKey: keys.users, queryFn: teamApi.list })
  const invalidate = () => qc.invalidateQueries({ queryKey: keys.users })
  const onError = (e: Error) => toast.error(e.message)
  const create = useMutation({ mutationFn: teamApi.create, onSuccess: invalidate, onError })
  const update = useMutation({ mutationFn: ({ id, input }: { id: string; input: UserInput }) => teamApi.update(id, input), onSuccess: () => { invalidate(); toast.success('Conta atualizada.') }, onError })
  const remove = useMutation({ mutationFn: teamApi.remove, onSuccess: () => { invalidate(); toast.success('Conta removida.') }, onError })
  const reset = useMutation({ mutationFn: teamApi.resetPassword, onSuccess: invalidate, onError })
  const endSessions = useMutation({ mutationFn: teamApi.endSessions, onSuccess: () => { invalidate(); toast.success('Sessões encerradas.') }, onError })

  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<AdminUser | null>(null)
  const [ticket, setTicket] = useState<{ user: Pick<AdminUser, 'name' | 'email'>; password: string; kind: 'new' | 'reset' } | null>(null)
  const [confirm, setConfirm] = useState<{ kind: 'disable' | 'enable' | 'delete' | 'reset' | 'sessions'; user: AdminUser } | null>(null)

  const users = q.data?.users ?? []
  const catalog = q.data?.permissionsCatalog ?? []
  const panelUrl = `${location.origin}${import.meta.env.BASE_URL}`

  async function runConfirm() {
    if (!confirm) return
    const u = confirm.user
    if (confirm.kind === 'disable') await update.mutateAsync({ id: u.id, input: { status: 'disabled' } })
    else if (confirm.kind === 'enable') await update.mutateAsync({ id: u.id, input: { status: 'active' } })
    else if (confirm.kind === 'delete') await remove.mutateAsync(u.id)
    else if (confirm.kind === 'sessions') await endSessions.mutateAsync(u.id)
    else if (confirm.kind === 'reset') setTicket({ user: u, password: (await reset.mutateAsync(u.id)).temporaryPassword, kind: 'reset' })
  }
  const copy = confirm && {
    disable: { title: `Desativar ${confirm.user.name}?`, description: 'A pessoa é desconectada agora e não consegue mais entrar até você reativar.', label: 'Desativar', tone: 'danger' as const },
    enable: { title: `Reativar ${confirm.user.name}?`, description: 'A conta volta a funcionar com a mesma senha e as mesmas permissões.', label: 'Reativar', tone: 'default' as const },
    delete: { title: `Remover ${confirm.user.name}?`, description: 'A conta e as sessões são apagadas. O histórico de atividade continua mostrando o nome.', label: 'Remover conta', tone: 'danger' as const },
    reset: { title: `Redefinir a senha de ${confirm.user.name}?`, description: 'Gera uma senha temporária, exibida uma única vez, e encerra as sessões atuais. No próximo acesso a pessoa escolhe uma senha nova.', label: 'Redefinir', tone: 'default' as const },
    sessions: { title: `Encerrar as sessões de ${confirm.user.name}?`, description: 'A pessoa precisa entrar de novo em todos os dispositivos. A senha continua a mesma.', label: 'Encerrar sessões', tone: 'default' as const },
  }[confirm.kind]

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Equipe e permissões"
        description="Quem pode entrar no painel e o que cada pessoa pode fazer. Só o dono vê esta tela."
        primary={
          <Button variant="primary" icon={<Plus className="size-4" />} onClick={() => setCreating(true)}>
            Nova conta
          </Button>
        }
      />

      {q.isLoading ? (
        <Table>
          <THead><tr><TH>Pessoa</TH><TH>Papel</TH><TH>Permissões</TH><TH>Último acesso</TH><TH className="w-12" /></tr></THead>
          <TBody>{Array.from({ length: 3 }).map((_, i) => (<TR key={i}><TD><Skeleton className="h-4 w-40" /></TD><TD><Skeleton className="h-5 w-16" /></TD><TD><Skeleton className="h-4 w-48" /></TD><TD><Skeleton className="h-4 w-24" /></TD><TD /></TR>))}</TBody>
        </Table>
      ) : q.isError ? (
        <EmptyState title="Não foi possível carregar a equipe" description={(q.error as Error).message} action={<Button onClick={() => void q.refetch()}>Tentar de novo</Button>} />
      ) : (
        <Table>
          <THead>
            <tr>
              <TH>Pessoa</TH>
              <TH>Papel</TH>
              <TH>Permissões</TH>
              <TH>Último acesso</TH>
              <TH className="w-12"><span className="sr-only">Ações</span></TH>
            </tr>
          </THead>
          <TBody>
            {users.map((u) => {
              const me = u.id === session?.user.id
              const perms = u.role === 'owner' ? [] : (u.permissions.filter((p) => p !== '*') as PermissionId[])
              return (
                <TR key={u.id} className={cn(u.status === 'disabled' && 'opacity-60')}>
                  <TD>
                    <div className="flex items-center gap-3">
                      <span className="grid size-8 place-items-center rounded-full bg-raised text-[12px] font-bold text-accent-soft ring-1 ring-line-strong">{initials(u.name)}</span>
                      <div>
                        <p className="font-medium">
                          {u.name} {me && <span className="text-[12px] font-normal text-fg-dim">(você)</span>}
                        </p>
                        <p className="text-[12.5px] text-fg-dim">{u.email}</p>
                      </div>
                    </div>
                  </TD>
                  <TD>
                    <div className="flex items-center gap-2">
                      {u.role === 'owner' ? <Badge tone="accent"><ShieldCheck className="size-3" /> Dono</Badge> : <Badge tone="neutral"><UserRound className="size-3" /> Suporte</Badge>}
                      {u.status === 'disabled' && <Badge tone="red">Desativada</Badge>}
                      {u.mustChangePassword && u.status === 'active' && <Badge tone="amber">Senha temporária</Badge>}
                    </div>
                  </TD>
                  <TD className="max-w-xs">
                    {u.role === 'owner' ? (
                      <span className="text-fg-muted">Tudo</span>
                    ) : perms.length === 0 ? (
                      <span className="text-fg-dim">Nenhuma</span>
                    ) : (
                      <span className="text-[13px] text-fg-muted">{perms.map((p) => catalog.find((c) => c.id === p)?.label ?? p).join(' · ')}</span>
                    )}
                  </TD>
                  <TD className="text-fg-muted">
                    {u.lastLoginAt ? relativeTime(u.lastLoginAt) : 'Nunca entrou'}
                    {!!u.activeSessions && <span className="ml-2 text-[12px] text-fg-dim">{u.activeSessions} {u.activeSessions === 1 ? 'sessão' : 'sessões'}</span>}
                  </TD>
                  <TD>
                    <DropdownMenu>
                      <DropdownTrigger asChild>
                        <Button variant="ghost" size="icon" aria-label={`Ações de ${u.name}`}><MoreHorizontal className="size-4" /></Button>
                      </DropdownTrigger>
                      <DropdownContent>
                        <DropdownItem onSelect={() => setEditing(u)}>{me ? 'Editar nome' : 'Editar permissões'}</DropdownItem>
                        {!me && <DropdownItem onSelect={() => setConfirm({ kind: 'reset', user: u })}>Redefinir senha</DropdownItem>}
                        <DropdownItem onSelect={() => setConfirm({ kind: 'sessions', user: u })} disabled={!u.activeSessions}>Encerrar sessões</DropdownItem>
                        {!me && (
                          <>
                            <DropdownSeparator />
                            <DropdownItem onSelect={() => setConfirm({ kind: u.status === 'disabled' ? 'enable' : 'disable', user: u })} tone={u.status === 'disabled' ? 'default' : 'danger'}>
                              {u.status === 'disabled' ? 'Reativar conta' : 'Desativar conta'}
                            </DropdownItem>
                            <DropdownItem onSelect={() => setConfirm({ kind: 'delete', user: u })} tone="danger">Remover conta</DropdownItem>
                          </>
                        )}
                      </DropdownContent>
                    </DropdownMenu>
                  </TD>
                </TR>
              )
            })}
          </TBody>
        </Table>
      )}

      <Dialog open={creating} onOpenChange={setCreating}>
        <DialogContent title="Nova conta" description="A pessoa recebe uma senha temporária, exibida uma única vez, e escolhe a definitiva no primeiro acesso." size="lg">
          <UserForm
            catalog={catalog}
            busy={create.isPending}
            onCancel={() => setCreating(false)}
            onSubmit={async (input) => {
              const r = await create.mutateAsync({ email: input.email!, name: input.name!, role: input.role!, permissions: input.permissions ?? [] })
              setCreating(false)
              setTicket({ user: { name: input.name!, email: input.email! }, password: r.temporaryPassword, kind: 'new' })
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent title={editing ? `Editar ${editing.name}` : ''} size="lg">
          {editing && (
            <UserForm
              user={editing}
              selfOnly={editing.id === session?.user.id}
              catalog={catalog}
              busy={update.isPending}
              onCancel={() => setEditing(null)}
              onSubmit={async (input) => {
                await update.mutateAsync({ id: editing.id, input })
                setEditing(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!ticket} onOpenChange={(o) => !o && setTicket(null)}>
        <DialogContent title={ticket?.kind === 'new' ? 'Conta criada' : 'Senha redefinida'} description="Envie a senha temporária para a pessoa. Depois de fechar, ela não pode mais ser consultada." hideClose>
          {ticket && (
            <Ticket
              code={ticket.password}
              title="Senha temporária"
              subtitle={`${ticket.user.name} · ${ticket.user.email}`}
              whatsappText={temporaryPasswordMessage(ticket.user.name, ticket.user.email, ticket.password, panelUrl)}
              footer={<>Endereço do painel: <span className="select-all text-fg">{panelUrl}</span></>}
            />
          )}
          <div className="mt-5 flex justify-end">
            <Button variant="primary" onClick={() => setTicket(null)}>Já enviei, fechar</Button>
          </div>
        </DialogContent>
      </Dialog>

      {confirm && copy && (
        <ConfirmDialog open onOpenChange={(o) => !o && setConfirm(null)} title={copy.title} description={copy.description} confirmLabel={copy.label} tone={copy.tone} typeToConfirm={confirm.kind === 'delete' ? confirm.user.name : undefined} onConfirm={runConfirm} />
      )}
    </div>
  )
}

function UserForm({ user, selfOnly, catalog, onSubmit, onCancel, busy }: { user?: AdminUser; selfOnly?: boolean; catalog: PermissionInfo[]; onSubmit: (i: UserInput) => Promise<unknown>; onCancel: () => void; busy: boolean }) {
  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [role, setRole] = useState<Role>(user?.role ?? 'staff')
  const [perms, setPerms] = useState<Set<PermissionId>>(new Set((user?.permissions.filter((p) => p !== '*') as PermissionId[]) ?? []))
  const [error, setError] = useState('')
  const groups = useMemo(() => {
    const g = new Map<string, PermissionInfo[]>()
    for (const p of catalog) if (!p.ownerOnly) g.set(p.group, [...(g.get(p.group) ?? []), p])
    return [...g.entries()]
  }, [catalog])
  const toggle = (id: PermissionId) => setPerms((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })
  const toggleGroup = (items: PermissionInfo[]) => setPerms((s) => { const n = new Set(s); const all = items.every((p) => n.has(p.id)); for (const p of items) all ? n.delete(p.id) : n.add(p.id); return n })

  async function submit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (!name.trim()) return setError('Informe o nome.')
    if (!user && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError('E-mail inválido.')
    if (selfOnly) return onSubmit({ name: name.trim() })
    await onSubmit({ ...(user ? {} : { email: email.trim().toLowerCase() }), name: name.trim(), role, permissions: role === 'owner' ? [] : [...perms] })
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-5" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nome">{(p) => <Input {...p} value={name} onChange={(e) => setName(e.target.value)} autoFocus maxLength={100} />}</Field>
        <Field label="E-mail" hint={user ? 'O e-mail não pode ser alterado.' : 'Será o login da pessoa.'}>
          {(p) => <Input {...p} type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={!!user} />}
        </Field>
      </div>
      {!selfOnly && (
        <>
          <fieldset className="flex flex-col gap-1.5">
            <legend className="text-[13px] font-medium text-fg-muted">Papel</legend>
            <div className="grid grid-cols-2 gap-2">
              {(['staff', 'owner'] as Role[]).map((r) => (
                <label key={r} className={cn('flex cursor-pointer flex-col gap-0.5 rounded-md border px-3.5 py-3 transition-colors', role === r ? 'border-accent bg-accent-dim' : 'border-line-strong hover:border-[rgba(255,255,255,0.22)]')}>
                  <input type="radio" name="role" value={r} checked={role === r} onChange={() => setRole(r)} className="sr-only" />
                  <span className="text-[14px] font-semibold">{r === 'owner' ? 'Dono' : 'Suporte'}</span>
                  <span className="text-[12.5px] text-fg-muted">{r === 'owner' ? 'Pode tudo, inclusive gerenciar a equipe.' : 'Só o que for marcado abaixo.'}</span>
                </label>
              ))}
            </div>
          </fieldset>
          {role === 'staff' && (
            <fieldset className="flex flex-col gap-3">
              <legend className="text-[13px] font-medium text-fg-muted">Permissões</legend>
              {groups.map(([group, items]) => {
                const all = items.every((p) => perms.has(p.id))
                return (
                  <div key={group} className="rounded-md border border-line">
                    <button type="button" onClick={() => toggleGroup(items)} className="flex w-full items-center justify-between px-3.5 py-2.5 text-left text-[13px] font-semibold hover:bg-[rgba(255,255,255,0.03)]">
                      {group}
                      <span className="text-[12px] font-normal text-fg-dim">{all ? 'Desmarcar tudo' : 'Marcar tudo'}</span>
                    </button>
                    <ul className="divide-y divide-line border-t border-line">
                      {items.map((p) => (
                        <li key={p.id}>
                          <label className="flex cursor-pointer items-start gap-3 px-3.5 py-2.5 hover:bg-[rgba(255,255,255,0.03)]">
                            <input type="checkbox" checked={perms.has(p.id)} onChange={() => toggle(p.id)} className="mt-0.5 size-4 shrink-0 rounded-sm" />
                            <span>
                              <span className="block text-[13.5px]">{p.label}</span>
                              <span className="block text-[12.5px] text-fg-dim">{p.description}</span>
                            </span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </fieldset>
          )}
        </>
      )}
      {error && <p role="alert" className="text-[13px] text-red">{error}</p>}
      <DialogFooter>
        <Button variant="ghost" onClick={onCancel} disabled={busy}>Cancelar</Button>
        <Button type="submit" variant="primary" loading={busy}>{user ? 'Salvar' : 'Criar conta e gerar senha'}</Button>
      </DialogFooter>
    </form>
  )
}
