import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

export function PageHeader({ title, description, actions }: { title: string; description?: ReactNode; actions?: ReactNode }) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-[26px] font-semibold leading-none tracking-[-0.02em] sm:text-[30px]">{title}</h1>
        {description && <p className="mt-2 text-[14px] text-fg-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  )
}

/** A clickable number that applies a filter. Not a hero metric: it is a shortcut into the list below. */
export function StatTile({
  label,
  value,
  hint,
  tone = 'neutral',
  active,
  onClick,
  loading,
}: {
  label: string
  value: ReactNode
  hint?: ReactNode
  tone?: 'neutral' | 'accent' | 'amber' | 'red'
  active?: boolean
  onClick?: () => void
  loading?: boolean
}) {
  const valueColor = tone === 'accent' ? 'text-accent' : tone === 'amber' ? 'text-amber' : tone === 'red' ? 'text-red' : 'text-fg'
  const Comp = onClick ? 'button' : 'div'
  return (
    <Comp
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      aria-pressed={onClick ? !!active : undefined}
      className={cn(
        'flex min-w-0 flex-col items-start gap-1 rounded-lg border bg-panel px-4 py-3.5 text-left transition-[border-color,background] duration-150',
        onClick && 'hover:border-line-strong hover:bg-raised',
        active ? 'border-accent bg-raised' : 'border-line',
      )}
    >
      <span className="text-[12.5px] font-medium text-fg-muted">{label}</span>
      {loading ? <span className="skeleton mt-1 h-7 w-12" /> : <span className={cn('text-[28px] font-semibold leading-none tabular-nums', valueColor)}>{value}</span>}
      {hint && <span className="text-[12px] leading-snug text-fg-dim">{hint}</span>}
    </Comp>
  )
}

export function Panel({ children, className, title, actions }: { children: ReactNode; className?: string; title?: ReactNode; actions?: ReactNode }) {
  return (
    <section className={cn('rounded-lg border border-line bg-panel', className)}>
      {(title || actions) && (
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
          {title && <h2 className="text-[15px] font-semibold">{title}</h2>}
          {actions}
        </div>
      )}
      {children}
    </section>
  )
}
