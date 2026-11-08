import { format, isToday, isYesterday } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Activity } from 'lucide-react'
import { Fragment } from 'react'
import type { AuditEntry } from '../../api/types'
import { EmptyState, Skeleton } from '../../components/ui/misc'
import { cn } from '../../lib/cn'
import { initials } from '../../lib/format'

function dayLabel(ts: number) {
  const d = new Date(ts)
  if (isToday(d)) return 'Hoje'
  if (isYesterday(d)) return 'Ontem'
  return format(d, "EEEE, d 'de' MMMM", { locale: ptBR })
}

function actorStyle(entry: AuditEntry) {
  if (entry.actor_id) return { label: entry.actor_name ?? 'Usuário', tone: 'text-accent-soft bg-accent-dim' }
  if (entry.actor_name === 'Sistema' || !entry.actor_name) return { label: 'Sistema', tone: 'text-blue bg-blue-dim' }
  return { label: entry.actor_name, tone: 'text-fg-muted bg-[rgba(255,255,255,0.06)]' }
}

export function ActivityList({ entries, loading, compact }: { entries: AuditEntry[]; loading?: boolean; compact?: boolean }) {
  if (loading) {
    return (
      <div className="flex flex-col gap-3 p-5">
        {Array.from({ length: compact ? 4 : 8 }).map((_, i) => (
          <Skeleton key={i} className={cn('h-5', i % 2 ? 'w-3/4' : 'w-1/2')} />
        ))}
      </div>
    )
  }
  if (entries.length === 0) {
    return <EmptyState icon={<Activity />} title="Nenhuma atividade" description="As ações feitas no painel aparecem aqui com quem fez cada uma." />
  }
  let lastDay = ''
  return (
    <ol className="divide-y divide-line">
      {entries.map((e) => {
        const day = dayLabel(e.created_at)
        const showDay = !compact && day !== lastDay
        lastDay = day
        const actor = actorStyle(e)
        return (
          <Fragment key={e.id}>
            {showDay && (
              <li className="bg-[rgba(255,255,255,0.02)] px-5 py-1.5 text-[11.5px] font-semibold uppercase tracking-wide text-fg-dim first-letter:uppercase">{day}</li>
            )}
            <li className="flex items-start gap-3 px-5 py-3">
              <span className={cn('mt-0.5 grid size-7 shrink-0 place-items-center rounded-full text-[11px] font-bold', actor.tone)} title={actor.label}>
                {initials(actor.label) || '•'}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13.5px]">
                  <span className="font-medium">{actor.label}</span> <span className="text-fg-muted">·</span> {e.action}
                </p>
                {e.subject && <p className="truncate text-[12.5px] text-fg-dim">{e.subject}</p>}
              </div>
              <time dateTime={new Date(e.created_at).toISOString()} className="shrink-0 text-[12px] tabular-nums text-fg-dim">
                {format(e.created_at, compact ? 'dd/MM HH:mm' : 'HH:mm', { locale: ptBR })}
              </time>
            </li>
          </Fragment>
        )
      })}
    </ol>
  )
}
