import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

function read(rel) {
  return readFileSync(join(root, rel), 'utf8')
}

describe('admin phase 4 orders', () => {
  it('preserves closed-order status logic for the open-order count', () => {
    const source = read('lib/admin-orders.ts')
    assert.match(source, /export const CLOSED_ORDER_STATUSES = \[/)
    assert.match(source, /'fulfilled'/)
    assert.match(source, /'refunded'/)
    assert.match(source, /'cancelled'/)
    assert.match(source, /'shipped'/)
    assert.match(source, /'delivered'/)
    assert.match(source, /'complete'/)
    assert.match(source, /'completed'/)
    assert.match(source, /\$nor: \[\{ status: \{ \$in: CLOSED_ORDER_STATUSES \} \}, \{ fulfilled: true \}\]/)
    assert.match(source, /countDocuments\(openOrdersQuery\(\)\)/)
  })

  it('filters orders by saved views and refunded-cancelled preset', () => {
    const helpers = read('lib/admin-orders.ts')
    const listPage = read('app/admin/orders/page.tsx')
    const bulkTable = read('components/admin/orders-bulk-table.tsx')
    const views = read('lib/admin-views.ts')
    assert.match(helpers, /export const ORDER_FILTERS = \['all', 'open', 'fulfilled', 'closed'\]/)
    assert.match(views, /ORDER_VIEWS/)
    assert.match(views, /label: 'All'/)
    assert.match(views, /label: 'Open'/)
    assert.match(views, /label: 'Fulfilled'/)
    assert.match(views, /Refunded\/Cancelled/)
    assert.match(listPage, /orderViewEmptyMessage/)
    assert.match(bulkTable, /order\.email/)
    assert.match(bulkTable, /Items/)
    assert.match(bulkTable, /Fulfilled/)
  })

  it('stores notes, adminReview, and fulfillment markers on dedicated actions', () => {
    const actions = read('app/admin/actions.ts')
    const detail = read('app/admin/orders/[id]/page.tsx')
    const helpers = read('lib/admin-orders.ts')

    assert.match(actions, /export async function updateOrderStatus/)
    assert.match(actions, /export async function updateOrderNotes/)
    assert.match(actions, /export async function markOrderReviewed/)
    assert.match(actions, /export async function resendOrderEmail/)
    assert.match(actions, /sendOrderConfirmation/)
    assert.match(actions, /\$set: \{\s*notes,/)
    assert.match(actions, /adminReview,/)

    assert.match(helpers, /fulfilled: status === 'fulfilled'/)
    assert.match(helpers, /update\['fulfillment\.status'\] = 'fulfilled'/)
    assert.match(helpers, /status === 'refunded' \|\| status === 'cancelled'/)
    assert.match(helpers, /update\.fulfilled = false/)

    assert.match(detail, /Shipping address/)
    assert.match(detail, /Unit price/)
    assert.match(detail, /Line total/)
    assert.match(detail, /Subtotal/)
    assert.match(detail, /Mark as reviewed/)
    assert.match(detail, /Resend confirmation email/)
    assert.match(detail, /name="notes"/)
    assert.doesNotMatch(detail, /adminNotes/)
  })

  it('adds action inbox and attention lists to the dashboard', () => {
    const dashboard = read('app/admin/page.tsx')
    assert.match(dashboard, /getAdminAnalytics/)
    assert.match(dashboard, /getAdminActionInbox/)
    assert.match(dashboard, /getResolvedProductOfTheMonth/)
    assert.match(dashboard, /Needs attention/)
    assert.match(dashboard, /Action inbox/)
    assert.match(dashboard, /\/admin\/orders\/\$\{encodeURIComponent\(entry\.order\.orderId\)\}|entry\.href/)
    assert.match(dashboard, /\/admin\/products\/\$\{encodeURIComponent\(product\.id\)\}|entry\.href/)
    assert.doesNotMatch(dashboard, /recharts/i)
  })
})
