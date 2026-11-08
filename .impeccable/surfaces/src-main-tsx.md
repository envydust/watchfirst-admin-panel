---
version: 1
slug: "src-main-tsx"
primary_target: "src/main.tsx"
related_targets: []
---

# Surface: WATCHFIRST Admin (whole app shell + Membros / Solicitações / Addons / Atividade / Equipe)

Mode: Operate. Build path: code-led (Operate surface; no comp).

Audience: owner and invited support staff, pt-BR, Windows PC first, phone second. Job: resolve access
requests fast, keep members' access correct, maintain addons, see who did what. Proof/content: real data
from `/api/admin/*`. Constraints: static SPA, sub-path base, no secrets, permission-aware UI, keep the
incumbent brand (near-black + green #39FF14, left sidebar, summary cards).

## Direction contract

THESIS: A control room for people waiting on the other side. The pending access request is the first-class
object: it is counted in the sidebar, surfaced on the overview and answered in two clicks. Refuses the
category default of a KPI-hero dashboard whose numbers lead nowhere; every number here is a filter you can
click.

OWN-WORLD: Blue-black grounds (#080C10 page, #0C141A rail/panels, #111B22 raised), hairlines at 7% white,
one accent (#39FF14) for the primary action, the current nav item, selection and "live" indicators; soft
pale-green (#B8F5A8) for small accented text; state colours: amber #FFC857 (vence em breve), red #FF6B7A
(bloqueado/erro), blue #6CB8FF (info). One self-hosted humanist sans (Figtree) with tabular numerals for
all data. Plan identity as compact chips (BÁSICO outline, MAX filled green). Signature move: the one-time
reveal of an access code or temporary password is a perforated cinema ticket ("ingresso") with the code in
large tabular type, Copy and WhatsApp actions, and a tear-off notice that it will not be shown again.

STORY: I open the panel, see at once if someone is waiting (badge + overview card), decide, and the member
is in. When I register a member I get the ticket once, send it, done. Support sees only their functions;
nothing they cannot do is on screen. Later I read Atividade and know who did what.

FIRST VIEWPORT (desktop 1440): left rail 240px with WATCHFIRST wordmark, "Central de controle", nav
(Visão geral · Membros · Solicitações [badge] · Addons e conteúdo · Atividade · Equipe · Configurações),
user chip at the bottom. Main: title row (page title left; "Atualizar" ghost and "+ Novo membro" green
primary on the right), four summary stats in one row (Membros ativos · Básico · MAX · Vencem em 7 dias)
each clickable as a filter, then the members table filling the rest: search + plan/status/validity filters
above, columns Membro (name + e-mail), Plano, Situação, Validade (relative, amber when ≤7 d), Dispositivos
(used/limit), row actions menu. No eyebrow/kicker above titles. Mobile: rail becomes a top bar with
drawer; stats scroll horizontally; table rows become cards.

FORM: standard admin shell (side rail + content), position 1 of my ordered list because the owner pinned
the incumbent arrangement (screenshot of the current panel, 2026-11-07); the direction roll was not run
for a pinned incumbent world, so no SEED REFERENCE exists; seed: not rolled (owner pinned the incumbent
form, 2026-11-07)

Adaptations recorded after the finish review: the index route is Visão geral (THESIS/STORY put the pending
request first), with Membros as described in FIRST VIEWPORT one click away; Validade shows a relative label
only when it matters (≤ 7 days, or expired) and the absolute date otherwise, because renewals are what the
owner acts on; stat tiles scroll horizontally on phones as a snap row.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict,
DESIGN.md, and every shipping raster carrying its provenance

## Unresolved
Custom domain timing (admin.watchfirst.com.br); whether Pagamentos (GGCheckout legado) gets a screen in
phase 1 (default: inside Configurações, hidden without payments.manage).
