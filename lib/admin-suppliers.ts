import { getCloudflareContext } from '@opennextjs/cloudflare'
import { partitionItems, resolveVendorType, VENDOR_TYPES } from '@/lib/fulfillment'
import type { AdminOrder } from '@/lib/admin-orders'
import {
  checkEldoradoInventory,
  ELDORADO_VENDOR,
  getEldoradoTracking,
  submitEldoradoOrder,
} from '@/lib/suppliers/eldorado.mjs'
import {
  checkWilliamsInventory,
  getWilliamsTracking,
  submitWilliamsOrder,
  WILLIAMS_VENDOR,
} from '@/lib/suppliers/williams.mjs'
import {
  mockCheckInventory,
  mockGetTracking,
  mockSubmitOrder,
  MOCK_VENDOR,
} from '@/lib/suppliers/mock.mjs'

export const SUPPLIER_FETCH_TIMEOUT_MS = 25000

export type SupplierInventoryRow = {
  sku: string
  inStock: boolean
  availableQuantity: number
  leadTimeDays: number | null
}

export type SupplierSubmission = {
  vendor: string
  supplierOrderId: string
  supplierStatus: string
  submittedAt: string
  mock?: boolean
  carrier?: string
  trackingNumber?: string
  trackingStatus?: string
  trackingUpdatedAt?: string
}

export type OrderFulfillmentOps = {
  status?: string
  splitFulfillment?: boolean
  supplierOrderId?: string
  supplierStatus?: string
  submittedAt?: string | Date
  vendor?: string
  carrier?: string
  trackingNumber?: string
  trackingStatus?: string
  trackingUpdatedAt?: string | Date
  supplierError?: string
  supplierErrorAt?: string | Date
  supplierSubmissions?: SupplierSubmission[]
}

export type EnrichedOrderItem = {
  id?: string
  name?: string
  qty?: number
  price?: number
  vendorType?: string
  supplierSku?: string
}

export type SupplierOpsRow = {
  orderId: string
  status?: string
  createdAt?: Date | string
  vendor?: string
  supplierOrderId?: string
  supplierStatus?: string
  submittedAt?: string | Date
  supplierError?: string
  trackingNumber?: string
  trackingStatus?: string
}

const DROPSHIP_VENDORS = new Set([VENDOR_TYPES.ELDORADO_DROPSHIP, VENDOR_TYPES.WILLIAMS_DROPSHIP])

const VENDOR_LABELS: Record<string, string> = {
  [VENDOR_TYPES.ELDORADO_DROPSHIP]: 'Eldorado dropship',
  [VENDOR_TYPES.WILLIAMS_DROPSHIP]: 'Williams dropship',
  [MOCK_VENDOR]: 'Mock supplier',
}

type SupplierEnv = Record<string, string>

type SupplierError = Error & { code?: string; status?: number }

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

export async function readSupplierEnv(): Promise<SupplierEnv> {
  const keys = [
    'ELDORADO_API_URL',
    'ELDORADO_API_KEY',
    'ELDORADO_ACCOUNT',
    'WILLIAMS_API_URL',
    'WILLIAMS_API_KEY',
    'WILLIAMS_ACCOUNT',
  ]
  const env: SupplierEnv = {}
  for (const key of keys) {
    env[key] = await readEnvString(key)
  }
  return env
}

export function supplierVendorLabel(vendor?: string) {
  const key = String(vendor || '').trim()
  return VENDOR_LABELS[key] || key || 'Supplier'
}

export function isDropshipVendor(vendor?: string | null) {
  const resolved = resolveVendorType({ vendorType: vendor || '' })
  return Boolean(resolved && DROPSHIP_VENDORS.has(resolved))
}

export function isDropshipProduct(product: { vendorType?: string; fulfillmentType?: string }) {
  return isDropshipVendor(product.vendorType) || String(product.fulfillmentType || '').trim() === 'dropship'
}

export function getOrderFulfillmentOps(order: AdminOrder): OrderFulfillmentOps {
  return (order.fulfillment as OrderFulfillmentOps | null | undefined) || {}
}

export function getSupplierSubmissions(order: AdminOrder): SupplierSubmission[] {
  const fulfillment = getOrderFulfillmentOps(order)
  if (Array.isArray(fulfillment.supplierSubmissions) && fulfillment.supplierSubmissions.length > 0) {
    return fulfillment.supplierSubmissions
  }
  if (fulfillment.supplierOrderId) {
    return [
      {
        vendor: fulfillment.vendor || MOCK_VENDOR,
        supplierOrderId: fulfillment.supplierOrderId,
        supplierStatus: fulfillment.supplierStatus || 'submitted',
        submittedAt: String(fulfillment.submittedAt || new Date().toISOString()),
        carrier: fulfillment.carrier,
        trackingNumber: fulfillment.trackingNumber,
        trackingStatus: fulfillment.trackingStatus,
        trackingUpdatedAt: fulfillment.trackingUpdatedAt
          ? String(fulfillment.trackingUpdatedAt)
          : undefined,
      },
    ]
  }
  return []
}

export function orderHasSupplierSubmission(order: AdminOrder) {
  const fulfillment = getOrderFulfillmentOps(order)
  if (fulfillment.supplierOrderId) return true
  return getSupplierSubmissions(order).length > 0
}

export function enrichOrderItems(
  order: AdminOrder,
  productsById?: Map<string, { vendorType?: string; supplierSku?: string; fulfillmentType?: string }>,
): EnrichedOrderItem[] {
  const items = Array.isArray(order.items) ? order.items : []
  return items.map((item) => {
    const product = productsById?.get(String(item.id || '').trim())
    return {
      ...item,
      vendorType: (item as EnrichedOrderItem).vendorType || product?.vendorType,
      supplierSku:
        (item as EnrichedOrderItem).supplierSku || product?.supplierSku || item.id || undefined,
    }
  })
}

export function orderDropshipGroups(
  order: AdminOrder,
  productsById?: Map<string, { vendorType?: string; supplierSku?: string; fulfillmentType?: string }>,
) {
  const enriched = enrichOrderItems(order, productsById)
  const groups = partitionItems(enriched)
  return [
    { vendor: VENDOR_TYPES.ELDORADO_DROPSHIP, items: groups[VENDOR_TYPES.ELDORADO_DROPSHIP] || [] },
    { vendor: VENDOR_TYPES.WILLIAMS_DROPSHIP, items: groups[VENDOR_TYPES.WILLIAMS_DROPSHIP] || [] },
  ].filter((group) => group.items.length > 0)
}

export function orderCanSubmitToSupplier(order: AdminOrder) {
  const status = String(order.status || '').trim().toLowerCase()
  if (status === 'refunded' || status === 'cancelled' || status === 'canceled') return false
  if (status === 'fulfilled') return false
  return orderDropshipGroups(order).length > 0
}

export function supplierErrorMessage(error: unknown) {
  const err = error as SupplierError
  if (err?.code === 'SUPPLIER_ALREADY_SUBMITTED') {
    return 'Supplier order was already submitted for this order.'
  }
  if (err?.code === 'SUPPLIER_NOT_CONFIGURED') {
    return 'Live supplier credentials are missing — mock supplier was used.'
  }
  if (err?.name === 'AbortError') {
    return 'Supplier request timed out. Try again in a moment.'
  }
  if (err?.code === 'SUPPLIER_HTTP_ERROR') {
    return `Supplier API error${err.status ? ` (${err.status})` : ''}.`
  }
  if (error instanceof Error && error.message) return error.message
  return 'Supplier request failed.'
}

function vendorUsesMock(vendor: string, env: SupplierEnv) {
  if (vendor === VENDOR_TYPES.ELDORADO_DROPSHIP) {
    return !env.ELDORADO_API_URL || !env.ELDORADO_API_KEY
  }
  if (vendor === VENDOR_TYPES.WILLIAMS_DROPSHIP) {
    return !env.WILLIAMS_API_URL || !env.WILLIAMS_API_KEY
  }
  return true
}

export async function checkSupplierInventory(
  vendor: string,
  skus: string[],
): Promise<{ rows: SupplierInventoryRow[]; mock: boolean }> {
  const env = await readSupplierEnv()
  const cleanSkus = skus.map((sku) => String(sku || '').trim()).filter(Boolean)
  if (!cleanSkus.length) return { rows: [], mock: false }

  try {
    if (vendor === VENDOR_TYPES.ELDORADO_DROPSHIP) {
      const rows = await checkEldoradoInventory({ skus: cleanSkus, env })
      return { rows, mock: false }
    }
    if (vendor === VENDOR_TYPES.WILLIAMS_DROPSHIP) {
      const rows = await checkWilliamsInventory({ skus: cleanSkus, env })
      return { rows, mock: false }
    }
  } catch (error) {
    const err = error as SupplierError
    if (err?.code !== 'SUPPLIER_NOT_CONFIGURED') throw error
  }

  return { rows: mockCheckInventory(cleanSkus), mock: true }
}

export async function submitSupplierOrderForVendor(
  order: AdminOrder,
  vendor: string,
  items: EnrichedOrderItem[],
) {
  const env = await readSupplierEnv()
  const payloadOrder = {
    orderId: order.orderId,
    shippingAddress: order.shippingAddress,
    idempotencyKey: `${order.orderId}:${vendor}`,
  }

  if (vendorUsesMock(vendor, env)) {
    const result = await mockSubmitOrder({ orderId: order.orderId, items })
    return { ...result, mock: true, vendor: MOCK_VENDOR }
  }

  if (vendor === VENDOR_TYPES.ELDORADO_DROPSHIP) {
    const result = await submitEldoradoOrder({ order: payloadOrder, items, env })
    return { ...result, mock: false, vendor }
  }

  if (vendor === VENDOR_TYPES.WILLIAMS_DROPSHIP) {
    const result = await submitWilliamsOrder({ order: payloadOrder, items, env })
    return { ...result, mock: false, vendor }
  }

  const error = new Error('Unsupported dropship vendor') as SupplierError
  error.code = 'UNKNOWN_VENDOR'
  throw error
}

export async function fetchSupplierTracking(vendor: string, supplierOrderId: string) {
  const env = await readSupplierEnv()

  try {
    if (vendor === VENDOR_TYPES.ELDORADO_DROPSHIP) {
      return { ...(await getEldoradoTracking({ supplierOrderId, env })), mock: false }
    }
    if (vendor === VENDOR_TYPES.WILLIAMS_DROPSHIP) {
      return { ...(await getWilliamsTracking({ supplierOrderId, env })), mock: false }
    }
  } catch (error) {
    const err = error as SupplierError
    if (err?.code !== 'SUPPLIER_NOT_CONFIGURED') throw error
  }

  return { ...(await mockGetTracking(supplierOrderId)), mock: true }
}

export function assertCanSubmitSupplierOrder(order: AdminOrder) {
  const fulfillment = getOrderFulfillmentOps(order)
  if (fulfillment.supplierOrderId) {
    const error = new Error('Supplier order already submitted') as SupplierError
    error.code = 'SUPPLIER_ALREADY_SUBMITTED'
    throw error
  }

  if (getSupplierSubmissions(order).length > 0) {
    const error = new Error('Supplier order already submitted') as SupplierError
    error.code = 'SUPPLIER_ALREADY_SUBMITTED'
    throw error
  }

  if (!orderCanSubmitToSupplier(order)) {
    const error = new Error('Order is not eligible for supplier submission') as SupplierError
    error.code = 'SUPPLIER_INELIGIBLE'
    throw error
  }
}

export async function listSupplierOpsOrders(limit = 50): Promise<SupplierOpsRow[]> {
  const { getRoom23Db } = await import('@/lib/admin-db')
  const db = await getRoom23Db()
  if (!db) return []

  const docs = await db
    .collection<AdminOrder>('orders')
    .find({
      $or: [
        { 'fulfillment.supplierOrderId': { $exists: true, $ne: '' } },
        { 'fulfillment.supplierSubmissions.0': { $exists: true } },
        { 'fulfillment.supplierError': { $exists: true, $ne: '' } },
      ],
    })
    .sort({ updatedAt: -1, createdAt: -1 })
    .limit(limit)
    .toArray()

  return docs.flatMap((order) => {
    const fulfillment = getOrderFulfillmentOps(order)
    const submissions = getSupplierSubmissions(order)
    if (submissions.length) {
      return submissions.map((submission) => ({
        orderId: order.orderId,
        status: order.status,
        createdAt: order.createdAt,
        vendor: submission.vendor,
        supplierOrderId: submission.supplierOrderId,
        supplierStatus: submission.supplierStatus,
        submittedAt: submission.submittedAt,
        supplierError: fulfillment.supplierError,
        trackingNumber: submission.trackingNumber,
        trackingStatus: submission.trackingStatus,
      }))
    }

    if (fulfillment.supplierError) {
      return [
        {
          orderId: order.orderId,
          status: order.status,
          createdAt: order.createdAt,
          supplierError: fulfillment.supplierError,
        },
      ]
    }

    return []
  })
}

export function formatSupplierInventorySummary(rows: SupplierInventoryRow[]) {
  if (!rows.length) return 'No inventory rows returned.'
  return rows
    .map((row) => {
      const lead = row.leadTimeDays == null ? '—' : `${row.leadTimeDays}d`
      return `${row.sku}: ${row.inStock ? 'in stock' : 'out'} · qty ${row.availableQuantity} · lead ${lead}`
    })
    .join(' · ')
}

export function getOrderSupplierPanelState(
  order: AdminOrder,
  productsById?: Map<string, { vendorType?: string; supplierSku?: string; fulfillmentType?: string }>,
) {
  const dropshipGroups = orderDropshipGroups(order, productsById)
  const submissions = getSupplierSubmissions(order)

  return {
    dropshipGroups,
    submissions,
    canSubmit: orderCanSubmitToSupplier(order) && !orderHasSupplierSubmission(order),
    hasSubmission: orderHasSupplierSubmission(order),
    fulfillment: getOrderFulfillmentOps(order),
  }
}
