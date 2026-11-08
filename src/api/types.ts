export type Plan = 'basic' | 'max'
export type MemberStatus = 'active' | 'blocked'

export interface Device {
  member_id: string
  device_name: string
  last_seen: number
  expires_at: number
}

export interface Member {
  id: string
  name: string
  email: string
  plan: Plan
  status: MemberStatus
  expires_at: number
  max_devices: number
  notes: string
  created_at: number
  updated_at: number
  devices: Device[]
}

export interface MemberInput {
  name: string
  email: string
  plan: Plan
  status: MemberStatus
  lifetime?: boolean
  expiresAt?: number
  maxDevices: number
  notes: string
}

export type AddonKind = 'stremio' | 'plugin'
export type AddonContent = 'vod' | 'live'

export interface Addon {
  id: string
  name: string
  url: string
  kind: AddonKind
  content: AddonContent
  min_plan: Plan
  enabled: 0 | 1
  sort_order: number
  updated_at: number
}

export interface AddonInput {
  name: string
  url: string
  kind: AddonKind
  content: AddonContent
  minPlan: Plan
  enabled: boolean
  sortOrder: number
}

export interface AuditEntry {
  id: string
  action: string
  subject: string
  created_at: number
  actor_id: string | null
  actor_name: string | null
  subject_id: string | null
}

export interface Snapshot {
  members: Member[]
  addons: Addon[]
  audit: AuditEntry[]
  serverTime: number
}

export type RequestStatus = 'pending' | 'approved' | 'rejected'

export interface AccessRequest {
  id: string
  email: string
  audience: 'windows' | 'basic' | 'max' | 'windows-link'
  device_name: string
  status: RequestStatus
  member_id: string | null
  created_at: number
  expires_at: number
  decided_at: number | null
  members: Array<Pick<Member, 'id' | 'name' | 'email' | 'plan'>>
}

export type Role = 'owner' | 'staff'

export type PermissionId =
  | 'members.read'
  | 'members.write'
  | 'members.codes'
  | 'members.devices'
  | 'members.delete'
  | 'requests.manage'
  | 'addons.manage'
  | 'releases.manage'
  | 'payments.manage'
  | 'audit.read'
  | 'admins.manage'

export interface PermissionInfo {
  id: PermissionId
  group: string
  label: string
  description: string
  ownerOnly?: boolean
}

export interface AdminUser {
  id: string
  email: string
  name: string
  role: Role
  permissions: Array<PermissionId | '*'>
  status: 'active' | 'disabled'
  mustChangePassword: boolean
  createdAt: number
  updatedAt: number
  lastLoginAt: number | null
  activeSessions?: number
}

export interface SessionUser {
  id: string | null
  email: string
  name: string
  role: Role
  permissions: Array<PermissionId | '*'>
  mustChangePassword: boolean
  kind?: 'user' | 'bridge'
}

export interface LoginResponse {
  token: string
  expiresAt: number
  absoluteExpiresAt: number
  user: AdminUser
}

export interface MeResponse {
  user: SessionUser
  permissionsCatalog: PermissionInfo[]
  sessionExpiresAt: number | null
  absoluteExpiresAt: number | null
  serverTime: number
}

export interface AuditPage {
  entries: AuditEntry[]
  nextBefore: number | null
}

export interface GgReadiness {
  webhookSecret: boolean
  deliveryKey: boolean
  emailKey: boolean
  sender: boolean
  products: boolean
}

export interface GgOverview {
  settings: { basic_product_id: string; max_product_id: string; enabled: number; mail_from: string }
  readiness: GgReadiness
  checkoutUrls: Record<string, string>
  webhookUrl: string
  memberUrl: string
  purchases: Array<{
    payment_id: string
    product_title: string
    customer_email: string
    customer_name: string
    plan: Plan
    status: string
    member_status: string | null
    created_at: number
  }>
  mailJobs: Array<{ id: string; email: string; kind: string; status: string; error: string; created_at: number; sent_at: number | null }>
}
