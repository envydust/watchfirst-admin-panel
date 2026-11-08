import { createBrowserRouter, Navigate, Outlet, useRouteError } from 'react-router'
import { RequireAuth } from '../auth/RequireAuth'
import { useCan } from '../auth/permissions'
import { Button } from '../components/ui/button'
import { EmptyState } from '../components/ui/misc'
import { AccountPage } from '../features/account/AccountPage'
import { ActivityPage } from '../features/activity/ActivityPage'
import { AddonsPage } from '../features/addons/AddonsPage'
import { ChangePasswordPage } from '../features/auth/ChangePasswordPage'
import { FirstAccessPage } from '../features/auth/FirstAccessPage'
import { LoginPage } from '../features/auth/LoginPage'
import { MemberDetailPage } from '../features/members/MemberDetailPage'
import { MembersPage } from '../features/members/MembersPage'
import { OverviewPage } from '../features/overview/OverviewPage'
import { RequestsPage } from '../features/requests/RequestsPage'
import { SettingsPage } from '../features/settings/SettingsPage'
import { TeamPage } from '../features/team/TeamPage'
import type { PermissionId } from '../api/types'
import { Layout } from './Layout'

function Guard({ perm }: { perm: PermissionId }) {
  const can = useCan()
  if (!can(perm)) {
    return (
      <EmptyState
        title="Sem permissão para esta área"
        description="Peça ao dono para liberar em Equipe e permissões."
        action={
          <Button onClick={() => history.back()}>Voltar</Button>
        }
      />
    )
  }
  return <Outlet />
}

function ErrorPage() {
  const error = useRouteError() as Error
  return (
    <div className="grid min-h-svh place-items-center p-6">
      <EmptyState
        title="Algo deu errado nesta tela"
        description={error?.message || 'Erro inesperado.'}
        action={<Button variant="primary" onClick={() => location.reload()}>Recarregar</Button>}
      />
    </div>
  )
}

export const router = createBrowserRouter(
  [
    { path: '/entrar', element: <LoginPage />, errorElement: <ErrorPage /> },
    { path: '/primeiro-acesso', element: <FirstAccessPage />, errorElement: <ErrorPage /> },
    {
      path: '/trocar-senha',
      element: (
        <RequireAuth>
          <ChangePasswordPage />
        </RequireAuth>
      ),
      errorElement: <ErrorPage />,
    },
    {
      element: (
        <RequireAuth>
          <Layout />
        </RequireAuth>
      ),
      errorElement: <ErrorPage />,
      children: [
        { index: true, element: <OverviewPage /> },
        {
          element: <Guard perm="members.read" />,
          children: [
            { path: 'membros', element: <MembersPage /> },
            { path: 'membros/novo', element: <Navigate to="/membros?novo=1" replace /> },
            { path: 'membros/:id', element: <MemberDetailPage /> },
          ],
        },
        { element: <Guard perm="requests.manage" />, children: [{ path: 'solicitacoes', element: <RequestsPage /> }] },
        { element: <Guard perm="addons.manage" />, children: [{ path: 'addons', element: <AddonsPage /> }] },
        { element: <Guard perm="audit.read" />, children: [{ path: 'atividade', element: <ActivityPage /> }] },
        { element: <Guard perm="admins.manage" />, children: [{ path: 'equipe', element: <TeamPage /> }] },
        { path: 'configuracoes', element: <SettingsPage /> },
        { path: 'conta', element: <AccountPage /> },
        { path: '*', element: <Navigate to="/" replace /> },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL.replace(/\/$/, '') || '/' },
)
