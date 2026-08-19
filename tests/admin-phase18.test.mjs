import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

function read(rel) {
  return readFileSync(path.join(root, rel), 'utf8')
}

describe('admin phase 18 shift handoff', () => {
  it('defines ops handoff settings helpers and checklist builder', () => {
    const handoff = read('lib/admin-handoff.ts')
    assert.match(handoff, /OPS_HANDOFF_ID = 'ops_handoff'/)
    assert.match(handoff, /HANDOFF_NOTE_MAX = 2000/)
    assert.match(handoff, /export async function getOpsHandoff/)
    assert.match(handoff, /export async function buildHandoffChecklist/)
    assert.match(handoff, /adminOrdersViewHref\('open'\)/)
    assert.match(handoff, /adminOrdersViewHref\('unreviewed'\)/)
    assert.match(handoff, /adminProductsViewHref\('low_stock'\)/)
    assert.match(handoff, /adminReturnsHref\('open'\)/)
  })

  it('adds handoff note server actions with requireAdmin', () => {
    const actions = read('app/admin/actions.ts')
    assert.match(actions, /export async function updateHandoffNote/)
    assert.match(actions, /export async function clearHandoffNote/)
    assert.match(actions, /OPS_HANDOFF_ID/)
    assert.match(actions, /revalidatePath\('\/admin'\)/)
  })

  it('renders shift handoff section on the dashboard', () => {
    const dashboard = read('app/admin/page.tsx')
    assert.match(dashboard, /Shift handoff/)
    assert.match(dashboard, /updateHandoffNote/)
    assert.match(dashboard, /clearHandoffNote/)
    assert.match(dashboard, /Daily checklist/)
    assert.match(dashboard, /formatHandoffUpdatedAt/)
    assert.match(dashboard, /searchParams: Promise/)
  })
})
