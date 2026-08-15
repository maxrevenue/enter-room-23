import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  buildOrderEmailContent,
  buildOrderSubject,
  sendOrderConfirmation,
  ORDER_FROM,
  SUPPORT_EMAIL,
  REFUND_POLICY_URL,
} from '../lib/email/order-confirmation.mjs'

const validInput = {
  orderId: 'R23-2001',
  email: 'buyer@example.com',
  items: [{ name: 'Platinum Silicone Lubricant - 2oz', qty: 2, price: 18 }],
  totals: { subtotal: 36, shipping: 8, tax: 2.88, total: 46.88 },
}

describe('order confirmation email', () => {
  it('uses a lock-screen-neutral subject', () => {
    assert.equal(buildOrderSubject('R23-2001'), 'Room 23: Order #R23-2001 Confirmation')
    assert.doesNotMatch(buildOrderSubject('R23-2001'), /lube|adult|wellness product/i)
  })

  it('lists items, delivery total, discreet shipping, support, and refund policy', () => {
    const { text, html } = buildOrderEmailContent(validInput)
    assert.match(text, /Platinum Silicone Lubricant/)
    assert.match(text, /2 ×/)
    assert.match(text, /Delivery total: \$46\.88/)
    assert.match(text, /Shipped in plain, neutral packaging/)
    assert.match(text, new RegExp(SUPPORT_EMAIL))
    assert.match(text, new RegExp(REFUND_POLICY_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
    assert.match(html, new RegExp(`mailto:${SUPPORT_EMAIL}`))
    assert.match(html, new RegExp(REFUND_POLICY_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
    assert.doesNotMatch(text, /eldorado|williams/i)
  })

  it('validates with Zod before calling Resend', async () => {
    let called = false
    await assert.rejects(
      () =>
        sendOrderConfirmation(
          { orderId: '', email: 'not-an-email', items: [], totals: {} },
          { resend: { emails: { send: async () => { called = true } } } },
        ),
      (error) => error.code === 'EMAIL_VALIDATION',
    )
    assert.equal(called, false)
  })

  it('sends through Resend with the Room 23 orders sender', async () => {
    const sent = []
    const result = await sendOrderConfirmation(validInput, {
      resend: {
        emails: {
          send: async (payload) => {
            sent.push(payload)
            return { data: { id: 're_test' }, error: null }
          },
        },
      },
    })

    assert.equal(result.sent, true)
    assert.equal(sent[0].from, ORDER_FROM)
    assert.equal(sent[0].to, validInput.email)
    assert.equal(sent[0].subject, 'Room 23: Order #R23-2001 Confirmation')
    assert.equal(sent[0].headers['Idempotency-Key'], 'order-email:R23-2001')
    assert.notEqual(result.emailHash, validInput.email)
  })
})
