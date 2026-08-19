/**
 * Mock supplier for admin/dev when live API credentials are missing.
 * Admin-only — never expose to the storefront.
 */

export const MOCK_VENDOR = 'MOCK_SUPPLIER'

export function mockCheckInventory(skus = []) {
  return skus.map((sku) => ({
    sku: String(sku || '').trim() || 'UNKNOWN',
    inStock: true,
    availableQuantity: 99,
    leadTimeDays: 2,
  }))
}

export async function mockSubmitOrder({ orderId, items = [] }) {
  const id = String(orderId || 'ORDER').trim() || 'ORDER'
  return {
    supplierOrderId: `MOCK-${id}`,
    status: 'accepted',
    message: `Mock supplier accepted ${items.length} line(s)`,
  }
}

export async function mockGetTracking(supplierOrderId) {
  const id = String(supplierOrderId || 'MOCK').trim() || 'MOCK'
  const suffix = id.replace(/[^a-zA-Z0-9]/g, '').slice(-8).padStart(8, '0')
  return {
    carrier: 'USPS',
    trackingNumber: `9400MOCK${suffix}`,
    status: 'in_transit',
  }
}
