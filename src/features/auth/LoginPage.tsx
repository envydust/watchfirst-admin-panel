import { useQuery } from '@tanstack/react-query'
import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router'
import { auth } from '../../api/endpoints'
import { ApiError } from '../../api/client'
import { keys } from '../../app/queryClient'
import { setSession, useSession } from '../../auth/session'
import { Button } from '../../components/ui/button'
import { Field, Input } from '../../components/ui/field'
import { AuthShell } from './AuthShell'

export function LoginPage() {
  const session = useSession()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const status = useQuery({ queryKey: keys.status, queryFn: auth.status, staleTime: 30_000, retry: 1 })
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (session) return <Navigate to={params.get('next') || '/'} replace />

  async function submit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const r = await auth.login(email.trim().toLowerCase(), password, remember)
      setSession({ token: r.token, expiresAt: r.expiresAt, absoluteExpiresAt: r.absoluteExpiresAt, user: r.user })
      navigate(r.user.mustChangePassword ? '/trocar-senha' : params.get('next') || '/', { replace: true })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível entrar. Tente de novo.')
    } finally {
      setBusy(false)
    }
  }

  const offline = status.isError && (status.error as ApiError)?.status === 0

  return (
    <AuthShell
      title="Entrar"
      description="Use o e-mail e a senha da sua conta do painel."
      aside={
        status.data?.bootstrapRequired ? (
          <>
            Ainda não existe nenhuma conta.{' '}
            <Link to="/primeiro-acesso" className="font-medium">
              Fazer o primeiro acesso
            </Link>
          </>
        ) : (
          <span className="text-fg-dim">Esqueceu a senha? Peça ao dono para redefinir em Equipe.</span>
        )
      }
    >
      <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
        <Field label="E-mail">
          {(p) => (
            <Input {...p} type="email" autoComplete="username" inputMode="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoFocus />
          )}
        </Field>
        <Field label="Senha">
          {(p) => <Input {...p} type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />}
        </Field>
        <label className="flex items-center gap-2 text-[13.5px] text-fg-muted">
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="size-4 rounded-sm" />
          Manter conectado por 30 dias neste dispositivo
        </label>
        {error && (
          <p role="alert" className="rounded-md border border-[rgba(255,107,122,0.3)] bg-red-dim px-3 py-2 text-[13px] text-red">
            {error}
          </p>
        )}
        {offline && (
          <p role="status" className="rounded-md border border-[rgba(255,200,87,0.3)] bg-amber-dim px-3 py-2 text-[13px] text-amber">
            O serviço de acesso não respondeu. Verifique a conexão.
          </p>
        )}
        <Button type="submit" variant="primary" size="lg" loading={busy} disabled={!email || !password} className="mt-1 w-full">
          Entrar
        </Button>
      </form>
    </AuthShell>
  )
}
