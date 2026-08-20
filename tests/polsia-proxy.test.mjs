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

describe('open-next worker wrapper', () => {
  it('passes all requests through to openNext with no /polsia proxy', () => {
    const source = read('src/index.js')
    assert.match(source, /import\s+openNext\s+from\s+["']\.\/opennext-worker\.js["']/)
    assert.match(source, /return\s+openNext\.fetch\(request,\s*env,\s*ctx\)/)
    assert.doesNotMatch(source, /pathname\.startsWith/)
    assert.doesNotMatch(source, /room23\.polsia\.app/)
    assert.doesNotMatch(source, /headers\.set\(["']Host["']/)
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
    const dir = mkdtempSync(join(tmpdir(), 'opennext-wrap-'))
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
    assert.match(readFileSync(join(openNextDir, 'worker.js'), 'utf8'), /import\s+openNext\s+from/)

    const result2 = spawnSync(process.execPath, [join(scriptsDir, 'wrap-opennext-worker.mjs')], {
      cwd: dir,
      encoding: 'utf8',
    })
    assert.equal(result2.status, 0, result2.stderr || result2.stdout)
    assert.equal(readFileSync(join(openNextDir, 'opennext-worker.js'), 'utf8'), originalWorker)

    rmSync(dir, { recursive: true, force: true })
  })
})

describe('open-next fetch fallthrough', () => {
  let tempDir
  let handler
  let originalFetch
  let fetchCalls

  before(async () => {
    tempDir = mkdtempSync(join(tmpdir(), 'opennext-fetch-'))
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
    fetchCalls = []
    globalThis.fetch = async (...args) => {
      fetchCalls.push(args)
      return new Response('should-not-proxy')
    }

    handler = (await import(pathToFileURL(join(tempDir, 'index.js')).href)).default
  })

  after(() => {
    globalThis.fetch = originalFetch
    if (tempDir && existsSync(tempDir)) {
      rmSync(tempDir, { recursive: true, force: true })
    }
  })

  it('forwards every path to OpenNext, including former /polsia routes', async () => {
    fetchCalls.length = 0
    for (const path of ['/shop', '/polsia', '/polsia/login']) {
      const res = await handler.fetch(new Request(`https://room23.net${path}`), {}, {})
      assert.equal(await res.text(), `storefront:${path}`)
    }
    assert.equal(fetchCalls.length, 0)
  })
})
