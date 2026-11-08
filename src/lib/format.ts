import { differenceInCalendarDays, format, formatDistanceToNowStrict, isValid } from 'date-fns'
import { ptBR } from 'date-fns/locale'

/** The service encodes "vitalício" as 9999-12-31T23:59:59.999Z. */
export const LIFETIME = 253402300799000
export const DAY = 86400000

export const isLifetime = (expiresAt: number) => expiresAt >= LIFETIME

export function formatDate(ts: number | null | undefined, pattern = 'dd/MM/yyyy') {
  if (!ts) return '—'
  const d = new Date(ts)
  return isValid(d) ? format(d, pattern, { locale: ptBR }) : '—'
}

export const formatDateTime = (ts: number | null | undefined) => formatDate(ts, "dd/MM/yyyy 'às' HH:mm")

export function relativeTime(ts: number | null | undefined) {
  if (!ts) return '—'
  return formatDistanceToNowStrict(new Date(ts), { addSuffix: true, locale: ptBR })
}

export type ValidityState = 'lifetime' | 'expired' | 'soon' | 'ok'

export function validity(expiresAt: number, now = Date.now()): { state: ValidityState; days: number; label: string } {
  if (isLifetime(expiresAt)) return { state: 'lifetime', days: Infinity, label: 'Vitalício' }
  const days = differenceInCalendarDays(expiresAt, now)
  if (expiresAt <= now) return { state: 'expired', days, label: `Venceu ${relativeTime(expiresAt)}` }
  if (days === 0) return { state: 'soon', days, label: 'Vence hoje' }
  if (days === 1) return { state: 'soon', days, label: 'Vence amanhã' }
  if (days <= 7) return { state: 'soon', days, label: `Vence em ${days} dias` }
  return { state: 'ok', days, label: formatDate(expiresAt) }
}

export const planLabel = (plan: string) => (plan === 'max' ? 'MAX' : 'Básico')
export const statusLabel = (status: string) => (status === 'blocked' ? 'Bloqueado' : 'Ativo')

export function maskEmail(email: string) {
  const [user = '', domain = ''] = email.split('@')
  return `${user.slice(0, 1)}***@${domain}`
}

export function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('')
}

export const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`
