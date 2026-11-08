import { forwardRef, useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../lib/cn'

const control =
  'w-full bg-bg border border-line-strong rounded-md px-3 text-fg placeholder:text-fg-dim transition-[border-color,box-shadow] duration-150 ' +
  'hover:border-[rgba(255,255,255,0.22)] focus:border-accent focus:shadow-[0_0_0_3px_rgba(57,255,20,0.18)] focus:outline-none ' +
  'disabled:opacity-50 disabled:cursor-not-allowed aria-[invalid=true]:border-red'

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input({ className, ...rest }, ref) {
  return <input ref={ref} className={cn(control, 'h-10', className)} {...rest} />
})

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(function Textarea(
  { className, ...rest },
  ref,
) {
  return <textarea ref={ref} className={cn(control, 'py-2 min-h-24 resize-y', className)} {...rest} />
})

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(function Select(
  { className, children, ...rest },
  ref,
) {
  return (
    <span className="relative block">
      <select ref={ref} className={cn(control, 'h-10 appearance-none pr-9 [&>option]:bg-raised', className)} {...rest}>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-fg-dim" aria-hidden />
    </span>
  )
})

/** Label + control + hint/error, with the ids wired for assistive tech. */
export function Field({
  label,
  hint,
  error,
  children,
  className,
  inline,
}: {
  label: string
  hint?: ReactNode
  error?: string
  children: (props: { id: string; 'aria-invalid'?: true; 'aria-describedby'?: string }) => ReactNode
  className?: string
  inline?: boolean
}) {
  const id = useId()
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined
  return (
    <div className={cn('flex gap-1.5', inline ? 'items-center justify-between' : 'flex-col', className)}>
      <label htmlFor={id} className="text-[13px] font-medium text-fg-muted">
        {label}
      </label>
      {children({ id, ...(error ? { 'aria-invalid': true as const } : {}), ...(describedBy ? { 'aria-describedby': describedBy } : {}) })}
      {error ? (
        <p id={`${id}-error`} className="text-[12.5px] text-red">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-[12.5px] text-fg-dim">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
