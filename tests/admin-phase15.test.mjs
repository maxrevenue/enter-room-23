import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

function read(rel) {
  return readFileSync(path.join(root, rel), 'utf8')
}

describe('admin phase 15 bulk actions', () => {
  it('defines bulk server actions with 50-item cap and requireAdmin', () => {
    const actions = read('app/admin/actions.ts')
    assert.match(actions, /export async function bulkUpdateProducts/)
    assert.match(actions, /export async function bulkUpdateOrders/)
    assert.match(actions, /BULK_ACTION_LIMIT = 50/)
    assert.match(actions, /parseBulkIds/)
    assert.match(actions, /await requireAdmin\(\)/)
    assert.match(actions, /revalidateAdmin\(\)/)
    assert.match(actions, /bulk: 'ok'/)
    assert.match(actions, /skippedCount/)
    assert.match(actions, /shouldDecrementInventory/)
    assert.match(actions, /decrementInventoryForOrder/)
    assert.match(actions, /safeInsertOrderEvent/)
    assert.match(actions, /canBulkFulfillOrder/)
  })

  it('ships client bulk tables with selection cap UX', () => {
    const productsTable = read('components/admin/products-bulk-table.tsx')
    const ordersTable = read('components/admin/orders-bulk-table.tsx')

    assert.match(productsTable, /'use client'/)
    assert.match(ordersTable, /'use client'/)
    assert.match(productsTable, /BULK_LIMIT = 50/)
    assert.match(ordersTable, /BULK_LIMIT = 50/)
    assert.match(productsTable, /bulkUpdateProducts/)
    assert.match(ordersTable, /bulkUpdateOrders/)
    assert.match(productsTable, /confirm\(/)
    assert.match(ordersTable, /confirm\(/)
    assert.match(productsTable, /sticky top-0/)
    assert.match(ordersTable, /sticky top-0/)
    assert.match(ordersTable, /view !== 'all'/)
  })

  it('wires bulk tables into admin list pages with result flash', () => {
    const products = read('app/admin/products/page.tsx')
    const orders = read('app/admin/orders/page.tsx')

    assert.match(products, /ProductsBulkTable/)
    assert.match(orders, /OrdersBulkTable/)
    assert.match(products, /params\.bulk === 'ok'/)
    assert.match(orders, /params\.bulk === 'ok'/)
    assert.match(orders, /skippedCount/)
    assert.match(products, /searchParams: Promise/)
    assert.match(orders, /searchParams: Promise/)
  })
})
