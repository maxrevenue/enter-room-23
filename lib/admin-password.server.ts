import { getCloudflareContext } from '@opennextjs/cloudflare'
import { getAdminPassword } from '@/lib/admin-auth'

/**
 * Resolve ADMIN_PASSWORD at request time.
 * Prefer the Worker secret via Cloudflare context so a Next.js build-time
 * process.env inline cannot hide the live secret.
 */
export async function resolveAdminPassword(): Promise<string> {
  try {
    const { env } = await getCloudflareContext({ async: true })
    const envRecord = env as unknown as Record<string, unknown>
    const fromEnv = typeof envRecord.ADMIN_PASSWORD === 'string' ? envRecord.ADMIN_PASSWORD : ''
    if (fromEnv.trim()) return fromEnv.trim()
  } catch {
    /* fall through to process.env */
  }

  return getAdminPassword()
}
