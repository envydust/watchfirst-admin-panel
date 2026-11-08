import * as Menu from '@radix-ui/react-dropdown-menu'
import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

export const DropdownMenu = Menu.Root
export const DropdownTrigger = Menu.Trigger

export function DropdownContent({ children, align = 'end', className }: { children: ReactNode; align?: 'start' | 'end'; className?: string }) {
  return (
    <Menu.Portal>
      <Menu.Content
        align={align}
        sideOffset={6}
        className={cn(
          'z-50 min-w-48 rounded-md border border-line-strong bg-raised p-1 shadow-pop data-[state=open]:animate-[pop-in-menu_160ms_var(--ease-out)]',
          className,
        )}
      >
        {children}
      </Menu.Content>
    </Menu.Portal>
  )
}

export function DropdownItem({
  children,
  onSelect,
  tone = 'default',
  disabled,
  icon,
}: {
  children: ReactNode
  onSelect?: () => void
  tone?: 'default' | 'danger'
  disabled?: boolean
  icon?: ReactNode
}) {
  return (
    <Menu.Item
      disabled={disabled}
      onSelect={onSelect}
      className={cn(
        'flex cursor-default select-none items-center gap-2 rounded-sm px-2.5 py-2 text-[13.5px] outline-none transition-colors',
        'data-[highlighted]:bg-[rgba(255,255,255,0.07)] data-[disabled]:opacity-40',
        tone === 'danger' ? 'text-red data-[highlighted]:bg-red-dim' : 'text-fg',
      )}
    >
      {icon && <span className="text-fg-muted [&>svg]:size-4">{icon}</span>}
      {children}
    </Menu.Item>
  )
}

export function DropdownSeparator() {
  return <Menu.Separator className="my-1 h-px bg-line" />
}

export function DropdownLabel({ children }: { children: ReactNode }) {
  return <Menu.Label className="px-2.5 py-1.5 text-[11.5px] font-semibold uppercase tracking-wide text-fg-dim">{children}</Menu.Label>
}
