import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import type { Plan } from '../../api/types'
import type { ValidityState } from '../../lib/format'

type Tone = 'neutral' | 'accent' | 'amber' | 'red' | 'blue'

const tones: Record<Tone, string> = {
  neutral: 'bg-[rgba(255,255,255,0.06)] text-fg-muted border-line-strong',
  accent: 'bg-accent-dim text-accent-soft border-[rgba(57,255,20,0.3)]',
  amber: 'bg-amber-dim text-amber border-[rgba(255,200,87,0.3)]',
  red: 'bg-red-dim text-red border-[rgba(255,107,122,0.3)]',
  blue: 'bg-blue-dim text-blue border-[rgba(108,184,255,0.3)]',
}

export function Badge({ tone = 'neutral', className, children }: { tone?: Tone; className?: string; children: ReactNode }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 h-6 px-2 rounded-sm border text-[12px] font-medium leading-none whitespace-nowrap',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

/** Plan identity: Básico outlined, MAX filled. Same shape everywhere. */
export function PlanChip({ plan, className }: { plan: Plan; className?: string }) {
  return plan === 'max' ? (
    <span className={cn('inline-flex h-6 items-center rounded-sm bg-accent px-2 text-[11.5px] font-bold tracking-wide text-accent-ink', className)}>
      MAX
    </span>
  ) : (
    <span
      className={cn(
        'inline-flex h-6 items-center rounded-sm border border-line-strong px-2 text-[11.5px] font-bold tracking-wide text-fg-muted',
        className,
      )}
    >
      BÁSICO
    </span>
  )
}

export function StatusChip({ status }: { status: 'active' | 'blocked' }) {
  return status === 'blocked' ? <Badge tone="red">Bloqueado</Badge> : <Badge tone="accent">Ativo</Badge>
}

export function ValidityChip({ state, label }: { state: ValidityState; label: string }) {
  const tone: Tone = state === 'expired' ? 'red' : state === 'soon' ? 'amber' : state === 'lifetime' ? 'blue' : 'neutral'
  return <Badge tone={tone}>{label}</Badge>
}
