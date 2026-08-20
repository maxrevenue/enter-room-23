import { describe, it, before, after } from 'node:test'
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

describe('polsia worker proxy', () => {
  it('defines an early /polsia hostname rewrite in src/index.js', () => {
    const source = read('src/index.js')
    assert.match(source, /url\.pathname\.startsWith\(["']\/polsia["']\)/)
    assert.match(source, /url\.hostname\s*=\s*["']room23\.polsia\.app["']/)
    assert.match(source, /return\s+fetch\(url,\s*request\)/)
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
    globalThis.fetch = async (url, request) => {
      const href = typeof url === 'string' ? url : url.href
      proxied.push({ href, method: request?.method })
      return new Response('proxied')
    }

    handler = (await import(pathToFileURL(join(tempDir, 'index.js')).href)).default
  })

  after(() => {
    globalThis.fetch = originalFetch
    if (tempDir && existsSync(tempDir)) {
      rmSync(tempDir, { recursive: true, force: true })
    }
  })

  it('proxies /polsia and /polsia/* to room23.polsia.app', async () => {
    proxied.length = 0
    const res = await handler.fetch(
      new Request('https://room23.net/polsia/lobby?x=1', { method: 'GET' }),
      {},
      {},
    )
    assert.equal(await res.text(), 'proxied')
    assert.equal(proxied.length, 1)
    assert.equal(proxied[0].href, 'https://room23.polsia.app/polsia/lobby?x=1')
  })

  it('leaves non-polsia storefront paths untouched', async () => {
    proxied.length = 0
    const res = await handler.fetch(new Request('https://room23.net/shop'), {}, {})
    assert.equal(await res.text(), 'storefront:/shop')
    assert.equal(proxied.length, 0)
  })
})
