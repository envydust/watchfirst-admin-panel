import { clearSession, getSession } from '../auth/session'

export const API_ORIGIN = __API_ORIGIN__

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

type Query = Record<string, string | number | null | undefined>

interface Options {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: unknown
  query?: Query
  /** Send this bearer instead of the stored session (bootstrap uses the emergency key). */
  token?: string
  /** Do not clear the session on 401 (login screens). */
  keepSessionOn401?: boolean
}

const FALLBACK: Record<number, string> = {
  401: 'Sessão encerrada. Entre novamente.',
  403: 'Você não tem permissão para esta ação.',
  404: 'Não encontrado.',
  409: 'Conflito: os dados mudaram. Atualize e tente de novo.',
  413: 'Pedido muito grande.',
  429: 'Muitas tentativas. Aguarde alguns minutos.',
  503: 'Serviço temporariamente indisponível.',
}

let onUnauthorized: (() => void) | null = null
export function setUnauthorizedHandler(fn: (() => void) | null) {
  onUnauthorized = fn
}

export const MOCK = import.meta.env.VITE_MOCK === '1'

export async function api<T>(path: string, opts: Options = {}): Promise<T> {
  if (MOCK) {
    const { mockApi } = await import('./mock')
    const method = opts.method ?? (opts.body === undefined ? 'GET' : 'POST')
    const qs = new URLSearchParams()
    for (const [k, v] of Object.entries(opts.query ?? {})) if (v !== undefined && v !== null && v !== '') qs.set(k, String(v))
    return (await mockApi(qs.size ? `${path}?${qs}` : path, method, opts.body)) as T
  }
  const url = new URL(`${API_ORIGIN}/api/admin/${path}`)
  for (const [k, v] of Object.entries(opts.query ?? {})) {
    if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v))
  }
  const token = opts.token ?? getSession()?.token
  const headers: Record<string, string> = { accept: 'application/json', 'x-watchfirst-admin': '1' }
  if (token) headers.authorization = `Bearer ${token}`
  if (opts.body !== undefined) headers['content-type'] = 'application/json'

  let res: Response
  try {
    res = await fetch(url, {
      method: opts.method ?? (opts.body === undefined ? 'GET' : 'POST'),
      headers,
      body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
    })
  } catch {
    throw new ApiError(0, 'Sem conexão com o serviço. Verifique a internet e tente de novo.')
  }

  let data: unknown = null
  const text = await res.text()
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = null
    }
  }
  if (!res.ok) {
    const message = (data as { error?: string } | null)?.error || FALLBACK[res.status] || `Erro ${res.status}.`
    if (res.status === 401 && !opts.keepSessionOn401 && !opts.token) {
      clearSession()
      onUnauthorized?.()
    }
    throw new ApiError(res.status, message)
  }
  return data as T
}
