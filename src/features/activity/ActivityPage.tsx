import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { audit as auditApi, team as teamApi } from '../../api/endpoints'
import { keys } from '../../app/queryClient'
import { useCan } from '../../auth/permissions'
import { Button } from '../../components/ui/button'
import { Input, Select } from '../../components/ui/field'
import { EmptyState } from '../../components/ui/misc'
import { PageHeader, Panel } from '../../components/ui/page'
import { ActivityList } from './ActivityList'

function useDebounced<T>(value: T, ms = 300) {
  const [v, setV] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms)
    return () => clearTimeout(t)
  }, [value, ms])
  return v
}

export function ActivityPage() {
  const can = useCan()
  const [q, setQ] = useState('')
  const [actor, setActor] = useState('')
  const debounced = useDebounced(q)
  const users = useQuery({ queryKey: keys.users, queryFn: teamApi.list, enabled: can('admins.manage') })
  const query = useInfiniteQuery({
    queryKey: keys.audit({ q: debounced, actor }),
    queryFn: ({ pageParam }) => auditApi.list({ limit: 100, before: pageParam, q: debounced || undefined, actor: actor || undefined }),
    initialPageParam: null as number | null,
    getNextPageParam: (last) => last.nextBefore,
    refetchInterval: 60_000,
  })
  const entries = query.data?.pages.flatMap((p) => p.entries) ?? []

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Atividade" description="Tudo o que foi feito no painel e pelo sistema, com quem fez." />
      <div className="flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-fg-dim" aria-hidden />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por ação, membro, e-mail…" className="pl-9" aria-label="Buscar na atividade" />
        </div>
        <Select value={actor} onChange={(e) => setActor(e.target.value)} aria-label="Quem fez" className="md:w-56">
          <option value="">Qualquer pessoa</option>
          {users.data?.users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
          <option value="legacy">Painel legado / sistema</option>
        </Select>
      </div>
      <Panel>
        {query.isError ? (
          <EmptyState title="Não foi possível carregar" description={(query.error as Error).message} action={<Button onClick={() => void query.refetch()}>Tentar de novo</Button>} />
        ) : (
          <>
            <ActivityList entries={entries} loading={query.isLoading} />
            {query.hasNextPage && (
              <div className="border-t border-line p-3 text-center">
                <Button variant="ghost" onClick={() => void query.fetchNextPage()} loading={query.isFetchingNextPage}>
                  Carregar mais
                </Button>
              </div>
            )}
          </>
        )}
      </Panel>
    </div>
  )
}
