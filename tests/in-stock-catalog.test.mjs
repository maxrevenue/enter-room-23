import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const products = readFileSync(join(root, 'lib/products.js'), 'utf8')

const STOCK_SKUS = [
  'skins-delay',
  'cg-oh-my',
  'heli-lavender-mist',
  'arlo-atlas-oil',
  'pr-secret-garden-mist',
  'pr-dirty-french-gel',
  'cg-pole-polish',
]

const PRIMARY_IMAGES = {
  'skins-delay': 'public/images/products/skins-delay/packshot.jpg',
  'cg-oh-my': 'public/images/products/cg-oh-my/packshot.webp',
  'heli-lavender-mist': 'public/images/products/heli-lavender-mist/bottle.png',
  'arlo-atlas-oil': 'public/images/products/arlo-atlas-oil/packshot.png',
  'pr-secret-garden-mist': 'public/images/products/pr-secret-garden-mist/packshot.png',
  'pr-dirty-french-gel': 'public/images/products/pr-dirty-french-gel/packshot.png',
  'cg-pole-polish': 'public/images/products/cg-pole-polish/packshot.jpg',
}

describe('in-stock wellness catalog', () => {
  it('lists all seven house-stock SKUs', () => {
    for (const id of STOCK_SKUS) {
      assert.match(products, new RegExp(`id: '${id}'`))
      assert.match(products, new RegExp(`vendorType: VENDOR_TYPES.ROOM23_STOCK`))
    }
    assert.match(products, /newArrival: true/)
  })

  it('does not add Cake stroker and does not resurrect removed dropship SKUs as new work', () => {
    assert.doesNotMatch(products, /id: 'cake-stroker'/)
  })

  it('stores local packshots for each SKU', () => {
    for (const [id, rel] of Object.entries(PRIMARY_IMAGES)) {
      const path = join(root, rel)
      assert.equal(existsSync(path), true, `missing packshot for ${id}: ${rel}`)
      assert.match(products, new RegExp(rel.replace('public', '')))
    }
  })

  it('exposes the new SKUs on new-arrivals', () => {
    assert.match(products, /if \(slug === 'new-arrivals'\) return PRODUCTS.filter\(isNewArrival\)/)
  })
})
