import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { hashEmail, truncateIp, sanitizeLog } from '../lib/privacy.mjs'

describe('privacy helpers', () => {
  it('hashes emails with SHA-256 and normalizes case', async () => {
    const a = await hashEmail('Orders@Room23.net')
    const b = await hashEmail('orders@room23.net')
    assert.equal(a, b)
    assert.equal(a.length, 64)
    assert.match(a, /^[a-f0-9]+$/)
    assert.doesNotMatch(a, /room23|orders/i)
  })

  it('truncates IPv4 to /16 and never returns the host octets', () => {
    assert.equal(truncateIp('203.0.113.44'), '203.0.0.0')
    assert.notEqual(truncateIp('203.0.113.44'), '203.0.113.44')
  })

  it('redacts card, CVV, email, and IP keys from logs', () => {
    const clean = sanitizeLog({
      orderId: 'R23-1',
      email: 'buyer@example.com',
      cardNumber: '4111111111111111',
      cvv: '123',
      ip: '203.0.113.44',
      emailHash: 'abc',
    })
    assert.equal(clean.orderId, 'R23-1')
    assert.equal(clean.emailHash, 'abc')
    assert.equal(clean.email, '[redacted]')
    assert.equal(clean.cardNumber, '[redacted]')
    assert.equal(clean.cvv, '[redacted]')
    assert.equal(clean.ip, '[redacted]')
  })
})
