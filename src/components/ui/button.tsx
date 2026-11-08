import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '../../lib/cn'

export type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'danger-solid'
export type Size = 'sm' | 'md' | 'lg' | 'icon'

const variants: Record<Variant, string> = {
  primary:
    'bg-accent text-accent-ink font-semibold hover:brightness-110 active:brightness-95 shadow-[0_0_0_1px_rgba(57,255,20,0.25)_inset]',
  secondary: 'bg-raised text-fg border border-line-strong hover:bg-[#19262f] hover:border-[rgba(255,255,255,0.2)]',
  ghost: 'text-fg-muted hover:text-fg hover:bg-[rgba(255,255,255,0.06)]',
  danger: 'bg-red-dim text-red border border-[rgba(255,107,122,0.25)] hover:bg-[rgba(255,107,122,0.22)]',
  'danger-solid': 'bg-red text-[#2a0b10] font-semibold hover:brightness-110',
}

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-[13px] gap-1.5 rounded-sm',
  md: 'h-10 px-4 text-sm gap-2 rounded-md',
  lg: 'h-12 px-5 text-[15px] gap-2 rounded-md',
  icon: 'h-9 w-9 rounded-md',
}

export function buttonClasses(variant: Variant = 'secondary', size: Size = 'md', className?: string) {
  return cn(
    'inline-flex items-center justify-center whitespace-nowrap select-none no-underline transition-[background,color,border-color,filter] duration-150',
    'disabled:opacity-50 disabled:pointer-events-none',
    variants[variant],
    sizes[size],
    className,
  )
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  icon?: ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = 'secondary', size = 'md', loading = false, icon, children, disabled, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonClasses(variant, size, className)}
      {...rest}
    >
      {loading ? <Loader2 className="size-4 animate-spin" aria-hidden /> : icon}
      {children}
    </button>
  )
})

export function LinkButton({
  className,
  variant = 'secondary',
  size = 'md',
  icon,
  children,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: Variant; size?: Size; icon?: ReactNode }) {
  return (
    <a className={buttonClasses(variant, size, className)} {...rest}>
      {icon}
      {children}
    </a>
  )
}
