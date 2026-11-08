import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowDown, ArrowUp, Clapperboard, MoreHorizontal, Plus, Radio, RotateCcw } from 'lucide-react'
import { useState, type FormEvent, type ReactNode } from 'react'
import { toast } from 'sonner'
import { addons as addonsApi } from '../../api/endpoints'
import type { Addon, AddonContent, AddonInput, AddonKind, Plan } from '../../api/types'
import { keys } from '../../app/queryClient'
import { Badge, PlanChip } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { ConfirmDialog, Dialog, DialogContent, DialogFooter } from '../../components/ui/dialog'
import { Field, Input, Select } from '../../components/ui/field'
import { DropdownContent, DropdownItem, DropdownMenu, DropdownSeparator, DropdownTrigger } from '../../components/ui/menu'
import { EmptyState, Skeleton, Switch } from '../../components/ui/misc'
import { PageHeader, Panel } from '../../components/ui/page'
import { cn } from '../../lib/cn'
import { useSnapshot } from '../members/hooks'

const toInput = (a: Addon, patch: Partial<AddonInput> = {}): AddonInput => ({
  name: a.name,
  url: a.url,
  kind: a.kind,
  content: a.content,
  minPlan: a.min_plan,
  enabled: a.enabled === 1,
  sortOrder: a.sort_order,
  ...patch,
})

export function AddonsPage() {
  const qc = useQueryClient()
  const snapshot = useSnapshot()
  const invalidate = () => qc.invalidateQueries({ queryKey: keys.snapshot })
  const onError = (e: Error) => toast.error(e.message)
  const save = useMutation({
    mutationFn: ({ id, input }: { id?: string; input: AddonInput }) => (id ? addonsApi.update(id, input) : addonsApi.create(input)),
    onSuccess: invalidate,
    onError,
  })
  const remove = useMutation({ mutationFn: addonsApi.remove, onSuccess: () => { invalidate(); toast.success('Addon removido.') }, onError })
  const restore = useMutation({ mutationFn: addonsApi.restoreDefaults, onSuccess: () => { invalidate(); toast.success('Addons padrão restaurados.') }, onError })

  const [editing, setEditing] = useState<{ addon?: Addon; content: AddonContent } | null>(null)
  const [removing, setRemoving] = useState<Addon | null>(null)
  const [restoring, setRestoring] = useState(false)

  const list = (snapshot.data?.addons ?? []).slice().sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name))
  const vod = list.filter((a) => a.content === 'vod')
  const live = list.filter((a) => a.content === 'live')

  async function move(a: Addon, dir: -1 | 1, group: Addon[]) {
    const i = group.indexOf(a)
    const other = group[i + dir]
    if (!other) return
    await Promise.all([
      save.mutateAsync({ id: a.id, input: toInput(a, { sortOrder: other.sort_order === a.sort_order ? a.sort_order + dir : other.sort_order }) }),
      save.mutateAsync({ id: other.id, input: toInput(other, { sortOrder: a.sort_order }) }),
    ])
  }

  const sectionProps = {
    loading: snapshot.isLoading,
    busy: save.isPending,
    onAdd: (content: AddonContent) => setEditing({ content }),
    onEdit: (a: Addon) => setEditing({ addon: a, content: a.content }),
    onRemove: (a: Addon) => setRemoving(a),
    onToggle: (a: Addon, v: boolean) => save.mutate({ id: a.id, input: toInput(a, { enabled: v }) }),
    onMove: (a: Addon, dir: -1 | 1, group: Addon[]) => void move(a, dir, group),
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Addons e conteúdo"
        description="Os catálogos que o app recebe, por plano. Alterações valem na próxima vez que o app sincronizar."
        actions={
          <Button variant="ghost" icon={<RotateCcw className="size-4" />} onClick={() => setRestoring(true)}>
            Restaurar padrão
          </Button>
        }
      />
      <AddonSection {...sectionProps} title="Filmes, séries e animes" icon={<Clapperboard />} items={vod} content="vod" hint="Disponíveis no Básico e no MAX, conforme o plano mínimo de cada addon. Só conteúdo sob demanda passa pelo gateway." />
      <AddonSection {...sectionProps} title="Canais ao vivo" icon={<Radio />} items={live} content="live" hint="Exclusivos do plano MAX. Precisam ser addons Stremio." />

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent title={editing?.addon ? `Editar ${editing.addon.name}` : editing?.content === 'live' ? 'Adicionar canal ao vivo' : 'Adicionar addon'} description="O serviço baixa e valida o manifesto antes de salvar.">
          {editing && (
            <AddonForm
              addon={editing.addon}
              content={editing.content}
              busy={save.isPending}
              onCancel={() => setEditing(null)}
              onSubmit={async (input) => {
                await save.mutateAsync({ id: editing.addon?.id, input })
                setEditing(null)
                toast.success(editing.addon ? 'Addon atualizado.' : 'Addon adicionado.')
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!removing}
        onOpenChange={(o) => !o && setRemoving(null)}
        title={`Remover ${removing?.name ?? ''}?`}
        description="O addon some do app de todos os membros na próxima sincronização. Para pausar sem remover, desative-o."
        confirmLabel="Remover"
        tone="danger"
        onConfirm={() => removing && remove.mutateAsync(removing.id)}
      />
      <ConfirmDialog
        open={restoring}
        onOpenChange={setRestoring}
        title="Restaurar os addons padrão?"
        description="Recadastra os cinco addons originais do WATCHFIRST que estiverem faltando. Os existentes não são alterados."
        confirmLabel="Restaurar"
        onConfirm={() => restore.mutateAsync()}
      />
    </div>
  )
}

function AddonSection({
  title,
  icon,
  items,
  content,
  hint,
  loading,
  busy,
  onAdd,
  onEdit,
  onRemove,
  onToggle,
  onMove,
}: {
  title: string
  icon: ReactNode
  items: Addon[]
  content: AddonContent
  hint: string
  loading: boolean
  busy: boolean
  onAdd: (content: AddonContent) => void
  onEdit: (a: Addon) => void
  onRemove: (a: Addon) => void
  onToggle: (a: Addon, v: boolean) => void
  onMove: (a: Addon, dir: -1 | 1, group: Addon[]) => void
}) {
  return (
    <Panel
      title={
        <span className="inline-flex items-center gap-2">
          <span className="text-fg-dim [&>svg]:size-4">{icon}</span>
          {title}
          <span className="text-[12.5px] font-normal text-fg-dim">{items.length}</span>
        </span>
      }
      actions={
        <Button size="sm" icon={<Plus className="size-4" />} onClick={() => onAdd(content)}>
          Adicionar
        </Button>
      }
    >
      <p className="border-b border-line px-5 py-2.5 text-[12.5px] text-fg-dim">{hint}</p>
      {loading ? (
        <div className="flex flex-col gap-3 p-5">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-6 w-1/2" />
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={icon}
          title={content === 'live' ? 'Nenhum canal ao vivo ainda' : 'Nenhum addon'}
          description={content === 'live' ? 'Addons ao vivo exigem o plano MAX e aparecem na área ao vivo do app.' : 'Adicione um manifesto Stremio ou um plugin Nuvio.'}
          className="py-10"
        />
      ) : (
        <ul className="divide-y divide-line">
          {items.map((a, i) => (
            <li key={a.id} className={cn('flex items-center gap-3 px-5 py-3', a.enabled === 0 && 'opacity-60')}>
              <div className="flex flex-col">
                <button type="button" className="text-fg-dim hover:text-fg disabled:opacity-30" aria-label="Mover para cima" disabled={i === 0 || busy} onClick={() => onMove(a, -1, items)}>
                  <ArrowUp className="size-3.5" />
                </button>
                <button type="button" className="text-fg-dim hover:text-fg disabled:opacity-30" aria-label="Mover para baixo" disabled={i === items.length - 1 || busy} onClick={() => onMove(a, 1, items)}>
                  <ArrowDown className="size-3.5" />
                </button>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[14px] font-medium">{a.name}</p>
                  <PlanChip plan={a.min_plan} className="h-5 text-[10.5px]" />
                  <Badge tone="neutral">{a.kind === 'stremio' ? 'Stremio' : 'Plugin Nuvio'}</Badge>
                </div>
                <p className="truncate text-[12.5px] text-fg-dim" title={a.url}>
                  {a.url}
                </p>
              </div>
              <Switch checked={a.enabled === 1} label={`${a.enabled ? 'Desativar' : 'Ativar'} ${a.name}`} disabled={busy} onCheckedChange={(v) => onToggle(a, v)} />
              <DropdownMenu>
                <DropdownTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label={`Ações de ${a.name}`}>
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownTrigger>
                <DropdownContent>
                  <DropdownItem onSelect={() => onEdit(a)}>Editar</DropdownItem>
                  <DropdownSeparator />
                  <DropdownItem tone="danger" onSelect={() => onRemove(a)}>
                    Remover
                  </DropdownItem>
                </DropdownContent>
              </DropdownMenu>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  )
}

function AddonForm({ addon, content, onSubmit, onCancel, busy }: { addon?: Addon; content: AddonContent; onSubmit: (i: AddonInput) => Promise<unknown>; onCancel: () => void; busy: boolean }) {
  const [name, setName] = useState(addon?.name ?? '')
  const [url, setUrl] = useState(addon?.url ?? '')
  const [kind, setKind] = useState<AddonKind>(addon?.kind ?? 'stremio')
  const [minPlan, setMinPlan] = useState<Plan>(content === 'live' ? 'max' : addon?.min_plan ?? 'basic')
  const [error, setError] = useState('')
  async function submit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (!name.trim()) return setError('Informe o nome.')
    if (!/^https:\/\/.+\/manifest\.json$/i.test(url.trim())) return setError('O endereço precisa ser HTTPS e terminar em /manifest.json.')
    await onSubmit({ name: name.trim(), url: url.trim(), kind: content === 'live' ? 'stremio' : kind, content, minPlan: content === 'live' ? 'max' : minPlan, enabled: addon ? addon.enabled === 1 : true, sortOrder: addon?.sort_order ?? 100 })
  }
  return (
    <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
      <Field label="Nome">{(p) => <Input {...p} value={name} onChange={(e) => setName(e.target.value)} autoFocus maxLength={100} />}</Field>
      <Field label="Endereço do manifesto" hint="https://…/manifest.json">
        {(p) => <Input {...p} type="url" inputMode="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://exemplo.com/manifest.json" />}
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Tipo" hint={content === 'live' ? 'Canais ao vivo são sempre Stremio.' : undefined}>
          {(p) => (
            <Select {...p} value={content === 'live' ? 'stremio' : kind} onChange={(e) => setKind(e.target.value as AddonKind)} disabled={content === 'live'}>
              <option value="stremio">Addon Stremio</option>
              <option value="plugin">Plugin Nuvio</option>
            </Select>
          )}
        </Field>
        <Field label="Plano mínimo" hint={content === 'live' ? 'Ao vivo exige MAX.' : undefined}>
          {(p) => (
            <Select {...p} value={content === 'live' ? 'max' : minPlan} onChange={(e) => setMinPlan(e.target.value as Plan)} disabled={content === 'live'}>
              <option value="basic">Básico e MAX</option>
              <option value="max">Só MAX</option>
            </Select>
          )}
        </Field>
      </div>
      {error && <p role="alert" className="text-[13px] text-red">{error}</p>}
      <DialogFooter>
        <Button variant="ghost" onClick={onCancel} disabled={busy}>Cancelar</Button>
        <Button type="submit" variant="primary" loading={busy}>{addon ? 'Salvar' : 'Adicionar'}</Button>
      </DialogFooter>
    </form>
  )
}
