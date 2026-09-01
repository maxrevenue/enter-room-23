import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  BILLING_DESCRIPTOR,
  FAQ_ITEMS,
  PAYMENT_UI,
  STATEMENT_CHECKOUT,
  SUPPORT_TEMPLATES,
  buildOrderSubject,
  fillTemplate,
} from '../lib/customer-copy.mjs'

const SALESY = /absolutely|proudly|swiftly|no judgment|intimate nature/i

function blob(value) {
  return typeof value === 'string' ? value : JSON.stringify(value)
}

describe('customer copy', () => {
  it('locks the billing descriptor and checkout statement line', () => {
    assert.equal(BILLING_DESCRIPTOR, 'ROOM23 WELLNESS')
    assert.equal(STATEMENT_CHECKOUT, 'Your statement will read ROOM23 WELLNESS.')
  })

  it('uses a lock-screen-neutral order subject without product nicknames', () => {
    assert.equal(buildOrderSubject('R23-2001'), 'Your Room 23 order R23-2001')
    assert.doesNotMatch(buildOrderSubject('R23-2001'), /lube|adult|wellness product/i)
  })

  it('interpolates order_number in support templates', () => {
    const body = fillTemplate(SUPPORT_TEMPLATES.declineRetry.body, { order_number: 'R23-2001' })
    assert.match(body, /order R23-2001/)
    assert.doesNotMatch(body, /\{\{order_number\}\}/)
    assert.match(body, /Nothing was charged/)
    assert.match(body, /ROOM23 WELLNESS/)
  })

  it('locks the 14-day unused return window and hygiene language', () => {
    const returns = SUPPORT_TEMPLATES.returnHygiene.body
    assert.match(returns, /14 days of delivery/)
    assert.match(returns, /original payment method/)
    assert.match(returns, /opened or used/)
    assert.match(returns, /will not ask you to describe use/)
    assert.match(returns, /replace or refund/)
    assert.match(returns, /You do not need to send a photo of an ID/)
    assert.doesNotMatch(returns, SALESY)
  })

  it('keeps FAQ free of salesy phrasing and ID-photo requests', () => {
    const text = FAQ_ITEMS.map((item) => `${item.q} ${item.a}`).join('\n')
    assert.doesNotMatch(text, SALESY)
    assert.match(text, /You do not need to send a photo of an ID/)
    assert.doesNotMatch(text, /please (send|attach|include).{0,60}(id|driver.?s license)/i)
    assert.match(text, /ROOM23 WELLNESS/)
    assert.match(text, /plain, unlabeled packaging/)
    assert.match(text, /support@room23\.net/)
    assert.match(text, /United States/)
  })

  it('states in-product payment outcomes without blame', () => {
    assert.match(PAYMENT_UI.soft, /Nothing was charged/)
    assert.match(PAYMENT_UI.hard, /Nothing was charged/)
    assert.match(PAYMENT_UI.processorDown, /Nothing was charged/)
    assert.doesNotMatch(blob(PAYMENT_UI), /you failed|your fault|declined because you/i)
  })
})
