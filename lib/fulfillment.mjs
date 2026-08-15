/**
 * Server-side fulfillment router.
 * Splits a completed order by vendor, submits dropship payloads,
 * and returns a customer-safe split-shipment status for the UI.
 *
 * Customer-facing objects never include supplier trade names.
 */

import { hashEmail, sanitizeLog } from './privacy.mjs'
import { ELDORADO_VENDOR, submitEldoradoOrder } from './suppliers/eldorado.mjs'
import { WILLIAMS_VENDOR, submitWilliamsOrder } from './suppliers/williams.mjs'

export const FULFILLMENT_TYPES = {
  WHITE_LABEL: 'white-label',
  ROOM23_STOCK: 'room23-stock',
  DROPSHIP: 'dropship',
}

export const VENDOR_TYPES = {
  ROOM23_STOCK: 'ROOM23_STOCK',
  ELDORADO_DROPSHIP: ELDORADO_VENDOR,
  WILLIAMS_DROPSHIP: WILLIAMS_VENDOR,
}

const CUSTOMER_CHANNEL = {
  ROOM23_STOCK: 'room23_warehouse',
  ELDORADO_DROPSHIP: 'partner_warehouse',
  WILLIAMS_DROPSHIP: 'partner_warehouse',
}

const SUPPLIER_NAME_RE = /eldorado|williams\s*trading|williams/gi

function stripSupplierNames(text) {
  if (typeof text !== 'string') return text
  return text.replace(SUPPLIER_NAME_RE, 'partner').replace(/\s+/g, ' ').trim()
}

export function resolveVendorType(item = {}) {
  const raw = String(item.vendorType || item.vendor || item.fulfillmentType || '')
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, '_')

  if (raw === 'ROOM23_STOCK' || raw === 'WHITE_LABEL' || raw === 'WHITELABEL') {
    return VENDOR_TYPES.ROOM23_STOCK
  }
  if (raw === 'ELDORADO_DROPSHIP' || raw === 'ELDORADO') {
    return VENDOR_TYPES.ELDORADO_DROPSHIP
  }
  if (raw === 'WILLIAMS_DROPSHIP' || raw === 'WILLIAMS') {
    return VENDOR_TYPES.WILLIAMS_DROPSHIP
  }
  if (raw === 'DROPSHIP') {
    return null
  }
  return null
}

export function partitionItems(items = []) {
  const groups = {
    [VENDOR_TYPES.ROOM23_STOCK]: [],
    [VENDOR_TYPES.ELDORADO_DROPSHIP]: [],
    [VENDOR_TYPES.WILLIAMS_DROPSHIP]: [],
    UNKNOWN: [],
  }

  for (const item of items) {
    const vendor = resolveVendorType(item)
    if (vendor && groups[vendor]) groups[vendor].push(item)
    else groups.UNKNOWN.push(item)
  }

  return groups
}

function customerItem(item) {
  return {
    id: item.id,
    name: stripSupplierNames(item.name || item.id),
    qty: Math.max(1, Math.floor(Number(item.qty) || 1)),
    price: Number(item.price) || 0,
  }
}

function logFulfillment(level, message, meta) {
  const line = {
    scope: 'fulfillment',
    level,
    message,
    ...sanitizeLog(meta),
  }
  if (level === 'error') console.error(JSON.stringify(line))
  else console.info(JSON.stringify(line))
}

async function fulfillGroup({ vendor, items, order, env, fetchImpl, dryRun }) {
  if (vendor === VENDOR_TYPES.ROOM23_STOCK) {
    return {
      vendor,
      status: 'queued',
      itemCount: items.length,
    }
  }

  if (dryRun) {
    return {
      vendor,
      status: 'formatted',
      itemCount: items.length,
    }
  }

  if (vendor === VENDOR_TYPES.ELDORADO_DROPSHIP) {
    const result = await submitEldoradoOrder({ order, items, env, fetchImpl })
    return { vendor, status: result.status, itemCount: items.length }
  }

  if (vendor === VENDOR_TYPES.WILLIAMS_DROPSHIP) {
    const result = await submitWilliamsOrder({ order, items, env, fetchImpl })
    return { vendor, status: result.status, itemCount: items.length }
  }

  const error = new Error('Unknown vendor group')
  error.code = 'UNKNOWN_VENDOR'
  throw error
}

function toCustomerShipment(group, index) {
  return {
    shipmentIndex: index + 1,
    channel: CUSTOMER_CHANNEL[group.vendor] || 'partner_warehouse',
    status: group.status,
    itemCount: group.itemCount,
    items: group.items.map(customerItem),
    packaging: 'plain, neutral packaging',
  }
}

/**
 * Route a completed order to internal stock and/or dropship partners.
 */
export async function routeOrder(order, options = {}) {
  if (!order || !order.orderId) {
    throw new Error('Order payload requires orderId')
  }
  if (!Array.isArray(order.items) || order.items.length === 0) {
    throw new Error('Order payload requires items')
  }

  const env = options.env || {}
  const fetchImpl = options.fetchImpl || globalThis.fetch
  const dryRun = options.dryRun === true
  const emailHash = await hashEmail(order.email)
  const groups = partitionItems(order.items)

  const activeVendors = Object.entries(groups)
    .filter(([vendor, items]) => vendor !== 'UNKNOWN' && items.length > 0)
    .map(([vendor, items]) => ({ vendor, items }))

  const unknownItems = groups.UNKNOWN
  const splitFulfillment = activeVendors.length + (unknownItems.length ? 1 : 0) > 1
  const shipments = []
  const adminFailures = []
  let adminReview = unknownItems.length > 0

  if (unknownItems.length) {
    logFulfillment('error', 'Items missing vendor type; flagged for review', {
      orderId: order.orderId,
      emailHash,
      unknownCount: unknownItems.length,
      unknownIds: unknownItems.map((item) => item.id),
    })
    adminFailures.push({ reason: 'UNKNOWN_VENDOR', itemCount: unknownItems.length })
    shipments.push({
      vendor: 'UNKNOWN',
      status: 'needs_review',
      itemCount: unknownItems.length,
      items: unknownItems,
    })
  }

  for (const group of activeVendors) {
    try {
      const result = await fulfillGroup({
        vendor: group.vendor,
        items: group.items,
        order,
        env,
        fetchImpl,
        dryRun,
      })
      shipments.push({ ...result, items: group.items })
      logFulfillment('info', 'Fulfillment group routed', {
        orderId: order.orderId,
        emailHash,
        vendor: group.vendor,
        itemCount: group.items.length,
        status: result.status,
      })
    } catch (error) {
      adminReview = true
      adminFailures.push({
        reason: error.code || 'SUPPLIER_FAILURE',
        vendor: group.vendor,
        status: error.status || null,
      })
      logFulfillment('error', 'Supplier routing failed; flagged for admin review', {
        orderId: order.orderId,
        emailHash,
        vendor: group.vendor,
        itemCount: group.items.length,
        errorCode: error.code || 'SUPPLIER_FAILURE',
        httpStatus: error.status || null,
      })
      shipments.push({
        vendor: group.vendor,
        status: 'needs_review',
        itemCount: group.items.length,
        items: group.items,
      })
    }
  }

  const customerNotice = splitFulfillment
    ? 'Your items will ship separately in discreet packaging.'
    : 'Shipped in plain, neutral packaging.'

  const customer = {
    orderId: order.orderId,
    status: adminReview ? 'needs_review' : splitFulfillment ? 'split' : 'routed',
    splitFulfillment,
    shipsSeparately: splitFulfillment,
    customerNotice,
    packages: shipments.map(toCustomerShipment),
    receipt: {
      items: order.items.map(customerItem),
      totals: order.totals || null,
      discreetShipping: 'Shipped in plain, neutral packaging',
    },
    adminReview,
  }

  return {
    customer,
    admin: {
      orderId: order.orderId,
      emailHash,
      review: adminReview,
      failures: adminFailures,
      vendors: shipments.map((group) => group.vendor),
    },
  }
}
