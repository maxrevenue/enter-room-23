import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

function read(rel) {
  return readFileSync(join(root, rel), 'utf8')
}

function stockLevelForQuantity(quantity, threshold = 5) {
  if (quantity === null) return null
  if (quantity === 0) return 'out'
  if (quantity <= threshold) return 'low'
  return null
}

function isHealthyQuantity(quantity, threshold = 5) {
  return quantity !== null && quantity > threshold
}

function decideStockAlertLevel(input, threshold = 5) {
  const nextLevel = stockLevelForQuantity(input.nextQuantity, threshold)
  if (!nextLevel) return null

  const previousLevel = stockLevelForQuantity(input.previousQuantity, threshold)
  const neverSent = !input.lowStockAlertSentAt && !input.lowStockAlertLevel

  if (neverSent) return nextLevel
  if (nextLevel === 'out' && previousLevel !== 'out') return 'out'
  if (nextLevel === 'low' && isHealthyQuantity(input.previousQuantity, threshold)) return 'low'

  return null
}

describe('admin phase 11 stock alerts', () => {
  it('extends product overlay fields for alert dedupe', () => {
    const db = read('lib/admin-db.ts')
    const catalog = read('lib/admin-catalog.ts')
    assert.match(db, /lowStockAlertSentAt/)
    assert.match(db, /lowStockAlertLevel/)
    assert.match(catalog, /lowStockAlertSentAt/)
  })

  it('decides alert level on threshold crossings without repeat spam', () => {
    assert.equal(decideStockAlertLevel({ previousQuantity: 10, nextQuantity: 3 }), 'low')
    assert.equal(decideStockAlertLevel({ previousQuantity: 3, nextQuantity: 0, lowStockAlertLevel: 'low', lowStockAlertSentAt: new Date() }), 'out')
    assert.equal(
      decideStockAlertLevel({
        previousQuantity: 3,
        nextQuantity: 2,
        lowStockAlertLevel: 'low',
        lowStockAlertSentAt: new Date(),
      }),
      null,
    )
    assert.equal(
      decideStockAlertLevel({
        previousQuantity: 0,
        nextQuantity: 0,
        lowStockAlertLevel: 'out',
        lowStockAlertSentAt: new Date(),
      }),
      null,
    )
    assert.equal(
      decideStockAlertLevel({
        previousQuantity: null,
        nextQuantity: 2,
        lowStockAlertSentAt: null,
        lowStockAlertLevel: null,
      }),
      'low',
    )
  })

  it('awaits Resend in stock alert helpers and hooks quantity mutations', () => {
    const alerts = read('lib/admin-stock-alerts.ts')
    const actions = read('app/admin/actions.ts')
    assert.match(alerts, /await resend\.emails\.send/)
    assert.match(alerts, /getCloudflareContext/)
    assert.match(alerts, /NEXT_PUBLIC_APP_URL/)
    assert.match(alerts, /handleStockAlertAfterQuantityChange/)
    assert.match(actions, /syncStockAlert/)
    assert.match(actions, /handleStockAlertAfterQuantityChange/)
    assert.match(actions, /decrementInventoryForOrder[\s\S]*syncStockAlert/)
    assert.match(actions, /updateQuantity[\s\S]*syncStockAlert/)
    assert.match(actions, /updateProduct[\s\S]*syncStockAlert/)
    assert.match(actions, /createProduct[\s\S]*syncStockAlert/)
  })

  it('shows alert sent timestamp on product edit page', () => {
    const edit = read('app/admin/products/[id]/page.tsx')
    assert.match(edit, /formatStockAlertSentAt/)
    assert.match(edit, /Alert sent/)
  })
})
