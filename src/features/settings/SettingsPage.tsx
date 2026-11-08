import { useQuery } from '@tanstack/react-query'
import { Download, ExternalLink } from 'lucide-react'
import { useEffect, useState } from 'react'
import { payments as paymentsApi } from '../../api/endpoints'
import { API_ORIGIN } from '../../api/client'
import { keys } from '../../app/queryClient'
import { useCan } from '../../auth/permissions'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Skeleton } from '../../components/ui/misc'
import { PageHeader, Panel } from '../../components/ui/page'
import { formatDateTime } from '../../lib/format'

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

function useInstallPrompt() {
  const [evt, setEvt] = useState<InstallPromptEvent | null>(null)
  const [installed, setInstalled] = useState(() => window.matchMedia('(display-mode: standalone)').matches)
  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault()
      setEvt(e as InstallPromptEvent)
    }
    const onInstalled = () => setInstalled(true)
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])
  return { evt, installed, install: async () => { await evt?.prompt(); setEvt(null) } }
}

export function SettingsPage() {
  const can = useCan()
  const { evt, installed, install } = useInstallPrompt()
  const gg = useQuery({ queryKey: keys.payments, queryFn: paymentsApi.overview, enabled: can('payments.manage') })

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Configurações" description="Instalação do painel, serviço de acesso e integrações." />

      <Panel title="Instalar como aplicativo">
        <div className="flex flex-col gap-3 px-5 py-4 text-[13.5px] text-fg-muted sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-prose">
            {installed
              ? 'Este painel está rodando como aplicativo instalado.'
              : 'Instale o painel na área de trabalho ou na tela inicial do celular: abre em janela própria, com ícone, e funciona do mesmo jeito.'}
          </p>
          {!installed && (
            evt ? (
              <Button variant="primary" icon={<Download className="size-4" />} onClick={() => void install()}>
                Instalar
              </Button>
            ) : (
              <span className="text-[12.5px] text-fg-dim">No Chrome ou Edge, use o ícone “Instalar” na barra de endereço.</span>
            )
          )}
        </div>
      </Panel>

      <Panel title="Serviço de acesso">
        <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 px-5 py-4 text-[13.5px]">
          <dt className="text-fg-muted">Endereço</dt>
          <dd className="break-all">
            <a href={`${API_ORIGIN}/api/health`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1">
              {API_ORIGIN} <ExternalLink className="size-3.5" />
            </a>
          </dd>
          <dt className="text-fg-muted">Painel</dt>
          <dd className="break-all">{location.origin + import.meta.env.BASE_URL}</dd>
          <dt className="text-fg-muted">Versão do painel</dt>
          <dd>{__APP_VERSION__}</dd>
        </dl>
      </Panel>

      {can('payments.manage') && (
        <Panel title={<span className="inline-flex items-center gap-2">Pagamentos (GGCheckout) <Badge tone="neutral">legado</Badge></span>}>
          {gg.isLoading ? (
            <div className="flex flex-col gap-3 p-5">
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-5 w-1/3" />
            </div>
          ) : gg.isError ? (
            <p className="px-5 py-4 text-[13.5px] text-red">{(gg.error as Error).message}</p>
          ) : gg.data ? (
            <div className="flex flex-col gap-4 px-5 py-4 text-[13.5px]">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={gg.data.settings.enabled ? 'accent' : 'neutral'}>{gg.data.settings.enabled ? 'Integração ativa' : 'Integração desativada'}</Badge>
                {Object.entries(gg.data.readiness).map(([k, ok]) => (
                  <Badge key={k} tone={ok ? 'accent' : 'amber'}>
                    {{ webhookSecret: 'segredo do webhook', deliveryKey: 'chave de entrega', emailKey: 'e-mail', sender: 'remetente', products: 'produtos' }[k] ?? k}: {ok ? 'ok' : 'falta'}
                  </Badge>
                ))}
              </div>
              <p className="text-fg-muted">
                A venda hoje é manual: você cadastra o membro e envia o código. Esta integração continua desligada por decisão do dono; os dados abaixo são só para consulta.
              </p>
              {gg.data.purchases.length > 0 && (
                <ul className="divide-y divide-line rounded-md border border-line">
                  {gg.data.purchases.slice(0, 10).map((p) => (
                    <li key={p.payment_id} className="flex items-center justify-between gap-3 px-4 py-2.5">
                      <div className="min-w-0">
                        <p className="truncate font-medium">{p.customer_name || p.customer_email}</p>
                        <p className="text-[12.5px] text-fg-dim">{p.product_title} · {formatDateTime(p.created_at)}</p>
                      </div>
                      <Badge tone={p.status === 'paid' ? 'accent' : p.status === 'refunded' ? 'red' : 'neutral'}>{p.status}</Badge>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : null}
        </Panel>
      )}
    </div>
  )
}
