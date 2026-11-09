import { useState, type FormEvent } from 'react'
import type { Member, MemberInput, Plan } from '../../api/types'
import { Button } from '../../components/ui/button'
import { DialogFooter } from '../../components/ui/dialog'
import { Field, Input, Select, Textarea } from '../../components/ui/field'
import { cn } from '../../lib/cn'
import { DAY, displayEmail, isLifetime } from '../../lib/format'

type Preset = 30 | 90 | 365 | 'lifetime' | 'custom'

function toInputDate(ts: number) {
  const d = new Date(ts)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
function fromInputDate(s: string) {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, (m ?? 1) - 1, d ?? 1, 23, 59, 59, 999).getTime()
}

export function MemberForm({
  member,
  onSubmit,
  onCancel,
  busy,
  submitLabel,
}: {
  member?: Member
  onSubmit: (input: MemberInput) => Promise<unknown> | unknown
  onCancel?: () => void
  busy?: boolean
  submitLabel: string
}) {
  const initialPreset: Preset = member ? (isLifetime(member.expires_at) ? 'lifetime' : 'custom') : 'lifetime'
  const [name, setName] = useState(member?.name ?? '')
  const [email, setEmail] = useState(displayEmail(member?.email ?? ''))
  const [plan, setPlan] = useState<Plan>(member?.plan ?? 'basic')
  const [status, setStatus] = useState<'active' | 'blocked'>(member?.status ?? 'active')
  const [preset, setPreset] = useState<Preset>(initialPreset)
  const [date, setDate] = useState(member && !isLifetime(member.expires_at) ? toInputDate(member.expires_at) : toInputDate(Date.now() + 30 * DAY))
  const [devices, setDevices] = useState(member?.max_devices ?? 1)
  const [notes, setNotes] = useState(member?.notes ?? '')
  const [errors, setErrors] = useState<Record<string, string>>({})

  function pick(p: Preset) {
    setPreset(p)
    if (typeof p === 'number') setDate(toInputDate(Date.now() + p * DAY))
  }

  async function submit(e: FormEvent) {
    e.preventDefault()
    const next: Record<string, string> = {}
    if (!name.trim()) next.name = 'Informe o nome.'
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = 'E-mail inválido.'
    if (preset !== 'lifetime' && (!date || fromInputDate(date) <= Date.now())) next.date = 'Escolha uma data futura.'
    setErrors(next)
    if (Object.keys(next).length) return
    await onSubmit({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      plan,
      status,
      ...(preset === 'lifetime' ? { lifetime: true } : { expiresAt: fromInputDate(date) }),
      maxDevices: devices,
      notes: notes.trim(),
    })
  }

  const presets: Array<{ v: Preset; label: string }> = [
    { v: 30, label: '30 dias' },
    { v: 90, label: '90 dias' },
    { v: 365, label: '1 ano' },
    { v: 'lifetime', label: 'Vitalício' },
    { v: 'custom', label: 'Data…' },
  ]

  return (
    <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nome" error={errors.name}>
          {(p) => <Input {...p} value={name} onChange={(e) => setName(e.target.value)} autoFocus={!member} maxLength={100} />}
        </Field>
        <Field label="E-mail" hint="Usado para reconhecer solicitações de acesso." error={errors.email}>
          {(p) => <Input {...p} type="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={254} />}
        </Field>
      </div>

      <fieldset className="flex flex-col gap-1.5">
        <legend className="text-[13px] font-medium text-fg-muted">Plano</legend>
        <div className="grid grid-cols-2 gap-2">
          {(['basic', 'max'] as Plan[]).map((p) => (
            <label
              key={p}
              className={cn(
                'flex cursor-pointer flex-col gap-0.5 rounded-md border px-3.5 py-3 transition-colors',
                plan === p ? 'border-accent bg-accent-dim' : 'border-line-strong hover:border-[rgba(255,255,255,0.22)]',
              )}
            >
              <input type="radio" name="plan" value={p} checked={plan === p} onChange={() => setPlan(p)} className="sr-only" />
              <span className="text-[14px] font-semibold">{p === 'max' ? 'MAX' : 'Básico'}</span>
              <span className="text-[12.5px] text-fg-muted">{p === 'max' ? 'Tudo do Básico + exclusivos e área ao vivo' : 'Filmes, séries e animes'}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-1.5">
        <legend className="text-[13px] font-medium text-fg-muted">Validade</legend>
        <div className="flex flex-wrap gap-2">
          {presets.map(({ v, label }) => (
            <button
              key={String(v)}
              type="button"
              onClick={() => pick(v)}
              aria-pressed={preset === v}
              className={cn(
                'h-9 rounded-md border px-3 text-[13px] font-medium transition-colors',
                preset === v ? 'border-accent bg-accent-dim text-fg' : 'border-line-strong text-fg-muted hover:text-fg',
              )}
            >
              {label}
            </button>
          ))}
        </div>
        {preset !== 'lifetime' && (
          <Field label="Vence em" error={errors.date} className="mt-1">
            {(p) => (
              <Input
                {...p}
                type="date"
                value={date}
                min={toInputDate(Date.now() + DAY)}
                onChange={(e) => {
                  setDate(e.target.value)
                  setPreset('custom')
                }}
                className="max-w-56"
              />
            )}
          </Field>
        )}
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Dispositivos no app" hint="Quantos computadores/celulares podem ficar conectados ao mesmo tempo.">
          {(p) => (
            <Select {...p} value={devices} onChange={(e) => setDevices(Number(e.target.value))}>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? 'dispositivo' : 'dispositivos'}
                </option>
              ))}
            </Select>
          )}
        </Field>
        {member && (
          <Field label="Situação" hint={status === 'blocked' ? 'Bloquear encerra as sessões do app.' : undefined}>
            {(p) => (
              <Select {...p} value={status} onChange={(e) => setStatus(e.target.value as 'active' | 'blocked')}>
                <option value="active">Ativo</option>
                <option value="blocked">Bloqueado</option>
              </Select>
            )}
          </Field>
        )}
      </div>

      <Field label="Observações" hint="Só a equipe vê.">
        {(p) => <Textarea {...p} value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={500} className="min-h-20" />}
      </Field>

      <DialogFooter className="mt-2">
        {onCancel && (
          <Button variant="ghost" onClick={onCancel} disabled={busy}>
            Cancelar
          </Button>
        )}
        <Button type="submit" variant="primary" loading={busy}>
          {submitLabel}
        </Button>
      </DialogFooter>
    </form>
  )
}
