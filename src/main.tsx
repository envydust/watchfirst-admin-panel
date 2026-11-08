import { QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { Toaster } from 'sonner'
import { MOCK, setUnauthorizedHandler } from './api/client'
import { queryClient } from './app/queryClient'
import { getSession, setSession } from './auth/session'
import { router } from './app/router'

// Demo builds (VITE_MOCK=1) start signed in as the owner unless the URL asks for the login screen.
if (MOCK && !getSession() && !location.search.includes('semlogin')) {
  setSession({
    token: 'wfa_' + 'a'.repeat(64),
    expiresAt: Date.now() + 12 * 3600000,
    absoluteExpiresAt: Date.now() + 7 * 86400000,
    user: { id: 'mock-owner', email: 'dono@watchfirst.com.br', name: 'Dono WATCHFIRST', role: 'owner', permissions: ['*'], mustChangePassword: false, kind: 'user' },
  })
}
import { TooltipProvider } from './components/ui/misc'
import { PwaUpdatePrompt } from './components/pwa'
import './index.css'

// A revoked or expired session anywhere in the app lands on the login screen, keeping the return path.
setUnauthorizedHandler(() => {
  queryClient.clear()
  const here = router.state.location
  if (here.pathname !== '/entrar') {
    void router.navigate(`/entrar?next=${encodeURIComponent(here.pathname + here.search)}`, { replace: true })
  }
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <RouterProvider router={router} />
        <Toaster
          position="bottom-right"
          theme="dark"
          closeButton
          toastOptions={{
            classNames: {
              toast: '!bg-raised !border-line-strong !text-fg !shadow-pop',
              description: '!text-fg-muted',
              actionButton: '!bg-accent !text-accent-ink',
            },
          }}
        />
        <PwaUpdatePrompt />
      </TooltipProvider>
    </QueryClientProvider>
  </StrictMode>,
)
