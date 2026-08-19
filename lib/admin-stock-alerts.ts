import { getCloudflareContext } from '@opennextjs/cloudflare'
import { Resend } from 'resend'
import { SITE_CONFIG } from '@/config/site'
import { LOW_STOCK_THRESHOLD } from '@/lib/admin-catalog'
import { getRoom23Db } from '@/lib/admin-db'

export type StockAlertLevel = 'low' | 'out'

async function readEnvString(key: string): Promise<string> {
  try {
    const { env } = await getCloudflareContext({ async: true })
    const value = (env as unknown as Record<string, unknown>)[key]
    if (typeof value === 'string' && value.trim()) return value.trim()
  } catch {
    /* local dev without Worker bindings */
  }

  const value = process.env[key]
  return typeof value === 'string' ? value.trim() : ''
}

export function parseStockAlertDate(value: unknown): Date | null {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value
  if (typeof value === 'string' && value.trim()) {
    const parsed = new Date(value)
    return Number.isNaN(parsed.getTime()) ? null : parsed
  }
  return null
}

export function formatStockAlertSentAt(value: unknown): string | null {
  const date = parseStockAlertDate(value)
  if (!date) return null
  return date.toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export function stockLevelForQuantity(quantity: number | null): StockAlertLevel | null {
  if (quantity === null) return null
  if (quantity === 0) return 'out'
  if (quantity <= LOW_STOCK_THRESHOLD) return 'low'
  return null
}

export function isHealthyQuantity(quantity: number | null): boolean {
  return quantity !== null && quantity > LOW_STOCK_THRESHOLD
}

export function decideStockAlertLevel(input: {
  previousQuantity: number | null
  nextQuantity: number | null
  lowStockAlertSentAt?: Date | null
  lowStockAlertLevel?: StockAlertLevel | null
}): StockAlertLevel | null {
  const nextLevel = stockLevelForQuantity(input.nextQuantity)
  if (!nextLevel) return null

  const previousQuantity = input.previousQuantity
  const previousLevel = stockLevelForQuantity(previousQuantity)
  const neverSent = !input.lowStockAlertSentAt && !input.lowStockAlertLevel

  if (neverSent) return nextLevel
  if (nextLevel === 'out' && previousLevel !== 'out') return 'out'
  if (nextLevel === 'low' && isHealthyQuantity(previousQuantity)) return 'low'

  return null
}

export function stockAlertResetUpdate(nextQuantity: number | null) {
  if (nextQuantity !== null && nextQuantity > LOW_STOCK_THRESHOLD) {
    return {
      $unset: { lowStockAlertSentAt: '', lowStockAlertLevel: '' },
      $set: { updatedAt: new Date() },
    }
  }
  return null
}

async function resolveAdminRecipient() {
  const adminEmail = await readEnvString('ADMIN_EMAIL')
  const contactEmail = await readEnvString('CONTACT_TO_EMAIL')
  return adminEmail || contactEmail || SITE_CONFIG.supportEmail
}

async function resolveAppBaseUrl() {
  const appUrl = await readEnvString('NEXT_PUBLIC_APP_URL')
  const siteUrl = await readEnvString('NEXT_PUBLIC_SITE_URL')
  return (appUrl || siteUrl || 'https://room23.net').replace(/\/$/, '')
}

export async function sendLowStockAlertEmail(input: {
  productId: string
  productName: string
  quantity: number
  level: StockAlertLevel
}) {
  const apiKey = await readEnvString('RESEND_API_KEY')
  if (!apiKey) {
    console.info(
      JSON.stringify({
        scope: 'stock-alert',
        skipped: true,
        reason: 'missing_resend_key',
        productId: input.productId,
        level: input.level,
      }),
    )
    return { sent: false as const }
  }

  const to = await resolveAdminRecipient()
  const baseUrl = await resolveAppBaseUrl()
  const editUrl = `${baseUrl}/admin/products/${encodeURIComponent(input.productId)}`
  const subject =
    input.level === 'out'
      ? `[Room 23] Out of stock: ${input.productName}`
      : `[Room 23] Low stock: ${input.productName}`

  const text = [
    input.level === 'out' ? 'Out of stock alert' : 'Low stock alert',
    '',
    `Product: ${input.productName}`,
    `ID: ${input.productId}`,
    `Quantity: ${input.quantity}`,
    input.level === 'low' ? `Threshold: ${LOW_STOCK_THRESHOLD} or fewer remaining` : null,
    '',
    `Edit: ${editUrl}`,
  ]
    .filter(Boolean)
    .join('\n')

  const resend = new Resend(apiKey)
  const { error } = await resend.emails.send({
    from: `Room 23 Inventory <noreply@${SITE_CONFIG.domain}>`,
    to: [to],
    subject,
    text,
  })

  if (error) {
    console.error(
      JSON.stringify({
        scope: 'stock-alert',
        productId: input.productId,
        level: input.level,
        error: error.message || 'send_failed',
      }),
    )
    return { sent: false as const }
  }

  return { sent: true as const }
}

export async function handleStockAlertAfterQuantityChange(input: {
  productId: string
  productName: string
  previousQuantity: number | null
  nextQuantity: number | null
  lowStockAlertSentAt?: unknown
  lowStockAlertLevel?: StockAlertLevel | null
}) {
  const db = await getRoom23Db()
  if (!db) return

  const resetUpdate = stockAlertResetUpdate(input.nextQuantity)
  if (resetUpdate) {
    await db.collection('products').updateOne({ id: input.productId }, resetUpdate)
    return
  }

  const alertLevel = decideStockAlertLevel({
    previousQuantity: input.previousQuantity,
    nextQuantity: input.nextQuantity,
    lowStockAlertSentAt: parseStockAlertDate(input.lowStockAlertSentAt),
    lowStockAlertLevel: input.lowStockAlertLevel ?? null,
  })

  if (!alertLevel || input.nextQuantity === null) return

  const sendResult = await sendLowStockAlertEmail({
    productId: input.productId,
    productName: input.productName,
    quantity: input.nextQuantity,
    level: alertLevel,
  })

  if (!sendResult.sent) return

  await db.collection('products').updateOne(
    { id: input.productId },
    {
      $set: {
        lowStockAlertSentAt: new Date(),
        lowStockAlertLevel: alertLevel,
        updatedAt: new Date(),
      },
    },
  )
}
