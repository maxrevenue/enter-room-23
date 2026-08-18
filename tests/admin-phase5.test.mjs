import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

function read(rel) {
  return readFileSync(join(root, rel), 'utf8')
}

function normalizeAttributes(value) {
  if (Array.isArray(value)) return value.map((entry) => String(entry || '').trim()).filter(Boolean)
  return String(value || '')
    .split(/[\n,]+/)
    .map((entry) => entry.trim())
    .filter(Boolean)
}

function normalizeImages(value) {
  if (!Array.isArray(value)) return []
  const images = []
  for (const entry of value) {
    if (typeof entry === 'string') {
      const url = entry.trim()
      if (url) images.push({ url, alt: '' })
      continue
    }
    if (!entry || typeof entry !== 'object') continue
    const url = String(entry.url || '').trim()
    if (!url) continue
    images.push({ url, alt: String(entry.alt || '').trim() })
  }
  return images
}

function quantityOf(product) {
  if (typeof product.quantity !== 'number' || !Number.isFinite(product.quantity)) return null
  return Math.max(0, Math.floor(product.quantity))
}

function isArchived(product) {
  return Boolean(product.hidden || product.archived || product.active === false)
}

function isHiddenByZeroStock(product) {
  return Boolean(product.hideWhenZero) && quantityOf(product) === 0
}

function isStorefrontVisible(product) {
  return !isArchived(product) && !isHiddenByZeroStock(product)
}

function nextQuantityAfterDecrement(current, orderedQty) {
  if (typeof current !== 'number' || !Number.isFinite(current)) return null
  const qty = Math.max(1, Math.floor(Number(orderedQty) || 1))
  return Math.max(0, Math.floor(current) - qty)
}

function shouldDecrementInventory(order, nextStatus) {
  if (nextStatus !== 'fulfilled') return false
  if (order.inventoryDecremented === true) return false
  const fulfilled = order.fulfilled === true || ['fulfilled', 'shipped', 'delivered', 'complete', 'completed'].includes(String(order.status || '').toLowerCase())
  if (fulfilled) return false
  return true
}

describe('admin phase 5 catalog', () => {
  it('extends overlay fields and storefront visibility helpers', () => {
    const db = read('lib/admin-db.ts')
    const catalog = read('lib/admin-catalog.ts')
    assert.match(db, /'hideWhenZero'/)
    assert.match(db, /'images'/)
    assert.match(db, /'discretionNotes'/)
    assert.match(catalog, /export function isHiddenByZeroStock/)
    assert.match(catalog, /export function isStorefrontVisible/)
    assert.match(catalog, /export function normalizeAttributes/)
    assert.match(catalog, /export function normalizeImages/)
    assert.match(catalog, /products.filter\(isStorefrontVisible\)/)
  })

  it('normalizes attributes, images, and hide-when-zero visibility', () => {
    assert.deepEqual(normalizeAttributes('Medical-grade, Waterproof\nFragrance-free'), [
      'Medical-grade',
      'Waterproof',
      'Fragrance-free',
    ])
    assert.deepEqual(normalizeImages([{ url: ' /a.jpg ', alt: ' Bottle ' }, { url: '', alt: 'skip' }, ' /b.jpg ']), [
      { url: '/a.jpg', alt: 'Bottle' },
      { url: '/b.jpg', alt: '' },
    ])
    assert.equal(isStorefrontVisible({ quantity: 0, hideWhenZero: true }), false)
    assert.equal(isStorefrontVisible({ quantity: 0, hideWhenZero: false }), true)
    assert.equal(isHiddenByZeroStock({ quantity: 2, hideWhenZero: true }), false)
    assert.equal(isStorefrontVisible({ hidden: true, quantity: 4, hideWhenZero: false }), false)
    assert.equal(isArchived({ active: false }), true)
  })

  it('decrements inventory once per fulfill and clamps at zero', () => {
    const actions = read('app/admin/actions.ts')
    assert.match(actions, /shouldDecrementInventory/)
    assert.match(actions, /inventoryDecremented: true/)
    assert.match(actions, /decrementInventoryForOrder/)
    assert.equal(nextQuantityAfterDecrement(5, 2), 3)
    assert.equal(nextQuantityAfterDecrement(1, 4), 0)
    assert.equal(nextQuantityAfterDecrement(null, 1), null)
    assert.equal(shouldDecrementInventory({ status: 'paid', fulfilled: false }, 'fulfilled'), true)
    assert.equal(shouldDecrementInventory({ status: 'paid', inventoryDecremented: true }, 'fulfilled'), false)
    assert.equal(shouldDecrementInventory({ status: 'fulfilled' }, 'fulfilled'), false)
    assert.equal(shouldDecrementInventory({ status: 'paid' }, 'cancelled'), false)
  })

  it('exposes full editor fields, gallery slots, and product list polish', () => {
    const fields = read('app/admin/products/product-fields.tsx')
    const list = read('app/admin/products/page.tsx')
    const create = read('app/admin/products/new/page.tsx')
    const edit = read('app/admin/products/[id]/page.tsx')
    const order = read('app/admin/orders/[id]/page.tsx')
    assert.match(fields, /name="tagline"/)
    assert.match(fields, /name="ingredients"/)
    assert.match(fields, /name="hideWhenZero"/)
    assert.match(fields, /name=\{`imageUrl\$\{index\}`\}/)
    assert.match(create, /ProductEditorFields/)
    assert.match(edit, /ProductEditorFields/)
    assert.match(list, /Hidden \(zero stock\)/)
    assert.match(list, /No image|None/)
    assert.match(order, /inventoryDecremented/)
    assert.match(order, /Inventory was decremented/)
  })
})
