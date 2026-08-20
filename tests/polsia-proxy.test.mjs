import { describe, it, before, after, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import {
  copyFileSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
  existsSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { spawnSync } from 'node:child_process'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

function read(rel) {
  return readFileSync(join(root, rel), 'utf8')
}

function toRequest(input, init) {
  if (input instanceof Request && init === undefined) return input
  if (input instanceof Request) return new Request(input, init)
  const href = typeof input === 'string' ? input : input.href
  return new Request(href, init)
}

describe('polsia worker proxy', () => {
  it('strips /polsia, overrides Host, and rewrites Polsia redirects', () => {
    const source = read('src/index.js')
    assert.match(source, /pathname === POLSIA_PREFIX \|\| pathname\.startsWith\(`\$\{POLSIA_PREFIX\}\/`\)/)
    assert.match(source, /headers\.set\(["']Host["'],\s*POLSIA_HOST\)/)
    assert.match(source, /stripPolsiaPrefix/)
    assert.match(source, /rewritePolsiaLocation/)
    assert.match(source, /redirect:\s*["']manual["']/)
    assert.match(source, /openNextHandler\.fetch\(request,\s*env,\s*ctx\)/)
  })

  it('leaves wrangler.jsonc main on the OpenNext worker path', () => {
    const wrangler = read('wrangler.jsonc')
    assert.match(wrangler, /"main"\s*:\s*"\.open-next\/worker\.js"/)
    assert.doesNotMatch(wrangler, /room23\.polsia\.app/)
  })

  it('hooks the wrap script into Cloudflare build/deploy scripts', () => {
    const pkg = JSON.parse(read('package.json'))
    assert.match(pkg.scripts['cf:build'], /wrap-opennext-worker\.mjs/)
    assert.match(pkg.scripts['cf:preview'], /wrap-opennext-worker\.mjs/)
    assert.match(pkg.scripts['cf:deploy'], /wrap-opennext-worker\.mjs/)
  })

  it('wraps a generated OpenNext worker without mutating the original handler body', () => {
    const dir = mkdtempSync(join(tmpdir(), 'polsia-wrap-'))
    const openNextDir = join(dir, '.open-next')
    const srcDir = join(dir, 'src')
    const scriptsDir = join(dir, 'scripts')
    mkdirSync(openNextDir)
    mkdirSync(srcDir)
    mkdirSync(scriptsDir)

    const originalWorker = [
      'export default {',
      '  async fetch(request, env, ctx) {',
      '    return new Response("storefront");',
      '  },',
      '};',
      '',
    ].join('\n')
    writeFileSync(join(openNextDir, 'worker.js'), originalWorker)
    copyFileSync(join(root, 'src/index.js'), join(srcDir, 'index.js'))
    copyFileSync(
      join(root, 'scripts/wrap-opennext-worker.mjs'),
      join(scriptsDir, 'wrap-opennext-worker.mjs'),
    )

    const result = spawnSync(process.execPath, [join(scriptsDir, 'wrap-opennext-worker.mjs')], {
      cwd: dir,
      encoding: 'utf8',
    })
    assert.equal(result.status, 0, result.stderr || result.stdout)
    assert.equal(readFileSync(join(openNextDir, 'opennext-worker.js'), 'utf8'), originalWorker)
    assert.match(readFileSync(join(openNextDir, 'worker.js'), 'utf8'), /\/polsia/)

    // Second wrap is idempotent and keeps the OpenNext original intact.
    const result2 = spawnSync(process.execPath, [join(scriptsDir, 'wrap-opennext-worker.mjs')], {
      cwd: dir,
      encoding: 'utf8',
    })
    assert.equal(result2.status, 0, result2.stderr || result2.stdout)
    assert.equal(readFileSync(join(openNextDir, 'opennext-worker.js'), 'utf8'), originalWorker)

    rmSync(dir, { recursive: true, force: true })
  })
})

describe('polsia fetch routing behavior', () => {
  let tempDir
  let handler
  let proxied
  let originalFetch
  let upstream

  before(async () => {
    tempDir = mkdtempSync(join(tmpdir(), 'polsia-fetch-'))
    writeFileSync(
      join(tempDir, 'opennext-worker.js'),
      [
        'export default {',
        '  async fetch(request) {',
        '    return new Response("storefront:" + new URL(request.url).pathname);',
        '  },',
        '};',
        'export const DOQueueHandler = class {};',
        'export const DOShardedTagCache = class {};',
        'export const BucketCachePurge = class {};',
        '',
      ].join('\n'),
    )
    copyFileSync(join(root, 'src/index.js'), join(tempDir, 'index.js'))

    originalFetch = globalThis.fetch
    proxied = []
    upstream = async () => new Response('proxied')
    globalThis.fetch = async (input, init) => {
      const req = toRequest(input, init)
      proxied.push({
        href: req.url,
        method: req.method,
        host: req.headers.get('Host'),
      })
      return upstream(req)
    }

    handler = (await import(pathToFileURL(join(tempDir, 'index.js')).href)).default
  })

  beforeEach(() => {
    proxied.length = 0
    upstream = async () => new Response('proxied')
  })

  after(() => {
    globalThis.fetch = originalFetch
    if (tempDir && existsSync(tempDir)) {
      rmSync(tempDir, { recursive: true, force: true })
    }
  })

  it('strips /polsia from the proxied pathname', async () => {
    const rootRes = await handler.fetch(new Request('https://room23.net/polsia'), {}, {})
    assert.equal(await rootRes.text(), 'proxied')
    assert.equal(proxied.length, 1)
    assert.equal(proxied[0].href, 'https://room23.polsia.app/')

    proxied.length = 0
    const nested = await handler.fetch(
      new Request('https://room23.net/polsia/login?next=/app', { method: 'GET' }),
      {},
      {},
    )
    assert.equal(await nested.text(), 'proxied')
    assert.equal(proxied.length, 1)
    assert.equal(proxied[0].href, 'https://room23.polsia.app/login?next=/app')
  })

  it('overrides Host to room23.polsia.app', async () => {
    await handler.fetch(new Request('https://room23.net/polsia/lobby'), {}, {})
    assert.equal(proxied.length, 1)
    assert.equal(proxied[0].host, 'room23.polsia.app')
  })

  it('rewrites Polsia Location redirects back onto /polsia', async () => {
    upstream = async () =>
      new Response(null, {
        status: 302,
        headers: { Location: 'https://room23.polsia.app/login' },
      })

    const res = await handler.fetch(new Request('https://room23.net/polsia'), {}, {})
    assert.equal(res.status, 302)
    assert.equal(res.headers.get('Location'), 'https://room23.net/polsia/login')
  })

  it('falls through to OpenNext for non-polsia storefront paths', async () => {
    const res = await handler.fetch(new Request('https://room23.net/shop'), {}, {})
    assert.equal(await res.text(), 'storefront:/shop')
    assert.equal(proxied.length, 0)
  })

  it('does not treat /polsiafoo as a Polsia route', async () => {
    const res = await handler.fetch(new Request('https://room23.net/polsiafoo'), {}, {})
    assert.equal(await res.text(), 'storefront:/polsiafoo')
    assert.equal(proxied.length, 0)
  })
})
