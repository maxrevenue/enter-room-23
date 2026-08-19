import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

function read(rel) {
  return readFileSync(path.join(root, rel), 'utf8')
}

describe('admin phase 20 pack wave', () => {
  it('defines pack wave helpers with a 50-order cap', () => {
    const packWave = read('lib/admin-pack-wave.ts')
    assert.match(packWave, /PACK_WAVE_LIMIT = 50/)
    assert.match(packWave, /export function parsePackWaveIds/)
    assert.match(packWave, /export function buildPackWaveHref/)
    assert.match(packWave, /export function aggregatePickList/)
    assert.match(packWave, /export function buildWaveOrderSummaries/)
    const packWaveServer = read('lib/admin-pack-wave.server.ts')
    assert.match(packWaveServer, /export async function getAdminOrdersByIds/)
    assert.match(packWave, /orderCount/)
  })

  it('renders combined pick list page with print CSS and admin auth', () => {
    const page = read('app/admin/pack-wave/page.tsx')
    assert.match(page, /isAdminAuthenticated/)
    assert.match(page, /searchParams: Promise/)
    assert.match(page, /parsePackWaveIds/)
    assert.match(page, /aggregatePickList/)
    assert.match(page, /#pack-wave/)
    assert.match(page, /Combined pick list/)
    assert.match(page, /Wave orders/)
    assert.match(page, /packingSlipHref/)
    assert.match(page, /PackWavePrintButton/)
  })

  it('adds pack wave entry to open orders bulk toolbar', () => {
    const ordersPage = read('app/admin/orders/page.tsx')
    const ordersTable = read('components/admin/orders-bulk-table.tsx')
    assert.match(ordersPage, /showPackWave=\{view === 'open'\}/)
    assert.match(ordersTable, /buildPackWaveHref/)
    assert.match(ordersTable, /Pack wave/)
    assert.match(ordersTable, /showPackWave/)
  })
})
