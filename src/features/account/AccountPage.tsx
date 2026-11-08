import { useSession } from '../../auth/session'
import { Badge } from '../../components/ui/badge'
import { PageHeader, Panel } from '../../components/ui/page'
import { ChangePasswordPage } from '../auth/ChangePasswordPage'

export function AccountPage() {
  const session = useSession()
  if (!session) return null
  const { user } = session
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Minha conta" description="Seus dados de acesso ao painel." />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel title="Dados">
          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 px-5 py-4 text-[13.5px]">
            <dt className="text-fg-muted">Nome</dt>
            <dd>{user.name}</dd>
            <dt className="text-fg-muted">E-mail</dt>
            <dd>{user.email || '—'}</dd>
            <dt className="text-fg-muted">Papel</dt>
            <dd>
              <Badge tone={user.role === 'owner' ? 'accent' : 'neutral'}>{user.role === 'owner' ? 'Dono' : 'Suporte'}</Badge>
            </dd>
            <dt className="text-fg-muted">Sessão</dt>
            <dd className="text-fg-muted">
              Expira por inatividade em 12 h{session.absoluteExpiresAt ? `; no máximo até ${new Date(session.absoluteExpiresAt).toLocaleDateString('pt-BR')}` : ''}.
            </dd>
          </dl>
          <p className="border-t border-line px-5 py-3 text-[12.5px] text-fg-dim">Para mudar nome ou e-mail, peça ao dono em Equipe.</p>
        </Panel>
        <Panel title="Trocar senha">
          <div className="px-5 py-4">
            <ChangePasswordPage forced={false} />
          </div>
        </Panel>
      </div>
    </div>
  )
}
