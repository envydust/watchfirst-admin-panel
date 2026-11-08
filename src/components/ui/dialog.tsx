import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { Button } from './button'
import { Input } from './field'

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogClose = DialogPrimitive.Close

export function DialogContent({
  title,
  description,
  children,
  className,
  size = 'md',
  hideClose,
}: {
  title: ReactNode
  description?: ReactNode
  children?: ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg'
  hideClose?: boolean
}) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-[rgba(4,7,10,0.72)] data-[state=open]:animate-[fade-in_180ms_ease-out]" />
      <DialogPrimitive.Content
        className={cn(
          'fixed left-1/2 top-1/2 z-50 w-[calc(100vw-32px)] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-line-strong bg-panel p-6 shadow-pop',
          'focus:outline-none data-[state=open]:animate-[pop-in_220ms_var(--ease-out)]',
          size === 'sm' && 'max-w-sm',
          size === 'md' && 'max-w-lg',
          size === 'lg' && 'max-w-2xl',
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <DialogPrimitive.Title className="text-[17px] font-semibold leading-tight">{title}</DialogPrimitive.Title>
            {description ? (
              <DialogPrimitive.Description className="mt-1 text-[13.5px] text-fg-muted">{description}</DialogPrimitive.Description>
            ) : (
              <DialogPrimitive.Description className="sr-only">{typeof title === 'string' ? title : 'Diálogo'}</DialogPrimitive.Description>
            )}
          </div>
          {!hideClose && (
            <DialogPrimitive.Close asChild>
              <Button variant="ghost" size="icon" aria-label="Fechar" className="-mr-2 -mt-2 shrink-0">
                <X className="size-4" />
              </Button>
            </DialogPrimitive.Close>
          )}
        </div>
        {children && <div className="mt-5">{children}</div>}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}

export function DialogFooter({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}>{children}</div>
}

/**
 * Confirmation for destructive actions. States the consequence; optionally requires typing a word
 * (used for deletions) so a fast click cannot do it.
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirmar',
  tone = 'default',
  typeToConfirm,
  onConfirm,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: ReactNode
  description: ReactNode
  confirmLabel?: string
  tone?: 'default' | 'danger'
  typeToConfirm?: string
  onConfirm: () => Promise<unknown> | unknown
}) {
  const [typed, setTyped] = useState('')
  const [busy, setBusy] = useState(false)
  const ready = !typeToConfirm || typed.trim() === typeToConfirm
  async function run() {
    setBusy(true)
    try {
      await onConfirm()
      onOpenChange(false)
      setTyped('')
    } finally {
      setBusy(false)
    }
  }
  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!busy) {
          onOpenChange(o)
          if (!o) setTyped('')
        }
      }}
    >
      <DialogContent title={title} description={description} size="sm">
        {typeToConfirm && (
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] text-fg-muted" htmlFor="confirm-typed">
              Digite <span className="font-semibold text-fg">{typeToConfirm}</span> para confirmar
            </label>
            <Input id="confirm-typed" value={typed} onChange={(e) => setTyped(e.target.value)} autoComplete="off" autoFocus />
          </div>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" disabled={busy}>
              Cancelar
            </Button>
          </DialogClose>
          <Button variant={tone === 'danger' ? 'danger-solid' : 'primary'} onClick={run} loading={busy} disabled={!ready}>
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
