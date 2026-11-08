import { useQuery } from '@tanstack/react-query'
import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router'
import { ApiError } from '../../api/client'
import { auth } from '../../api/endpoints'
import { keys } from '../../app/queryClient'
import { setSession, useSession } from '../../auth/session'
import { Button } from '../../components/ui/button'
import { Field, Input } from '../../components/ui/field'
import { AuthShell } from './AuthShell'

export function FirstAccessPage() {
  const session = useSession()
  const navigate = useNavigate()
  const status = useQuery({ queryKey: keys.status, queryFn: auth.status, staleTime: 10_000 })
  const [form, setForm] = useState({ key: '', name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }))

  if (session) return <Navigate to="/" replace />
  if (status.data && !status.data.bootstrapRequired) return <Navigate to="/entrar" replace />

  const mismatch = form.confirm.length > 0 && form.confirm !== form.password
  const short = form.password.length > 0 && form.password.length < 12

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (mismatch || short) return
    setError('')
    setBusy(true)
    try {
      const email = form.email.trim().toLowerCase()
      await auth.bootstrap(form.key.trim(), email, form.name.trim(), form.password)
      const r = await auth.login(email, form.password, false)
      setSession({ token: r.token, expiresAt: r.expiresAt, absoluteExpiresAt: r.absoluteExpiresAt, user: r.user })
      navigate('/', { replace: true })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível concluir. Tente de novo.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthShell
      title="Primeiro acesso"
      description="Cria a conta do dono. Só funciona uma vez; depois, a chave de emergência fica guardada para casos extremos."
      aside={
        <Link to="/entrar" className="font-medium">
          Já tenho conta
        </Link>
      }
    >
      <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
        <Field label="Chave de emergência" hint="A ADMIN_BRIDGE_KEY configurada no serviço de acesso.">
          {(p) => <Input {...p} type="password" autoComplete="off" required value={form.key} onChange={set('key')} autoFocus />}
        </Field>
        <Field label="Seu nome">{(p) => <Input {...p} autoComplete="name" required value={form.name} onChange={set('name')} />}</Field>
        <Field label="E-mail">{(p) => <Input {...p} type="email" autoComplete="username" required value={form.email} onChange={set('email')} />}</Field>
        <Field label="Senha" hint="Pelo menos 12 caracteres." error={short ? 'A senha precisa ter pelo menos 12 caracteres.' : undefined}>
          {(p) => <Input {...p} type="password" autoComplete="new-password" required value={form.password} onChange={set('password')} />}
        </Field>
        <Field label="Confirmar senha" error={mismatch ? 'As senhas não conferem.' : undefined}>
          {(p) => <Input {...p} type="password" autoComplete="new-password" required value={form.confirm} onChange={set('confirm')} />}
        </Field>
        {error && (
          <p role="alert" className="rounded-md border border-[rgba(255,107,122,0.3)] bg-red-dim px-3 py-2 text-[13px] text-red">
            {error}
          </p>
        )}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={busy}
          disabled={!form.key || !form.name || !form.email || !form.password || !form.confirm || mismatch || short}
          className="mt-1 w-full"
        >
          Criar conta do dono
        </Button>
      </form>
    </AuthShell>
  )
}
