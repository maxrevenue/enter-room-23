import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

function read(rel) {
  return readFileSync(path.join(root, rel), 'utf8')
}

describe('admin phase 16 saved views', () => {
  it('defines order and product view presets with URL params', () => {
    const views = read('lib/admin-views.ts')
    assert.match(views, /export const ORDER_VIEWS/)
    assert.match(views, /export const PRODUCT_VIEWS/)
    assert.match(views, /unreviewed/)
    assert.match(views, /high_value/)
    assert.match(views, /stale/)
    assert.match(views, /refunded_cancelled/)
    assert.match(views, /low_stock/)
    assert.match(views, /hide_when_zero/)
    assert.match(views, /potm/)
    assert.match(views, /adminOrdersViewHref/)
    assert.match(views, /adminProductsViewHref/)
  })

  it('uses shared stale threshold from admin-sla and high-value from admin-risk', () => {
    const views = read('lib/admin-views.ts')
    const sla = read('lib/admin-sla.ts')
    const risk = read('lib/admin-risk.ts')
    assert.match(views, /staleOpenCutoff/)
    assert.match(views, /CRITICAL_HOURS/)
    assert.match(views, /HIGH_VALUE_THRESHOLD/)
    assert.match(sla, /export const WARN_HOURS = 24/)
    assert.match(sla, /export const CRITICAL_HOURS = 48/)
    assert.match(sla, /export function slaLevel/)
    assert.match(sla, /export function isStaleOpenOrder/)
    assert.match(risk, /from '@\/lib\/admin-sla'/)
    assert.match(risk, /slaSortWeight/)
  })

  it('renders view pills on orders and products list pages', () => {
    const orders = read('app/admin/orders/page.tsx')
    const products = read('app/admin/products/page.tsx')
    assert.match(orders, /ORDER_VIEWS/)
    assert.match(orders, /aria-label="Order views"/)
    assert.match(orders, /listAdminOrdersForView/)
    assert.match(orders, /orderViewEmptyMessage/)
    assert.match(products, /PRODUCT_VIEWS/)
    assert.match(products, /aria-label="Product views"/)
    assert.match(products, /filterProductsByView/)
    assert.match(products, /productViewEmptyMessage/)
  })

  it('points dashboard inbox view-all links at saved views', () => {
    const dashboard = read('app/admin/page.tsx')
    assert.match(dashboard, /\/admin\/orders\?view=open/)
    assert.match(dashboard, /\/admin\/products\?view=low_stock/)
  })
})
