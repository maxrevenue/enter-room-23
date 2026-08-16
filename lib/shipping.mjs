/** Single source of truth for customer-facing shipping rates. */

export const FREE_SHIPPING_THRESHOLD = 99

export const SHIPPING_METHODS = [
  {
    id: 'standard',
    name: 'Standard (USPS Ground)',
    delivery: '5–8 business days',
    rate: 5.99,
    eligibleForFree: true,
  },
  {
    id: 'expedited',
    name: 'Expedited (USPS Priority)',
    delivery: '2–4 business days',
    rate: 12.99,
    eligibleForFree: false,
  },
  {
    id: 'express-fedex',
    name: 'Express (FedEx 2Day)',
    delivery: '2 business days',
    rate: 24.99,
    eligibleForFree: false,
  },
  {
    id: 'express-ups',
    name: 'Express (UPS Next Day Air)',
    delivery: 'Next business day',
    rate: 29.99,
    eligibleForFree: false,
  },
]

export const DEFAULT_SHIPPING_METHOD = 'standard'
export const FLAT_SHIPPING_RATE = SHIPPING_METHODS[0].rate

export function getShippingMethod(id) {
  return SHIPPING_METHODS.find((method) => method.id === id) || SHIPPING_METHODS[0]
}

export function getShippingRate(subtotal, methodId = DEFAULT_SHIPPING_METHOD) {
  const method = getShippingMethod(methodId)
  if (method.eligibleForFree && Number(subtotal) >= FREE_SHIPPING_THRESHOLD) {
    return 0
  }
  return method.rate
}
