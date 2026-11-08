import { MessageCircle } from 'lucide-react'
import type { ReactNode } from 'react'
import { LinkButton } from './button'
import { CopyButton } from './misc'

/**
 * The one-time reveal. Codes and temporary passwords come back from the service exactly once, so this
 * component is the only place they ever appear. It reads as a perforated ticket; the stub below the tear
 * line carries the warning and the send actions.
 */
export function Ticket({
  code,
  title,
  subtitle,
  whatsappText,
  footer,
}: {
  code: string
  title: string
  subtitle?: ReactNode
  /** When set, offers "Enviar por WhatsApp" with this message (code already included). */
  whatsappText?: string
  footer?: ReactNode
}) {
  const groups = code.length > 24 ? code.match(/.{1,12}/g) ?? [code] : [code]
  return (
    <div className="ticket ticket-enter overflow-hidden">
      <div className="px-6 pb-6 pt-5">
        <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-accent-soft">{title}</p>
        {subtitle && <p className="mt-0.5 text-[13px] text-fg-muted">{subtitle}</p>}
        <div className="mt-4 select-all break-all font-semibold leading-tight tracking-[0.04em] text-fg">
          {groups.map((g, i) => (
            <span key={i} className="block text-[clamp(18px,3.2vw,26px)]">
              {g}
            </span>
          ))}
        </div>
      </div>
      <div className="ticket-tear" />
      <div className="flex flex-col gap-3 px-6 pb-5 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[12.5px] leading-snug text-amber">Guarde agora: este código não será exibido de novo.</p>
        <div className="flex shrink-0 gap-2">
          <CopyButton value={code} size="sm" variant="primary" />
          {whatsappText && (
            <LinkButton
              href={`https://wa.me/?text=${encodeURIComponent(whatsappText)}`}
              target="_blank"
              rel="noopener noreferrer"
              size="sm"
              icon={<MessageCircle className="size-4" />}
            >
              WhatsApp
            </LinkButton>
          )}
        </div>
      </div>
      {footer && <div className="border-t border-line px-6 py-3 text-[12.5px] text-fg-muted">{footer}</div>}
    </div>
  )
}
