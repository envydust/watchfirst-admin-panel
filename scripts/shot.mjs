// Screenshot a URL at an exact viewport using headless Chrome over CDP (true device emulation, so
// mobile widths are honored instead of Chrome's minimum window width).
// Usage: node scripts/shot.mjs <chrome.exe> <out.png> <url> <width> <height> [scale] [fullPage]
import { spawn } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const [chrome, out, url, w = '1440', h = '900', scale = '1', fullPage = '0'] = process.argv.slice(2)
const port = 9400 + Math.floor(Math.random() * 400)
const profile = mkdtempSync(join(tmpdir(), 'wf-shot-'))
const proc = spawn(chrome, [`--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, '--headless=new', '--disable-gpu', '--no-first-run', '--hide-scrollbars', '--window-size=1600,1000', 'about:blank'], { stdio: 'ignore' })

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
async function version() {
  for (let i = 0; i < 50; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${port}/json/version`)
      if (r.ok) return r.json()
    } catch {}
    await sleep(100)
  }
  throw new Error('chrome did not start')
}

const { webSocketDebuggerUrl } = await version()
const ws = new WebSocket(webSocketDebuggerUrl)
await new Promise((r, j) => { ws.onopen = r; ws.onerror = j })
let id = 0
const pending = new Map()
ws.onmessage = (e) => {
  const m = JSON.parse(e.data)
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id) }
}
const send = (method, params = {}, sessionId) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params, sessionId })) })

const { result: { targetId } } = await send('Target.createTarget', { url: 'about:blank' })
const { result: { sessionId } } = await send('Target.attachToTarget', { targetId, flatten: true })
await send('Emulation.setDeviceMetricsOverride', { width: Number(w), height: Number(h), deviceScaleFactor: Number(scale), mobile: Number(w) < 800 }, sessionId)
await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: 'dark' }, { name: 'prefers-reduced-motion', value: 'reduce' }] }, sessionId)
await send('Page.enable', {}, sessionId)
await send('Page.navigate', { url }, sessionId)
await sleep(2500)
const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: fullPage === '1', ...(fullPage === '1' ? { clip: undefined } : {}) }, sessionId)
writeFileSync(out, Buffer.from(shot.result.data, 'base64'))
console.log(`${out} (${w}x${h}@${scale})`)
await send('Browser.close')
ws.close()
proc.kill()
