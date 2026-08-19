/**
 * Williams Trading Co. dropship adapter.
 * Payload is supplier-facing only — never send this object to the storefront.
 */

export const WILLIAMS_VENDOR = 'WILLIAMS_DROPSHIP'

const DEFAULT_TIMEOUT_MS = 25000

function supplierFetch(url, options = {}, fetchImpl = fetch, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)
  return fetchImpl(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(timeout))
}

function normalizeInventoryRows(body, skus = []) {
  const rows = Array.isArray(body?.items)
    ? body.items
    : Array.isArray(body?.inventory)
      ? body.inventory
      : Array.isArray(body)
        ? body
        : []

  if (rows.length) {
    return rows.map((row) => ({
      sku: String(row.sku || row.itemNumber || row.id || '').trim(),
      inStock: row.inStock !== false && Number(row.availableQuantity ?? row.quantity ?? 0) > 0,
      availableQuantity: Math.max(0, Math.floor(Number(row.availableQuantity ?? row.quantity ?? 0))),
      leadTimeDays:
        row.leadTimeDays == null ? null : Math.max(0, Math.floor(Number(row.leadTimeDays) || 0)),
    }))
  }

  return skus.map((sku) => ({
    sku: String(sku || '').trim(),
    inStock: false,
    availableQuantity: 0,
    leadTimeDays: null,
  }))
}

export function formatWilliamsOrder({ order, items, customerNumber }) {
  return {
    customerNumber: customerNumber || '',
    orderNumber: order.orderId,
    dropshipFlag: 'Y',
    packingNotes: `Order ${order.orderId}`,
    shipping: {
      name: order.shippingAddress?.name || '',
      address1: order.shippingAddress?.line1 || '',
      address2: order.shippingAddress?.line2 || '',
      city: order.shippingAddress?.city || '',
      state: order.shippingAddress?.state || '',
      zip: order.shippingAddress?.postalCode || '',
      country: order.shippingAddress?.country || 'US',
      phone: order.shippingAddress?.phone || '',
    },
    serviceCode: order.shipMethod || 'GROUND',
    items: items.map((item) => ({
      sku: item.supplierSku || item.sku || item.id,
      quantity: Math.max(1, Math.floor(Number(item.qty) || 1)),
    })),
  }
}

export async function submitWilliamsOrder({ order, items, env = {}, fetchImpl = fetch }) {
  const url = env.WILLIAMS_API_URL
  const apiKey = env.WILLIAMS_API_KEY
  const payload = formatWilliamsOrder({
    order,
    items,
    customerNumber: env.WILLIAMS_ACCOUNT,
  })

  if (!url || !apiKey) {
    const error = new Error('Williams adapter is not configured')
    error.code = 'SUPPLIER_NOT_CONFIGURED'
    throw error
  }

  const idempotencyKey = order.idempotencyKey || `${order.orderId}:williams`
  const response = await supplierFetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': apiKey,
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify(payload),
  }, fetchImpl)

  if (!response.ok) {
    const error = new Error(`Williams request failed (${response.status})`)
    error.code = 'SUPPLIER_HTTP_ERROR'
    error.status = response.status
    throw error
  }

  const body = await response.json().catch(() => ({}))
  return {
    supplierOrderId: body.orderId || body.orderNumber || order.orderId,
    status: body.status || 'accepted',
  }
}

export async function checkWilliamsInventory({ skus = [], env = {}, fetchImpl = fetch }) {
  const baseUrl = env.WILLIAMS_API_URL
  const apiKey = env.WILLIAMS_API_KEY
  if (!baseUrl || !apiKey) {
    const error = new Error('Williams adapter is not configured')
    error.code = 'SUPPLIER_NOT_CONFIGURED'
    throw error
  }

  const url = `${String(baseUrl).replace(/\/$/, '')}/inventory`
  const response = await supplierFetch(
    url,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': apiKey,
      },
      body: JSON.stringify({ skus }),
    },
    fetchImpl,
  )

  if (!response.ok) {
    const error = new Error(`Williams inventory failed (${response.status})`)
    error.code = 'SUPPLIER_HTTP_ERROR'
    error.status = response.status
    throw error
  }

  const body = await response.json().catch(() => ({}))
  return normalizeInventoryRows(body, skus)
}

export async function getWilliamsTracking({ supplierOrderId, env = {}, fetchImpl = fetch }) {
  const baseUrl = env.WILLIAMS_API_URL
  const apiKey = env.WILLIAMS_API_KEY
  if (!baseUrl || !apiKey) {
    const error = new Error('Williams adapter is not configured')
    error.code = 'SUPPLIER_NOT_CONFIGURED'
    throw error
  }

  const id = encodeURIComponent(String(supplierOrderId || '').trim())
  const url = `${String(baseUrl).replace(/\/$/, '')}/orders/${id}/tracking`
  const response = await supplierFetch(
    url,
    {
      method: 'GET',
      headers: {
        'X-Api-Key': apiKey,
      },
    },
    fetchImpl,
  )

  if (!response.ok) {
    const error = new Error(`Williams tracking failed (${response.status})`)
    error.code = 'SUPPLIER_HTTP_ERROR'
    error.status = response.status
    throw error
  }

  const body = await response.json().catch(() => ({}))
  return {
    carrier: body.carrier || body.shipCarrier || 'Unknown',
    trackingNumber: body.trackingNumber || body.tracking || '',
    status: body.status || body.trackingStatus || 'unknown',
  }
}
