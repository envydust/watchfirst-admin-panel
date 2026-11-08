import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { ApiError } from '../../api/client'
import { auth } from '../../api/endpoints'
import { patchSession, useSession } from '../../auth/session'
import { Button } from '../../components/ui/button'
import { Field, Input } from '../../components/ui/field'
import { AuthShell } from './AuthShell'

/** Forced after a temporary password; also reachable from Minha conta. */
export function ChangePasswordPage({ forced = true }: { forced?: boolean }) {
  const session = useSession()
  const navigate = useNavigate()
  const [form, setForm] = useState({ current: '', next: '', confirm: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const mismatch = form.confirm.length > 0 && form.confirm !== form.next
  const short = form.next.length > 0 && form.next.length < 12
  const same = form.next.length > 0 && form.next === form.current

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (mismatch || short || same) return
    setError('')
    setBusy(true)
    try {
      await auth.changePassword(form.current, form.next)
      patchSession({ user: { mustChangePassword: false } })
      toast.success('Senha alterada.')
      navigate('/', { replace: true })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível alterar a senha.')
    } finally {
      setBusy(false)
    }
  }

  const body = (
    <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
      <Field label={forced ? 'Senha temporária' : 'Senha atual'}>
        {(p) => <Input {...p} type="password" autoComplete="current-password" required value={form.current} onChange={set('current')} autoFocus />}
      </Field>
      <Field
        label="Nova senha"
        hint="Pelo menos 12 caracteres."
        error={short ? 'A senha precisa ter pelo menos 12 caracteres.' : same ? 'Escolha uma senha diferente da atual.' : undefined}
      >
        {(p) => <Input {...p} type="password" autoComplete="new-password" required value={form.next} onChange={set('next')} />}
      </Field>
      <Field label="Confirmar nova senha" error={mismatch ? 'As senhas não conferem.' : undefined}>
        {(p) => <Input {...p} type="password" autoComplete="new-password" required value={form.confirm} onChange={set('confirm')} />}
      </Field>
      {error && (
        <p role="alert" className="rounded-md border border-[rgba(255,107,122,0.3)] bg-red-dim px-3 py-2 text-[13px] text-red">
          {error}
        </p>
      )}
      <Button type="submit" variant="primary" size="lg" loading={busy} disabled={!form.current || !form.next || !form.confirm || mismatch || short || same} className="mt-1 w-full">
        Salvar nova senha
      </Button>
    </form>
  )

  if (!forced) return body
  return (
    <AuthShell
      title={`Olá, ${session?.user.name.split(' ')[0] ?? ''}`}
      description="Sua senha é temporária. Escolha uma senha nova para continuar; as outras sessões desta conta serão encerradas."
    >
      {body}
    </AuthShell>
  )
}
