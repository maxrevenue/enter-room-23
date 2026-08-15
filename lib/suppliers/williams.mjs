/**
 * Williams Trading Co. dropship adapter.
 * Payload is supplier-facing only — never send this object to the storefront.
 */

export const WILLIAMS_VENDOR = 'WILLIAMS_DROPSHIP'

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
  const response = await fetchImpl(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': apiKey,
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify(payload),
  })

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
