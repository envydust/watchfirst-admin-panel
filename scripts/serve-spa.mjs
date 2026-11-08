// Minimal static server with SPA fallback, for local screenshots/QA of a built bundle.
// Usage: node scripts/serve-spa.mjs <dir> <port>
import { createServer } from 'node:http'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { extname, join, normalize } from 'node:path'

const [dir = 'dist', port = '4175'] = process.argv.slice(2)
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.ico': 'image/x-icon' }

createServer((req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost')
  let file = normalize(join(dir, decodeURIComponent(url.pathname)))
  if (!file.startsWith(normalize(dir))) file = join(dir, 'index.html')
  if (!existsSync(file) || statSync(file).isDirectory()) file = join(dir, 'index.html')
  res.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream', 'cache-control': 'no-store' })
  res.end(readFileSync(file))
}).listen(Number(port), '127.0.0.1', () => console.log(`serving ${dir} at http://127.0.0.1:${port}`))
