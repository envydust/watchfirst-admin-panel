import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react'
import type { ReactNode, TdHTMLAttributes, ThHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export function Table({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('overflow-x-auto rounded-lg border border-line bg-panel', className)}>
      <table className="w-full border-collapse text-left text-[13.5px]">{children}</table>
    </div>
  )
}

export function THead({ children }: { children: ReactNode }) {
  return <thead className="bg-[rgba(255,255,255,0.03)] text-[12.5px] text-fg-dim">{children}</thead>
}

export function TBody({ children }: { children: ReactNode }) {
  return <tbody className="[&>tr:not(:last-child)]:border-b [&>tr]:border-line">{children}</tbody>
}

export function TR({ children, className, onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return (
    <tr
      onClick={onClick}
      className={cn('transition-colors', onClick && 'cursor-pointer hover:bg-[rgba(255,255,255,0.035)]', className)}
    >
      {children}
    </tr>
  )
}

export function TH({
  children,
  className,
  sort,
  onSort,
  ...rest
}: ThHTMLAttributes<HTMLTableCellElement> & { sort?: 'asc' | 'desc' | null; onSort?: () => void }) {
  const content = onSort ? (
    <button type="button" onClick={onSort} className="inline-flex items-center gap-1 hover:text-fg-muted">
      {children}
      {sort === 'asc' ? <ArrowUp className="size-3" /> : sort === 'desc' ? <ArrowDown className="size-3" /> : <ChevronsUpDown className="size-3 opacity-60" />}
    </button>
  ) : (
    children
  )
  return (
    <th scope="col" className={cn('h-10 px-4 font-semibold', className)} aria-sort={sort ? (sort === 'asc' ? 'ascending' : 'descending') : undefined} {...rest}>
      {content}
    </th>
  )
}

export function TD({ children, className, ...rest }: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={cn('px-4 py-3 align-middle', className)} {...rest}>
      {children}
    </td>
  )
}
