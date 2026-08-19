import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

function read(rel) {
  return readFileSync(join(root, rel), 'utf8')
}

describe('admin phase 12 action inbox and risk flags', () => {
  it('defines order risk flags and inbox helpers', () => {
    const risk = read('lib/admin-risk.ts')
    assert.match(risk, /getOrderRiskFlags/)
    assert.match(risk, /high_value/)
    assert.match(risk, /unreviewed/)
    assert.match(risk, /stale_open/)
    assert.match(risk, /out_of_stock_item/)
    assert.match(risk, /missing_email/)
    assert.match(risk, /buildProductsByIdMap/)
    assert.match(risk, /getAdminActionInbox/)
  })

  it('surfaces risk chips on orders list and detail', () => {
    const list = read('app/admin/orders/page.tsx')
    const detail = read('app/admin/orders/[id]/page.tsx')
    assert.match(list, /getOrderRiskFlags/)
    assert.match(list, /riskFlagChipClass/)
    assert.match(detail, /getOrderRiskFlags/)
    assert.match(detail, /riskFlagChipClass/)
    assert.doesNotMatch(list, /use client/)
    assert.doesNotMatch(detail, /use client/)
  })

  it('keeps dashboard revalidation wired through admin actions', () => {
    const actions = read('app/admin/actions.ts')
    assert.match(actions, /revalidatePath\('\/admin'\)/)
  })
})
