/**
 * Eldorado Trading Co. dropship adapter.
 * Payload is supplier-facing only — never send this object to the storefront.
 */

export const ELDORADO_VENDOR = 'ELDORADO_DROPSHIP'

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

export function formatEldoradoOrder({ order, items, accountNumber }) {
  return {
    accountNumber: accountNumber || '',
    poNumber: order.orderId,
    dropShip: true,
    packingSlip: {
      message: `Order ${order.orderId}`,
      showPrices: false,
    },
    shipTo: {
      name: order.shippingAddress?.name || '',
      address1: order.shippingAddress?.line1 || '',
      address2: order.shippingAddress?.line2 || '',
      city: order.shippingAddress?.city || '',
      state: order.shippingAddress?.state || '',
      postalCode: order.shippingAddress?.postalCode || '',
      country: order.shippingAddress?.country || 'US',
      phone: order.shippingAddress?.phone || '',
    },
    shipMethod: order.shipMethod || 'GROUND',
    lines: items.map((item, index) => ({
      lineNumber: index + 1,
      itemNumber: item.supplierSku || item.sku || item.id,
      quantity: Math.max(1, Math.floor(Number(item.qty) || 1)),
    })),
  }
}

export async function submitEldoradoOrder({ order, items, env = {}, fetchImpl = fetch }) {
  const url = env.ELDORADO_API_URL
  const apiKey = env.ELDORADO_API_KEY
  const payload = formatEldoradoOrder({
    order,
    items,
    accountNumber: env.ELDORADO_ACCOUNT,
  })

  if (!url || !apiKey) {
    const error = new Error('Eldorado adapter is not configured')
    error.code = 'SUPPLIER_NOT_CONFIGURED'
    throw error
  }

  const idempotencyKey = order.idempotencyKey || `${order.orderId}:eldorado`
  const response = await supplierFetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify(payload),
  }, fetchImpl)

  if (!response.ok) {
    const error = new Error(`Eldorado request failed (${response.status})`)
    error.code = 'SUPPLIER_HTTP_ERROR'
    error.status = response.status
    throw error
  }

  const body = await response.json().catch(() => ({}))
  return {
    supplierOrderId: body.orderId || body.poNumber || order.orderId,
    status: body.status || 'accepted',
  }
}

export async function checkEldoradoInventory({ skus = [], env = {}, fetchImpl = fetch }) {
  const baseUrl = env.ELDORADO_API_URL
  const apiKey = env.ELDORADO_API_KEY
  if (!baseUrl || !apiKey) {
    const error = new Error('Eldorado adapter is not configured')
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
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ skus }),
    },
    fetchImpl,
  )

  if (!response.ok) {
    const error = new Error(`Eldorado inventory failed (${response.status})`)
    error.code = 'SUPPLIER_HTTP_ERROR'
    error.status = response.status
    throw error
  }

  const body = await response.json().catch(() => ({}))
  return normalizeInventoryRows(body, skus)
}

export async function getEldoradoTracking({ supplierOrderId, env = {}, fetchImpl = fetch }) {
  const baseUrl = env.ELDORADO_API_URL
  const apiKey = env.ELDORADO_API_KEY
  if (!baseUrl || !apiKey) {
    const error = new Error('Eldorado adapter is not configured')
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
        Authorization: `Bearer ${apiKey}`,
      },
    },
    fetchImpl,
  )

  if (!response.ok) {
    const error = new Error(`Eldorado tracking failed (${response.status})`)
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
