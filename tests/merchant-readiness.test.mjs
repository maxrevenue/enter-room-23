import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { VALID_PROMO_CODES } from '../lib/promos.mjs'
import { FLAT_SHIPPING_RATE, FREE_SHIPPING_THRESHOLD, getShippingRate } from '../lib/shipping.mjs'
import { buildCCBillFlexFormUrl } from '../lib/ccbill.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

function read(rel) {
  return readFileSync(join(root, rel), 'utf8')
}

describe('merchant readiness', () => {
  it('does not accept SOFTLAUNCH10', () => {
    assert.equal(VALID_PROMO_CODES.SOFTLAUNCH10, undefined)
    assert.equal(VALID_PROMO_CODES.WELCOME10, 10)
    assert.equal(VALID_PROMO_CODES.ROOM23, 10)
  })

  it('matches /shipping standard rate of $5.99 and $99 free threshold', () => {
    assert.equal(FLAT_SHIPPING_RATE, 5.99)
    assert.equal(FREE_SHIPPING_THRESHOLD, 99)
    assert.equal(getShippingRate(18, 'standard'), 5.99)
    assert.equal(getShippingRate(99, 'standard'), 0)
    assert.equal(getShippingRate(120, 'expedited'), 12.99)
  })

  it('builds a one-time CCBill digest without recurring fields', () => {
    const url = buildCCBillFlexFormUrl({
      total: 23.99,
      orderId: 'R23-TEST',
      email: 'buyer@example.com',
      domain: 'room23.net',
      env: {
        CCBILL_ACCOUNT_NUMBER: '123456',
        CCBILL_SUB_ACCOUNT: '0000',
        CCBILL_FLEXFORM_ID: 'flex-id',
        CCBILL_SALT: 'testsalt',
        CCBILL_CURRENCY_CODE: '840',
      },
    })
    assert.match(url, /initialPrice=23.99/)
    assert.doesNotMatch(url, /recurringPrice/)
    assert.doesNotMatch(url, /numRebills/)
  })

  it('does not 307 shop routes to home in middleware', () => {
    const source = read('middleware.js')
    assert.doesNotMatch(source, /redirect\(new URL\('\/'/)
    assert.match(source, /https:/)
  })

  it('keeps checkout enabled and omits soft-launch env flags', () => {
    const wrangler = read('wrangler.jsonc')
    assert.doesNotMatch(wrangler, /NEXT_PUBLIC_SOFT_LAUNCH/)
    const site = read('config/site.js')
    assert.match(site, /checkoutEnabled:\s*true/)
    assert.doesNotMatch(site, /softLaunch/)
    assert.doesNotMatch(site, /NEXT_PUBLIC_SOFT_LAUNCH/)
    assert.match(site, /ROOM23 WELLNESS/)
    const envExample = read('.env.example')
    assert.doesNotMatch(envExample, /SOFT_LAUNCH/)
  })

  it('keeps vintage collection out of the customer catalog', () => {
    const products = read('lib/products.js')
    assert.doesNotMatch(products, /pre-owned/)
    assert.doesNotMatch(products, /vintage:/)
    const collections = read('app/collections/page.tsx')
    assert.doesNotMatch(collections, /vintage/)
  })

  it('names CCBill in legal pages and omits NMI sitewide', () => {
    const terms = read('app/terms/page.jsx')
    const privacy = read('app/privacy/page.jsx')
    assert.match(terms, /SITE_CONFIG\.paymentProcessor/)
    assert.match(terms, /SITE_CONFIG\.pciCheckoutWording/)
    assert.match(terms, /SITE_CONFIG\.billingDescriptor/)
    assert.match(privacy, /SITE_CONFIG\.paymentProcessor/)
    assert.match(privacy, /SITE_CONFIG\.pciCheckoutWording/)
    assert.doesNotMatch(terms, /PCI-DSS Level 1/)
    assert.doesNotMatch(privacy, /PCI-DSS Level 1/)

    const site = read('config/site.js')
    assert.match(site, /paymentProcessor:\s*'CCBill'/)
    assert.match(site, /Secure checkout processed by CCBill/)
    assert.doesNotMatch(site, /NMI/)

    const wrangler = read('wrangler.jsonc')
    assert.doesNotMatch(wrangler, /NMI/)
  })

  it('does not leave enterroom23.com on the customer path', () => {
    const nextConfig = read('next.config.js')
    assert.doesNotMatch(nextConfig, /enterroom23/)
    assert.match(nextConfig, /https:\/\/room23\.net/)
  })
})
