import { api } from './client'
import type {
  AccessRequest,
  AddonInput,
  AdminUser,
  AuditPage,
  GgOverview,
  LoginResponse,
  MeResponse,
  MemberInput,
  PermissionId,
  PermissionInfo,
  Role,
  Snapshot,
} from './types'

// ---- auth -------------------------------------------------------------------------------------
export const auth = {
  status: () => api<{ bootstrapRequired: boolean; serverTime: number }>('auth/status', { keepSessionOn401: true }),
  login: (email: string, password: string, remember: boolean) =>
    api<LoginResponse>('auth/login', { body: { email, password, remember }, keepSessionOn401: true }),
  bootstrap: (key: string, email: string, name: string, password: string) =>
    api<{ id: string }>('auth/bootstrap', { body: { email, name, password }, token: key }),
  me: () => api<MeResponse>('auth/me'),
  logout: () => api<{ ok: true }>('auth/logout', { body: {} }),
  changePassword: (current: string, next: string) => api<{ ok: true }>('auth/password', { body: { current, next } }),
}

// ---- members & snapshot ------------------------------------------------------------------------
export const members = {
  snapshot: () => api<Snapshot>('snapshot'),
  create: (input: MemberInput) => api<{ id: string; code: string }>('members', { body: input }),
  update: (id: string, input: MemberInput) => api<{ ok: true }>(`members/${id}`, { method: 'PUT', body: input }),
  remove: (id: string) => api<{ ok: true }>(`members/${id}`, { method: 'DELETE' }),
  rotate: (id: string) => api<{ code: string }>(`members/${id}/rotate`, { body: {} }),
  disconnect: (id: string) => api<{ ok: true }>(`members/${id}/devices`, { method: 'DELETE' }),
}

// ---- access requests ---------------------------------------------------------------------------
export const requests = {
  list: () => api<{ requests: AccessRequest[] }>('access-requests'),
  approve: (id: string, choice: { memberId: string } | { plan: 'basic' | 'max' }) =>
    api<{ ok: true; memberId: string | null }>(`access-requests/${id}/approve`, { body: choice }),
  reject: (id: string) => api<{ ok: true }>(`access-requests/${id}/reject`, { body: {} }),
}

// ---- addons ------------------------------------------------------------------------------------
export const addons = {
  create: (input: AddonInput) => api<{ id: string }>('addons', { body: input }),
  update: (id: string, input: AddonInput) => api<{ id: string }>(`addons/${id}`, { method: 'PUT', body: input }),
  remove: (id: string) => api<{ ok: true }>(`addons/${id}`, { method: 'DELETE' }),
  restoreDefaults: () => api<{ ok: true }>('setup-defaults', { body: {} }),
}

// ---- team --------------------------------------------------------------------------------------
export interface UserInput {
  email?: string
  name?: string
  role?: Role
  permissions?: PermissionId[]
  status?: 'active' | 'disabled'
}
export const team = {
  list: () => api<{ users: AdminUser[]; permissionsCatalog: PermissionInfo[] }>('users'),
  create: (input: Required<Pick<UserInput, 'email' | 'name' | 'role'>> & { permissions: PermissionId[] }) =>
    api<{ id: string; temporaryPassword: string }>('users', { body: input }),
  update: (id: string, input: UserInput) => api<{ ok: true }>(`users/${id}`, { method: 'PUT', body: input }),
  remove: (id: string) => api<{ ok: true }>(`users/${id}`, { method: 'DELETE' }),
  resetPassword: (id: string) => api<{ temporaryPassword: string }>(`users/${id}/reset-password`, { body: {} }),
  endSessions: (id: string) => api<{ ok: true }>(`users/${id}/sessions`, { method: 'DELETE' }),
}

// ---- audit -------------------------------------------------------------------------------------
export const audit = {
  list: (params: { limit?: number; before?: number | null; actor?: string; subject?: string; q?: string }) =>
    api<AuditPage>('audit', { query: params }),
}

// ---- payments (legacy GGCheckout) --------------------------------------------------------------
export const payments = {
  overview: () => api<GgOverview>('ggcheckout'),
}
