import * as SwitchPrimitive from '@radix-ui/react-switch'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { Check, Copy, Inbox } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { Button, type ButtonProps } from './button'

export function Switch({
  checked,
  onCheckedChange,
  disabled,
  label,
}: {
  checked: boolean
  onCheckedChange: (v: boolean) => void
  disabled?: boolean
  label: string
}) {
  return (
    <SwitchPrimitive.Root
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      aria-label={label}
      className="relative h-6 w-10 shrink-0 rounded-full border border-line-strong bg-[rgba(255,255,255,0.08)] transition-colors data-[state=checked]:border-accent data-[state=checked]:bg-accent disabled:opacity-50"
    >
      <SwitchPrimitive.Thumb className="block size-4 translate-x-0.5 rounded-full bg-fg shadow transition-transform data-[state=checked]:translate-x-[18px] data-[state=checked]:bg-accent-ink" />
    </SwitchPrimitive.Root>
  )
}

export const TooltipProvider = TooltipPrimitive.Provider

export function Tooltip({ content, children }: { content: ReactNode; children: ReactNode }) {
  return (
    <TooltipPrimitive.Root delayDuration={300}>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          sideOffset={6}
          className="z-50 max-w-xs rounded-sm border border-line-strong bg-raised px-2.5 py-1.5 text-[12.5px] text-fg shadow-pop"
        >
          {content}
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  )
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton h-4 w-full', className)} aria-hidden />
}

export function EmptyState({
  icon = <Inbox />,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode
  title: string
  description?: ReactNode
  action?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 px-6 py-14 text-center', className)}>
      <div className="grid size-11 place-items-center rounded-md border border-line-strong bg-raised text-fg-muted [&>svg]:size-5">{icon}</div>
      <div className="max-w-sm">
        <p className="text-[15px] font-semibold">{title}</p>
        {description && <p className="mt-1 text-[13.5px] text-fg-muted">{description}</p>}
      </div>
      {action}
    </div>
  )
}

export function CopyButton({ value, label = 'Copiar', ...rest }: { value: string; label?: string } & Omit<ButtonProps, 'onClick' | 'children'>) {
  const [done, setDone] = useState(false)
  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
      setDone(true)
      setTimeout(() => setDone(false), 1800)
    } catch {
      /* clipboard blocked: the value stays visible to select manually */
    }
  }
  return (
    <Button onClick={copy} icon={done ? <Check className="size-4" /> : <Copy className="size-4" />} {...rest}>
      {done ? 'Copiado' : label}
    </Button>
  )
}

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={cn('inline-block size-4 animate-spin rounded-full border-2 border-fg-dim border-t-accent', className)}
      role="status"
      aria-label="Carregando"
    />
  )
}
