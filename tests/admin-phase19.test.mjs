import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

function read(rel) {
  return readFileSync(path.join(root, rel), 'utf8')
}

describe('admin phase 19 order SLA timers', () => {
  it('defines canonical SLA thresholds and helpers', () => {
    const sla = read('lib/admin-sla.ts')
    assert.match(sla, /export const WARN_HOURS = 24/)
    assert.match(sla, /export const CRITICAL_HOURS = 48/)
    assert.match(sla, /export function orderAgeHours/)
    assert.match(sla, /export function slaLevel/)
    assert.match(sla, /export function formatOrderAgeShort/)
    assert.match(sla, /export function formatOpenForLabel/)
    assert.match(sla, /export function slaTextClass/)
    assert.match(sla, /export function orderAgeDisplay/)
    assert.match(sla, /export function slaSortWeight/)
    assert.match(sla, /isOpenOrder/)
  })

  it('sorts inbox orders by SLA urgency before risk severity', () => {
    const risk = read('lib/admin-risk.ts')
    assert.match(risk, /slaSortWeight\(b\.order, now\) - slaSortWeight\(a\.order, now\)/)
    assert.match(risk, /from '@\/lib\/admin-sla'/)
  })

  it('shows age column on orders list and open-for label on detail', () => {
    const ordersPage = read('app/admin/orders/page.tsx')
    const detailPage = read('app/admin/orders/[id]/page.tsx')
    const table = read('components/admin/orders-bulk-table.tsx')
    assert.match(ordersPage, /orderAgeDisplay/)
    assert.match(table, /ageLabel/)
    assert.match(table, /Age/)
    assert.match(detailPage, /formatOpenForLabel/)
    assert.match(detailPage, /openForLabel/)
  })
})
