import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

function read(rel) {
  return readFileSync(path.join(root, rel), 'utf8')
}

describe('admin phase 14 cogs and margin', () => {
  it('defines margin helpers and cogs overlay field', () => {
    const margin = read('lib/admin-margin.ts')
    assert.match(margin, /unitMargin/)
    assert.match(margin, /unitMarginPct/)
    assert.match(margin, /orderMargin/)
    assert.match(margin, /buildMarginProductsByIdMap/)
    assert.match(margin, /collectProductIdsFromOrders/)

    const db = read('lib/admin-db.ts')
    assert.match(db, /'cogs'/)
    assert.match(db, /cogs\?: number/)
  })

  it('parses cogs on product create and update actions', () => {
    const actions = read('app/admin/actions.ts')
    assert.match(actions, /parseCogs/)
    assert.match(actions, /fields\.cogs/)
    assert.match(actions, /\$unset.*cogs/)
  })

  it('surfaces margin in product list, edit, order detail, dashboard, and analytics', () => {
    const fields = read('app/admin/products/product-fields.tsx')
    const products = read('app/admin/products/page.tsx')
    const order = read('app/admin/orders/[id]/page.tsx')
    const dashboard = read('app/admin/page.tsx')
    const analytics = read('app/admin/analytics/page.tsx')

    assert.match(fields, /name="cogs"/)
    assert.match(products, /Margin/)
    assert.match(order, /Line margin/)
    assert.match(order, /Est\. margin/)
    assert.match(dashboard, /Est\. margin · 7d/)
    assert.match(analytics, /Est\. margin · 7 days/)
    assert.match(analytics, /Top products by margin/)
  })

  it('batch-builds product cogs map in analytics', () => {
    const analytics = read('lib/admin-analytics.ts')
    assert.match(analytics, /collectProductIdsFromOrders/)
    assert.match(analytics, /buildMarginProductsByIdMap/)
    assert.match(analytics, /topProductsByMargin/)
    assert.match(analytics, /marginMissingCogs/)
  })
})
