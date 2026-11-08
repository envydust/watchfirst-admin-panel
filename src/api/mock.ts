// In-memory stand-in for the access service, enabled with VITE_MOCK=1. Lets the panel be developed,
// screenshotted and demoed before the backend is published. Synthetic data only; nothing is persisted.
import type { AccessRequest, Addon, AdminUser, AuditEntry, Member, PermissionInfo } from './types'
import { ApiError } from './client'

const LIFETIME = 253402300799000
const DAY = 86400000
const now = Date.now()
const uuid = () => crypto.randomUUID()
const code = () => 'WF-' + Array.from(crypto.getRandomValues(new Uint8Array(24)), (b) => b.toString(16).padStart(2, '0')).join('').toUpperCase()

const NAMES = [
  'Ana Beatriz Souza', 'Carlos Eduardo Lima', 'Fernanda Oliveira', 'João Pedro Santos', 'Mariana Costa', 'Rafael Almeida',
  'Juliana Ferreira', 'Lucas Rodrigues', 'Camila Martins', 'Bruno Carvalho', 'Patrícia Gomes', 'Thiago Ribeiro',
  'Larissa Araújo', 'Gustavo Pereira', 'Aline Barbosa', 'Diego Nascimento', 'Renata Dias', 'Felipe Moreira',
  'Vanessa Rocha', 'Marcelo Cardoso', 'Tatiane Freitas', 'Rodrigo Pinto', 'Priscila Teixeira', 'André Correia',
  'Bianca Castro', 'Leandro Monteiro', 'Daniela Azevedo', 'Vinícius Lopes', 'Simone Batista', 'Eduardo Ramos', 'Letícia Cunha',
]

const members: Member[] = NAMES.map((name, i) => {
  const plan = i % 4 === 0 ? 'basic' : 'max'
  const lifetime = i % 5 !== 0
  const soon = i === 3 || i === 11
  const expires = lifetime ? LIFETIME : soon ? now + (i === 3 ? 2 : 6) * DAY : now + (40 + i * 9) * DAY
  const devices = i % 3 === 0 ? [] : [{ member_id: '', device_name: i % 2 ? 'WATCHFIRST Windows' : 'Navegador · MAX', last_seen: now - (i % 7) * 5 * 3600000, expires_at: now + 20 * DAY }]
  const id = uuid()
  devices.forEach((d) => (d.member_id = id))
  return {
    id,
    name,
    email: name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').split(' ').slice(0, 2).join('.') + '@exemplo.com',
    plan,
    status: i === 17 ? 'blocked' : 'active',
    expires_at: i === 23 ? now - 3 * DAY : expires,
    max_devices: 1 + (i % 3),
    notes: i === 5 ? 'Pagou pelo Pix em 02/11. Pediu 2 telas.' : '',
    created_at: now - (60 - i) * DAY,
    updated_at: now - (i % 9) * DAY,
    devices,
  }
})

const addons: Addon[] = [
  { id: 'fenixflix', name: 'FenixFlix', url: 'https://fenixflix.fenixhub.online/manifest.json', kind: 'stremio', content: 'vod', min_plan: 'basic', enabled: 1, sort_order: 0, updated_at: now - 9 * DAY },
  { id: 'aiometadata', name: 'AIOMetadata', url: 'https://aiometadata.forthewizards.uk/stremio/210a50b2/manifest.json', kind: 'stremio', content: 'vod', min_plan: 'basic', enabled: 1, sort_order: 1, updated_at: now - 9 * DAY },
  { id: 'kamirama', name: 'Kamirama', url: 'https://raw.githubusercontent.com/kaminarizz/Kamirama-Plugin/main/manifest.json', kind: 'plugin', content: 'vod', min_plan: 'basic', enabled: 1, sort_order: 2, updated_at: now - 9 * DAY },
  { id: 'liet', name: 'Liet Nuvio', url: 'https://raw.githubusercontent.com/lawlietbr/liet-nuvio/refs/heads/main/manifest.json', kind: 'plugin', content: 'vod', min_plan: 'max', enabled: 0, sort_order: 3, updated_at: now - 2 * DAY },
  { id: 'futebol', name: 'Futebol ao vivo', url: 'https://canais.exemplo.com.br/manifest.json', kind: 'stremio', content: 'live', min_plan: 'max', enabled: 1, sort_order: 10, updated_at: now - DAY },
]

const owner: AdminUser = { id: uuid(), email: 'dono@watchfirst.com.br', name: 'Dono WATCHFIRST', role: 'owner', permissions: ['*'], status: 'active', mustChangePassword: false, createdAt: now - 30 * DAY, updatedAt: now - DAY, lastLoginAt: now - 3600000, activeSessions: 2 }
const staff: AdminUser = { id: uuid(), email: 'suporte@watchfirst.com.br', name: 'Suporte Clara', role: 'staff', permissions: ['members.read', 'requests.manage'], status: 'active', mustChangePassword: true, createdAt: now - 3 * DAY, updatedAt: now - 3 * DAY, lastLoginAt: null, activeSessions: 0 }
const users: AdminUser[] = [owner, staff]

const audit: AuditEntry[] = [
  { id: uuid(), action: 'Solicitação de acesso aceita', subject: 'mariana.costa@exemplo.com · windows · WATCHFIRST Windows', created_at: now - 20 * 60000, actor_id: owner.id, actor_name: owner.name, subject_id: members[4].id },
  { id: uuid(), action: 'Membro criado', subject: 'Letícia Cunha · max', created_at: now - 2 * 3600000, actor_id: owner.id, actor_name: owner.name, subject_id: members[30].id },
  { id: uuid(), action: 'Usuário criado', subject: 'Suporte Clara · s***@watchfirst.com.br · suporte', created_at: now - 3 * DAY, actor_id: owner.id, actor_name: owner.name, subject_id: staff.id },
  { id: uuid(), action: 'Código renovado', subject: 'Diego Nascimento', created_at: now - 4 * DAY, actor_id: null, actor_name: 'Painel legado (chave)', subject_id: members[15].id },
  { id: uuid(), action: 'Acesso atualizado', subject: 'Renata Dias · max · blocked', created_at: now - 5 * DAY, actor_id: null, actor_name: 'Painel legado (chave)', subject_id: members[17].id },
  { id: uuid(), action: 'Login', subject: 'Dono WATCHFIRST · d***@watchfirst.com.br', created_at: now - 3600000, actor_id: owner.id, actor_name: owner.name, subject_id: owner.id },
]

const requests: AccessRequest[] = [
  { id: uuid(), email: 'mariana.costa@exemplo.com', audience: 'windows', device_name: 'WATCHFIRST Windows', status: 'pending', member_id: null, created_at: now - 4 * 60000, expires_at: now + 26 * 60000, decided_at: null, members: [members[4]].map((m) => ({ id: m.id, name: m.name, email: m.email, plan: m.plan })) },
  { id: uuid(), email: 'novo.cliente@gmail.com', audience: 'max', device_name: 'Navegador · MAX', status: 'pending', member_id: null, created_at: now - 12 * 60000, expires_at: now + 3 * 60000, decided_at: null, members: [] },
  { id: uuid(), email: 'joao.pedro@exemplo.com', audience: 'windows', device_name: 'WATCHFIRST Windows', status: 'approved', member_id: members[3].id, created_at: now - 2 * 3600000, expires_at: now - 1.5 * 3600000, decided_at: now - 1.9 * 3600000, members: [] },
]

const catalog: PermissionInfo[] = [
  { id: 'members.read', group: 'Membros', label: 'Ver membros', description: 'Lista, busca e detalhes dos membros e dos dispositivos conectados.' },
  { id: 'members.write', group: 'Membros', label: 'Cadastrar e editar membros', description: 'Criar membros e alterar nome, e-mail, plano, validade, dispositivos, bloquear e liberar.' },
  { id: 'members.codes', group: 'Membros', label: 'Renovar código de acesso', description: 'Gerar um novo código WF para o membro (encerra as sessões do app).' },
  { id: 'members.devices', group: 'Membros', label: 'Desconectar dispositivos', description: 'Encerrar as sessões do app de um membro.' },
  { id: 'members.delete', group: 'Membros', label: 'Excluir membros', description: 'Remover o cadastro de um membro em definitivo.' },
  { id: 'requests.manage', group: 'Solicitações', label: 'Aceitar e rejeitar solicitações', description: 'Ver as solicitações de acesso pendentes e decidir sobre elas.' },
  { id: 'addons.manage', group: 'Conteúdo', label: 'Gerenciar addons e canais', description: 'Adicionar, editar, ativar e remover addons de filmes, séries e ao vivo.' },
  { id: 'releases.manage', group: 'Versões do app', label: 'Publicar versões e links', description: 'Publicar instaladores e alterar os links de download dos sites.' },
  { id: 'payments.manage', group: 'Pagamentos', label: 'Configurar pagamentos', description: 'Integração GGCheckout (legado).' },
  { id: 'audit.read', group: 'Atividade', label: 'Ver atividade', description: 'Histórico de ações com quem fez cada uma.' },
  { id: 'admins.manage', group: 'Equipe', label: 'Gerenciar equipe e permissões', description: 'Criar contas do suporte e definir o que cada uma pode fazer. Somente o dono.', ownerOnly: true },
]

const log = (action: string, subject: string, subjectId: string | null = null) =>
  audit.unshift({ id: uuid(), action, subject, created_at: Date.now(), actor_id: owner.id, actor_name: owner.name, subject_id: subjectId })
const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms))
const json = (data: unknown) => JSON.parse(JSON.stringify(data)) as unknown

export async function mockApi(path: string, method: string, body: unknown): Promise<unknown> {
  await delay()
  const [route, query = ''] = path.split('?')
  const params = new URLSearchParams(query)
  const b = (body ?? {}) as Record<string, unknown>

  if (route === 'auth/status') return { bootstrapRequired: false, serverTime: Date.now() }
  if (route === 'auth/login') {
    if (b.password !== 'senha-demo-123') throw new ApiError(401, 'E-mail ou senha incorretos.')
    return { token: 'wfa_' + 'a'.repeat(64), expiresAt: Date.now() + 12 * 3600000, absoluteExpiresAt: Date.now() + 7 * DAY, user: owner }
  }
  if (route === 'auth/me') return { user: { ...owner, kind: 'user' }, permissionsCatalog: catalog, sessionExpiresAt: Date.now() + 12 * 3600000, absoluteExpiresAt: Date.now() + 7 * DAY, serverTime: Date.now() }
  if (route === 'auth/logout' || route === 'auth/password') return { ok: true }
  audit.sort((a, b) => b.created_at - a.created_at)
  if (route === 'snapshot') return json({ members, addons, audit: audit.slice(0, 50), serverTime: Date.now() })

  if (route === 'members' && method === 'POST') {
    const id = uuid()
    const input = b as { name: string; email: string; plan: 'basic' | 'max'; status: 'active' | 'blocked'; lifetime?: boolean; expiresAt?: number; maxDevices: number; notes: string }
    members.unshift({ id, name: input.name, email: input.email, plan: input.plan, status: input.status, expires_at: input.lifetime ? LIFETIME : input.expiresAt ?? LIFETIME, max_devices: input.maxDevices, notes: input.notes, created_at: Date.now(), updated_at: Date.now(), devices: [] })
    log('Membro criado', `${input.name} · ${input.plan}`, id)
    return { id, code: code() }
  }
  const mm = route.match(/^members\/([^/]+)(?:\/(rotate|devices))?$/)
  if (mm) {
    const m = members.find((x) => x.id === mm[1])
    if (!m) throw new ApiError(404, 'Membro não encontrado.')
    if (mm[2] === 'rotate') { m.devices = []; log('Código renovado', m.name, m.id); return { code: code() } }
    if (mm[2] === 'devices') { m.devices = []; log('Dispositivos desconectados', m.name, m.id); return { ok: true } }
    if (method === 'DELETE') { members.splice(members.indexOf(m), 1); log('Membro removido', m.name, m.id); return { ok: true } }
    if (method === 'PUT') {
      const input = b as { name: string; email: string; plan: 'basic' | 'max'; status: 'active' | 'blocked'; lifetime?: boolean; expiresAt?: number; maxDevices: number; notes: string }
      Object.assign(m, { name: input.name, email: input.email, plan: input.plan, status: input.status, expires_at: input.lifetime ? LIFETIME : input.expiresAt ?? m.expires_at, max_devices: input.maxDevices, notes: input.notes, updated_at: Date.now() })
      if (input.status === 'blocked') m.devices = []
      log('Acesso atualizado', `${m.name} · ${m.plan} · ${m.status}`, m.id)
      return { ok: true }
    }
  }

  if (route === 'access-requests') return json({ requests })
  const rm = route.match(/^access-requests\/([^/]+)\/(approve|reject)$/)
  if (rm) {
    const r = requests.find((x) => x.id === rm[1])
    if (!r || r.status !== 'pending') throw new ApiError(409, 'Solicitação encerrada ou vencida. Atualize o painel.')
    r.status = rm[2] === 'approve' ? 'approved' : 'rejected'
    r.decided_at = Date.now()
    if (rm[2] === 'approve' && typeof b.plan === 'string') {
      const id = uuid()
      members.unshift({ id, name: r.email.split('@')[0], email: r.email, plan: b.plan as 'basic' | 'max', status: 'active', expires_at: LIFETIME, max_devices: 1, notes: 'Criado ao aceitar solicitação de acesso', created_at: Date.now(), updated_at: Date.now(), devices: [] })
      r.member_id = id
      log('Solicitação aceita e membro criado', `${r.email} · ${r.audience} · ${r.device_name}`, id)
    } else log(rm[2] === 'approve' ? 'Solicitação de acesso aceita' : 'Solicitação de acesso rejeitada', `${r.email} · ${r.audience} · ${r.device_name}`, (b.memberId as string) ?? null)
    return { ok: true, memberId: r.member_id }
  }

  if (route === 'setup-defaults') { log('Addons padrão restaurados', ''); return { ok: true } }
  if (route === 'addons' && method === 'POST') {
    const input = b as { name: string; url: string; kind: 'stremio' | 'plugin'; content: 'vod' | 'live'; minPlan: 'basic' | 'max'; enabled: boolean; sortOrder: number }
    if (addons.some((a) => a.url === input.url)) throw new ApiError(409, 'Esse endereço já está cadastrado.')
    const id = uuid()
    addons.push({ id, name: input.name, url: input.url, kind: input.kind, content: input.content, min_plan: input.minPlan, enabled: input.enabled ? 1 : 0, sort_order: input.sortOrder, updated_at: Date.now() })
    log('Addon adicionado', `${input.name} · ${input.content} · ${input.minPlan}`, id)
    return { id }
  }
  const am = route.match(/^addons\/([^/]+)$/)
  if (am) {
    const a = addons.find((x) => x.id === am[1])
    if (!a) throw new ApiError(404, 'Addon não encontrado.')
    if (method === 'DELETE') { addons.splice(addons.indexOf(a), 1); log('Addon removido', a.name, a.id); return { ok: true } }
    const input = b as { name: string; url: string; kind: 'stremio' | 'plugin'; content: 'vod' | 'live'; minPlan: 'basic' | 'max'; enabled: boolean; sortOrder: number }
    Object.assign(a, { name: input.name, url: input.url, kind: input.kind, content: input.content, min_plan: input.minPlan, enabled: input.enabled ? 1 : 0, sort_order: input.sortOrder, updated_at: Date.now() })
    log('Addon atualizado', `${a.name} · ${a.content} · ${a.min_plan}`, a.id)
    return { id: a.id }
  }

  if (route === 'users' && method === 'GET') return json({ users, permissionsCatalog: catalog })
  if (route === 'users' && method === 'POST') {
    const input = b as { email: string; name: string; role: 'owner' | 'staff'; permissions: AdminUser['permissions'] }
    if (users.some((u) => u.email === input.email)) throw new ApiError(409, 'Já existe uma conta com esse e-mail.')
    const id = uuid()
    users.push({ id, email: input.email, name: input.name, role: input.role, permissions: input.role === 'owner' ? ['*'] : input.permissions, status: 'active', mustChangePassword: true, createdAt: Date.now(), updatedAt: Date.now(), lastLoginAt: null, activeSessions: 0 })
    log('Usuário criado', `${input.name} · ${input.email[0]}***@${input.email.split('@')[1]} · ${input.role === 'owner' ? 'dono' : 'suporte'}`, id)
    return { id, temporaryPassword: 'Kx7mP2vQ9rT4wZ8nB3cD' }
  }
  const um = route.match(/^users\/([^/]+)(?:\/(reset-password|sessions))?$/)
  if (um) {
    const u = users.find((x) => x.id === um[1])
    if (!u) throw new ApiError(404, 'Usuário não encontrado.')
    if (um[2] === 'reset-password') { log('Senha redefinida', u.name, u.id); return { temporaryPassword: 'Rt5nW8pL2sX6vK9mQ3bH' } }
    if (um[2] === 'sessions') { u.activeSessions = 0; return { ok: true } }
    if (method === 'DELETE') { if (u.id === owner.id) throw new ApiError(400, 'Você não pode excluir a própria conta.'); users.splice(users.indexOf(u), 1); log('Usuário removido', u.name, u.id); return { ok: true } }
    if (u.id === owner.id && (b.role !== undefined || b.status !== undefined || b.permissions !== undefined)) throw new ApiError(400, 'Você não pode alterar seu próprio papel, status ou permissões.')
    Object.assign(u, { name: (b.name as string) ?? u.name, role: (b.role as AdminUser['role']) ?? u.role, status: (b.status as AdminUser['status']) ?? u.status, permissions: (b.permissions as AdminUser['permissions']) ?? u.permissions, updatedAt: Date.now() })
    log('Usuário atualizado', `${u.name} · ${u.role === 'owner' ? 'dono' : 'suporte'} · ${u.status}`, u.id)
    return { ok: true }
  }

  if (route === 'audit') {
    const limit = Number(params.get('limit')) || 100
    const before = Number(params.get('before')) || Infinity
    const subject = params.get('subject')
    const actor = params.get('actor')
    const q = (params.get('q') ?? '').toLowerCase()
    const entries = audit
      .filter((e) => e.created_at < before && (!subject || e.subject_id === subject) && (!actor || (actor === 'legacy' ? !e.actor_id : e.actor_id === actor)) && (!q || `${e.action} ${e.subject} ${e.actor_name}`.toLowerCase().includes(q)))
      .slice(0, limit)
    return json({ entries, nextBefore: entries.length === limit ? entries[entries.length - 1].created_at : null })
  }

  if (route === 'ggcheckout') return { settings: { basic_product_id: '', max_product_id: '', enabled: 0, mail_from: '' }, readiness: { webhookSecret: true, deliveryKey: true, emailKey: false, sender: false, products: false }, checkoutUrls: {}, webhookUrl: '', memberUrl: '', purchases: [], mailJobs: [] }

  throw new ApiError(404, 'Operação não encontrada.')
}
