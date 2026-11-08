# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

delegated: Vite + React 19 + TypeScript, Tailwind v4, TanStack Query, react-router, vite-plugin-pwa. Static SPA
(no server, no secrets) published to GitHub Pages at `https://envydust.github.io/watchfirst-admin-panel/`;
later wrapped with Tauri 2 for Windows (.msi) and Android (.apk). Chosen for one codebase across PWA and
apps and for automatic deploys from GitHub Actions. Owner accepted the recommendation (2026-11-07).

## Users

- **Dono (owner)** — the single proprietor of WATCHFIRST, a Brazilian streaming-access business. Works from a
  Windows PC and from the phone; approves access requests several times a day, registers members after a
  sale, blocks or renews accounts, manages which addons each plan receives. Portuguese (pt-BR) only.
- **Suporte (staff)** — one or more helpers the owner invites. Each gets a personal account with a subset of
  functions chosen by the owner (for example: see members and approve requests, but never delete or change
  plans). Must not be able to escalate their own access.

## Product Purpose

The administration panel ("central de controle") for WATCHFIRST: manage members and their access (plan
Básico/MAX, validity or lifetime, device limit, block/unblock, access code), decide on pending access
requests coming from the Windows app and the member sites, manage the catalog of addons and live channels,
publish app versions and download links, and see who did what. Success = the owner and support resolve a
request or a member problem in under a minute, from any device, and every action is attributable.

## Positioning

Replaces an existing single-file panel that depended on ChatGPT-account login and had no roles. The new
panel keeps the same backend and data (service `watchfirst-access`, Cloudflare D1) but adds its own
identity: e-mail + password accounts, per-person permissions, audit with actor, installable as PWA and
packaged as desktop/mobile apps.

## Operating Context

- Backend: `watchfirst-access` (`/api/admin/*`), bearer session `wfa_…`; snapshot of all members every 60 s,
  pending requests every 10 s. Data volumes are small (31 members today; tens of addons; a few admins).
- Access requests expire in 30 minutes; the person is waiting on the other side (app or site), so pending
  requests are the most time-sensitive screen.
- Access codes (`WF-…`) and temporary passwords are returned by the API exactly once and are never
  retrievable again; the owner typically sends the code to the member by WhatsApp.
- Member plans: **Básico** (filmes, séries e animes) and **MAX** (tudo do Básico + addons exclusivos e área
  ao vivo). Live addons require MAX. Lifetime validity is encoded as the year 9999.
- The old panel (ChatGPT Site) stays online during the transition; its actions appear as "Painel legado".

## Capabilities and Constraints

- Phase 1 (this build): login, first-access bootstrap with the emergency key, forced password change,
  overview, members (list/filter/create/edit/block/renew code/disconnect devices/delete), access requests
  (approve choosing a member or creating one, reject, history), addons (VOD and live), activity with actor,
  team and permissions (owner only), account.
- Phase 2: app versions (builds, publish official release, download links the member sites show).
- Phase 3: Tauri packaging. Same code; CORS origins `http://tauri.localhost` / `tauri://localhost`.
- Constraints: no secrets in the SPA; token in localStorage; hosted under a sub-path (`base`
  `/watchfirst-admin-panel/`) until the custom domain `admin.watchfirst.com.br` is configured; GitHub
  Pages deploy through the `gh-pages` branch (Actions artifact storage is full); API origin configurable
  (`VITE_API_ORIGIN`, default the service's own domain).
- Terminology (pt-BR, as the owner uses it): Membros, Solicitações de acesso, Addons e conteúdo, Atividade,
  Equipe, Versões do app, Código de acesso, Plano Básico / MAX, vitalício, dispositivos, bloquear/liberar.
- Undecided: TOTP 2FA (column reserved), password reset by e-mail (Resend exists but is not wired for admins).

## Brand Commitments

- Name **WATCHFIRST**, written "WATCH" in white and "FIRST" in green `#39FF14`; dark theme; pt-BR copy.
- Owner asked to keep the current panel's visual language as the base (near-black ground, green accent,
  left sidebar, summary cards, "Atualizar" and "+ Novo membro" actions) and improve the UX on top of it.
- Logo assets exist in `envydust/streamingvendas` (`watchfirst-build/logo-assets.json`, PNG/ICO).

## Evidence on Hand

- Screenshot of the current panel (Membros screen) provided by the owner on 2026-11-07.
- Real API contract: `envydust/watchfirst-access` PR #1 (`ADMIN-PANEL.md`), `scripts/admin-handler.txt` of
  the old panel. Real counts today: 31 active members, 7 Básico, 24 MAX, 0 expiring in 7 days.
- No testimonials, pricing or marketing claims belong in this product; it is an internal tool.

## Product Principles

1. The pending request is the most urgent object in the product; it must be visible from every screen.
2. Every destructive or irreversible action (delete, renew code, disconnect, reject) is confirmed with its
   consequence spelled out, and shows exactly once what cannot be shown again.
3. Support sees only what the owner allowed; hidden controls are also refused by the server.
4. Familiar admin patterns over invention; brand lives in precise details, not in novelty.
5. Works the same in the browser, installed as PWA, and inside the desktop/mobile wrappers.

## Accessibility & Inclusion

Keyboard-operable throughout; visible focus; text contrast ≥ 4.5:1 on the dark ground (green `#39FF14`
reserved for emphasis, controls and indicators, never for long text); respects `prefers-reduced-motion`.
