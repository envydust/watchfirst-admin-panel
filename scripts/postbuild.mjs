// GitHub Pages has no SPA rewrite: a copy of index.html as 404.html makes deep links load the app.
// .nojekyll keeps Pages from ignoring files that start with an underscore.
import { copyFileSync, writeFileSync, existsSync } from 'node:fs'
const dist = new URL('../dist/', import.meta.url)
if (!existsSync(new URL('index.html', dist))) throw new Error('dist/index.html not found; run vite build first')
copyFileSync(new URL('index.html', dist), new URL('404.html', dist))
writeFileSync(new URL('.nojekyll', dist), '')
console.log('postbuild: 404.html and .nojekyll written')
