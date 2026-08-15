/**
 * Eldorado Trading Co. dropship adapter.
 * Payload is supplier-facing only — never send this object to the storefront.
 */

export const ELDORADO_VENDOR = 'ELDORADO_DROPSHIP'

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
  const response = await fetchImpl(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify(payload),
  })

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
