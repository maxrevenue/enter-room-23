import { getCloudflareContext } from '@opennextjs/cloudflare'

/**
 * Admin product media uploads (Cloudflare R2).
 *
 * Wrangler binding: MEDIA → bucket "room23-m" (create in dashboard, enable public access or custom domain).
 * Set MEDIA_PUBLIC_BASE_URL (or NEXT_PUBLIC_MEDIA_BASE_URL) to the public origin, e.g.
 * https://media.room23.net — no trailing slash. Objects are stored at products/{productId}/{uuid}.{ext}.
 */

export const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024

type R2BucketLike = {
  put: (
    key: string,
    value: ArrayBuffer | ReadableStream,
    options?: { httpMetadata?: { contentType?: string } },
  ) => Promise<unknown>
}

export function extensionForMime(mime: string): string | null {
  switch (mime) {
    case 'image/jpeg':
      return 'jpg'
    case 'image/png':
      return 'png'
    case 'image/webp':
      return 'webp'
    case 'image/gif':
      return 'gif'
    default:
      return null
  }
}

export function detectImageMime(bytes: Uint8Array): string | null {
  if (bytes.byteLength < 12) return null
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'image/jpeg'
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return 'image/png'
  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) return 'image/gif'
  if (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return 'image/webp'
  }
  return null
}

export function sanitizeProductMediaId(productId: string) {
  return productId.replace(/[^a-zA-Z0-9_-]+/g, '-').replace(/^-+|-+$/g, '') || 'draft'
}

export function buildMediaObjectKey(productId: string, ext: string) {
  return `products/${sanitizeProductMediaId(productId)}/${crypto.randomUUID()}.${ext}`
}

function readEnvString(record: Record<string, unknown>, key: string) {
  const value = record[key]
  return typeof value === 'string' ? value.trim() : ''
}

export async function resolveMediaPublicBaseUrl(): Promise<string> {
  try {
    const { env } = await getCloudflareContext({ async: true })
    const envRecord = env as unknown as Record<string, unknown>
    for (const key of ['MEDIA_PUBLIC_BASE_URL', 'NEXT_PUBLIC_MEDIA_BASE_URL']) {
      const value = readEnvString(envRecord, key)
      if (value) return value.replace(/\/$/, '')
    }
  } catch {
    /* local dev without Worker bindings */
  }

  for (const key of ['MEDIA_PUBLIC_BASE_URL', 'NEXT_PUBLIC_MEDIA_BASE_URL']) {
    const value = typeof process.env[key] === 'string' ? process.env[key].trim() : ''
    if (value) return value.replace(/\/$/, '')
  }

  return ''
}

export async function getMediaBucket(): Promise<R2BucketLike | null> {
  try {
    const { env } = await getCloudflareContext({ async: true })
    const bucket = (env as unknown as Record<string, unknown>).MEDIA
    if (bucket && typeof bucket === 'object' && typeof (bucket as R2BucketLike).put === 'function') {
      return bucket as R2BucketLike
    }
  } catch {
    /* not running on Cloudflare */
  }
  return null
}

export function publicUrlForKey(key: string, baseUrl: string) {
  return `${baseUrl.replace(/\/$/, '')}/${key}`
}

export async function isMediaStorageConfigured() {
  const [bucket, baseUrl] = await Promise.all([getMediaBucket(), resolveMediaPublicBaseUrl()])
  return Boolean(bucket && baseUrl)
}

export async function putAdminMediaObject(options: {
  productId: string
  mime: string
  bytes: ArrayBuffer
}): Promise<{ ok: true; url: string; key: string } | { ok: false; error: string }> {
  if (!ALLOWED_IMAGE_TYPES.has(options.mime)) {
    return { ok: false, error: 'Unsupported file type. Use JPEG, PNG, WebP, or GIF.' }
  }

  if (options.bytes.byteLength > MAX_UPLOAD_BYTES) {
    return { ok: false, error: 'File is too large. Maximum size is 5MB.' }
  }

  const ext = extensionForMime(options.mime)
  if (!ext) {
    return { ok: false, error: 'Unsupported file type.' }
  }

  const bucket = await getMediaBucket()
  const baseUrl = await resolveMediaPublicBaseUrl()
  if (!bucket || !baseUrl) {
    return { ok: false, error: 'Media storage is not configured.' }
  }

  const key = buildMediaObjectKey(options.productId, ext)
  await bucket.put(key, options.bytes, {
    httpMetadata: { contentType: options.mime },
  })

  return { ok: true, url: publicUrlForKey(key, baseUrl), key }
}
