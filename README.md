# WATCHFIRST Admin — painel de administração

Central de controle do WATCHFIRST: membros e acesso, solicitações, addons e canais, atividade e equipe.
Site estático (SPA) sem segredos, instalável como PWA, que fala com o serviço de acesso
(`envydust/watchfirst-access`) pela API `/api/admin/*` com sessão própria (e-mail + senha).

- Publicado em **https://envydust.github.io/watchfirst-admin-panel/** a cada push em `main`
  (workflow `Publicar painel`, branch `gh-pages`).
- Referência técnica da API e das permissões: `ADMIN-PANEL.md` no repositório do serviço.

## Desenvolvimento

```sh
npm install
npm run dev                      # http://localhost:5173 (precisa de ADMIN_DEV_CORS=1 no serviço)
npm run typecheck && npm run build
```

Variáveis (opcionais, em `.env.local`):

| Nome | Padrão | Uso |
|---|---|---|
| `VITE_API_ORIGIN` | `https://acesso.watchfirst.com.br` | Origem do serviço de acesso |
| `VITE_BASE` | `/watchfirst-admin-panel/` | Caminho base (use `/` em domínio próprio ou no Tauri) |
| `VITE_MOCK` | — | `1` compila uma demonstração com dados simulados, já logada como dono |

Demonstração local com dados simulados:

```sh
VITE_MOCK=1 VITE_BASE=/ npx vite build --outDir dist-mock   # no Git Bash: MSYS_NO_PATHCONV=1 antes
node scripts/serve-spa.mjs dist-mock 4175
```

`scripts/shot.mjs` captura telas em um viewport exato via Chrome headless (CDP), usado na revisão visual.

## Estrutura

`src/api` (cliente, tipos, endpoints, mock) · `src/auth` (sessão, permissões, gate de rota) ·
`src/app` (roteador, layout, query client) · `src/components/ui` (primitivos) · `src/features/*` (telas).
Contexto de produto em `PRODUCT.md`; direção visual em `DESIGN.md`.
