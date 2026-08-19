import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

function read(rel) {
  return readFileSync(path.join(root, rel), 'utf8')
}

describe('admin phase 13 supplier ops', () => {
  it('defines supplier admin helpers and server actions', () => {
    const helpers = read('lib/admin-suppliers.ts')
    assert.match(helpers, /checkSupplierInventory/)
    assert.match(helpers, /submitSupplierOrderForVendor/)
    assert.match(helpers, /fetchSupplierTracking/)
    assert.match(helpers, /assertCanSubmitSupplierOrder/)
    assert.match(helpers, /getCloudflareContext/)
    assert.match(helpers, /listSupplierOpsOrders/)

    const actions = read('app/admin/supplier-actions.ts')
    assert.match(actions, /export async function checkSupplierStock/)
    assert.match(actions, /export async function submitOrderToSupplier/)
    assert.match(actions, /export async function refreshSupplierTracking/)
    assert.match(actions, /fulfillment\.supplierOrderId/)
    assert.match(actions, /SUPPLIER_ALREADY_SUBMITTED|assertCanSubmitSupplierOrder/)
  })

  it('extends supplier adapters with inventory and tracking', () => {
    const eldorado = read('lib/suppliers/eldorado.mjs')
    const williams = read('lib/suppliers/williams.mjs')
    const mock = read('lib/suppliers/mock.mjs')

    assert.match(eldorado, /checkEldoradoInventory/)
    assert.match(eldorado, /getEldoradoTracking/)
    assert.match(williams, /checkWilliamsInventory/)
    assert.match(williams, /getWilliamsTracking/)
    assert.match(mock, /mockCheckInventory/)
    assert.match(mock, /mockGetTracking/)
  })

  it('wires suppliers page, nav, and order detail panel', () => {
    const page = read('app/admin/suppliers/page.tsx')
    const layout = read('app/admin/layout.tsx')
    const order = read('app/admin/orders/[id]/page.tsx')
    const product = read('app/admin/products/[id]/page.tsx')

    assert.match(page, /listSupplierOpsOrders/)
    assert.match(layout, /\/admin\/suppliers/)
    assert.match(order, /Submit to supplier/)
    assert.match(order, /Refresh tracking/)
    assert.match(product, /Check supplier stock/)
  })

  it('records supplier timeline events', () => {
    const events = read('lib/admin-order-events.ts')
    assert.match(events, /supplier_submitted/)
    assert.match(events, /supplier_tracking/)
    assert.match(events, /supplier_failed/)
  })
})
