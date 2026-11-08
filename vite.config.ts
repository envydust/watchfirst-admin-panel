import { readFileSync } from 'node:fs'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')) as { version: string }

// Production-only CSP: dev needs inline scripts for React refresh, so the meta is injected at build time.
function csp(apiOrigin: string): Plugin {
  return {
    name: 'watchfirst-csp',
    apply: 'build',
    transformIndexHtml(html) {
      const policy = [
        "default-src 'self'",
        `connect-src 'self' ${apiOrigin}`,
        "img-src 'self' data:",
        "style-src 'self' 'unsafe-inline'",
        "font-src 'self'",
        "script-src 'self'",
        "base-uri 'none'",
        "form-action 'self'",
        "frame-ancestors 'none'",
      ].join('; ')
      return html.replace('<!--csp-->', `<meta http-equiv="Content-Security-Policy" content="${policy}" />`)
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // GitHub Pages serves the panel under the repository sub-path; Tauri and a custom domain use '/'.
  const base = env.VITE_BASE || '/watchfirst-admin-panel/'
  const apiOrigin = (env.VITE_API_ORIGIN || 'https://acesso.watchfirst.com.br').replace(/\/+$/, '')
  return {
    base,
    define: { __API_ORIGIN__: JSON.stringify(apiOrigin), __APP_VERSION__: JSON.stringify(pkg.version) },
    plugins: [
      react(),
      tailwindcss(),
      csp(apiOrigin),
      VitePWA({
        registerType: 'prompt',
        includeAssets: ['icons/*.png', 'fonts/*.woff2'],
        manifest: {
          name: 'WATCHFIRST Admin',
          short_name: 'WF Admin',
          description: 'Central de controle do WATCHFIRST: membros, solicitações, addons e equipe.',
          lang: 'pt-BR',
          display: 'standalone',
          background_color: '#080c10',
          theme_color: '#080c10',
          start_url: base,
          scope: base,
          icons: [
            { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
            { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
            { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,woff2,png,svg}'],
          navigateFallback: `${base}index.html`,
          // Admin data is never cached: every /api call goes to the network.
          runtimeCaching: [{ urlPattern: ({ url }) => url.pathname.startsWith('/api/'), handler: 'NetworkOnly' }],
        },
      }),
    ],
    server: { port: 5173, strictPort: true },
  }
})
