import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

function read(rel) {
  return readFileSync(join(root, rel), 'utf8')
}

describe('admin phase 10 media upload', () => {
  it('detects allowed image mime types from bytes in admin-media', () => {
    const media = read('lib/admin-media.ts')
    assert.match(media, /ALLOWED_IMAGE_TYPES/)
    assert.match(media, /detectImageMime/)
    assert.match(media, /image\/gif/)
    assert.doesNotMatch(media, /image\/svg/)
    assert.match(media, /MAX_UPLOAD_BYTES = 5 \* 1024 \* 1024/)
  })

  it('builds randomized product object keys and public URLs', () => {
    const media = read('lib/admin-media.ts')
    assert.match(media, /buildMediaObjectKey/)
    assert.match(media, /products\/\$\{sanitizeProductMediaId/)
    assert.match(media, /crypto\.randomUUID/)
    assert.match(media, /publicUrlForKey/)
  })

  it('keeps upload route admin-only and wired to R2 helpers', () => {
    const route = read('app/api/admin/upload/route.ts')
    const media = read('lib/admin-media.ts')
    assert.match(route, /isAdminAuthenticated/)
    assert.match(route, /putAdminMediaObject/)
    assert.match(route, /detectImageMime/)
    assert.match(route, /401/)
    assert.match(media, /getCloudflareContext/)
    assert.match(media, /MEDIA/)
    assert.match(media, /MEDIA_PUBLIC_BASE_URL/)
    assert.match(media, /Media storage is not configured/)
  })

  it('uses a client upload control with gallery slot field names', () => {
    const fields = read('components/admin/product-image-fields.tsx')
    const editor = read('app/admin/products/product-fields.tsx')
    assert.match(fields, /'use client'/)
    assert.match(fields, /fetch\('\/api\/admin\/upload'/)
    assert.match(fields, /name="image"/)
    assert.match(fields, /name=\{`imageUrl\$\{index\}`\}/)
    assert.match(fields, /name=\{`imageAlt\$\{index\}`\}/)
    assert.match(fields, /Media storage is not configured/)
    assert.match(editor, /ProductImageFields/)
  })

  it('documents R2 binding and public media base URL placeholders', () => {
    const wrangler = read('wrangler.jsonc')
    const envExample = read('.env.example')
    assert.match(wrangler, /"binding": "MEDIA"/)
    assert.match(wrangler, /room23-media/)
    assert.match(envExample, /MEDIA_PUBLIC_BASE_URL/)
  })
})
