import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

function read(rel) {
  return readFileSync(path.join(root, rel), 'utf8')
}

describe('admin phase 17 returns rma', () => {
  it('defines rma model helpers and atomic restock guard', () => {
    const returns = read('lib/admin-returns.ts')
    assert.match(returns, /RMAS_COLLECTION = 'rmas'/)
    assert.match(returns, /restockApplied/)
    assert.match(returns, /findOneAndUpdate/)
    assert.match(returns, /restockApplied: \{ \$ne: true \}/)
    assert.match(returns, /export async function applyRmaRestock/)
    assert.match(returns, /OPEN_RMA_STATUSES/)
  })

  it('adds rma server actions with requireAdmin and timeline events', () => {
    const actions = read('app/admin/actions.ts')
    const events = read('lib/admin-order-events.ts')
    assert.match(actions, /export async function createRma/)
    assert.match(actions, /export async function updateRma/)
    assert.match(actions, /applyRmaRestock/)
    assert.match(actions, /revalidatePath\('\/admin\/returns'\)/)
    assert.match(events, /rma_created/)
    assert.match(events, /rma_status_changed/)
    assert.match(events, /rma_restocked/)
  })

  it('wires returns list, detail, order create form, nav, and dashboard inbox', () => {
    const list = read('app/admin/returns/page.tsx')
    const detail = read('app/admin/returns/[id]/page.tsx')
    const order = read('app/admin/orders/[id]/page.tsx')
    const layout = read('app/admin/layout.tsx')
    const dashboard = read('app/admin/page.tsx')

    assert.match(list, /searchParams: Promise/)
    assert.match(list, /CCBill/)
    assert.match(detail, /updateRma/)
    assert.match(detail, /already restocked/)
    assert.match(order, /createRma/)
    assert.match(order, /Returns \(RMA\)/)
    assert.match(layout, /href: '\/admin\/returns'/)
    assert.match(dashboard, /listOpenRmas/)
    assert.match(dashboard, /adminReturnsHref\('open'\)/)
  })
})
