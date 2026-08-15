/**
 * Transactional order confirmation via Resend.
 * Subject lines stay lock-screen neutral. Bodies never name suppliers.
 */

import { Resend } from 'resend'
import { z } from 'zod'
import { hashEmail, sanitizeLog } from '../privacy.mjs'

export const ORDER_FROM = 'Room 23 <orders@room23.net>'
export const SUPPORT_EMAIL = 'support@room23.net'
export const REFUND_POLICY_URL = 'https://room23.net/shipping'

const money = z.number().finite().nonnegative()

const orderEmailSchema = z.object({
  orderId: z.string().min(1).max(80),
  email: z.string().email(),
  items: z
    .array(
      z.object({
        name: z.string().min(1),
        qty: z.number().int().positive(),
        price: money,
      }),
    )
    .min(1),
  totals: z.object({
    subtotal: money,
    shipping: money,
    tax: money.optional(),
    total: money,
  }),
  splitFulfillment: z.boolean().optional(),
})

function formatMoney(value) {
  return `$${Number(value).toFixed(2)}`
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function buildOrderSubject(orderId) {
  return `Room 23: Order #${orderId} Confirmation`
}

export function buildOrderEmailContent({ orderId, items, totals, splitFulfillment }) {
  const itemLines = items
    .map((item) => `${item.qty} × ${item.name} — ${formatMoney(item.price * item.qty)}`)
    .join('\n')

  const splitLine = splitFulfillment
    ? 'Some items will ship separately. Each package uses plain, neutral packaging.'
    : 'Shipped in plain, neutral packaging.'

  const text = [
    `Thank you for your order.`,
    ``,
    `Order #${orderId}`,
    ``,
    `Items`,
    itemLines,
    ``,
    `Subtotal: ${formatMoney(totals.subtotal)}`,
    `Shipping: ${formatMoney(totals.shipping)}`,
    totals.tax != null ? `Tax: ${formatMoney(totals.tax)}` : null,
    `Delivery total: ${formatMoney(totals.total)}`,
    ``,
    splitLine,
    ``,
    `Questions? Email ${SUPPORT_EMAIL}`,
    `Refund policy: ${REFUND_POLICY_URL}`,
  ]
    .filter(Boolean)
    .join('\n')

  const itemRows = items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px 0;border-bottom:1px solid #eee;">${escapeHtml(item.name)}</td>
          <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:center;">${item.qty}</td>
          <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;">${formatMoney(item.price * item.qty)}</td>
        </tr>`,
    )
    .join('')

  const html = `<!DOCTYPE html>
<html>
<body style="font-family:Georgia,serif;color:#222;background:#fff;margin:0;padding:24px;">
  <p>Thank you for your order.</p>
  <p><strong>Order #${escapeHtml(orderId)}</strong></p>
  <table style="width:100%;border-collapse:collapse;margin:16px 0;">
    <thead>
      <tr>
        <th style="text-align:left;padding:8px 0;border-bottom:1px solid #ccc;">Item</th>
        <th style="text-align:center;padding:8px 0;border-bottom:1px solid #ccc;">Qty</th>
        <th style="text-align:right;padding:8px 0;border-bottom:1px solid #ccc;">Amount</th>
      </tr>
    </thead>
    <tbody>${itemRows}</tbody>
  </table>
  <p>
    Subtotal: ${formatMoney(totals.subtotal)}<br/>
    Shipping: ${formatMoney(totals.shipping)}<br/>
    ${totals.tax != null ? `Tax: ${formatMoney(totals.tax)}<br/>` : ''}
    <strong>Delivery total: ${formatMoney(totals.total)}</strong>
  </p>
  <p>${escapeHtml(splitLine)}</p>
  <p style="margin-top:32px;font-size:13px;color:#555;">
    Support: <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a><br/>
    <a href="${REFUND_POLICY_URL}">Refund policy</a>
  </p>
</body>
</html>`

  return { text, html, discreetNotice: splitLine }
}

function getResendClient(client) {
  if (client) return client
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    const error = new Error('RESEND_API_KEY is not configured')
    error.code = 'EMAIL_NOT_CONFIGURED'
    throw error
  }
  return new Resend(apiKey)
}

/**
 * Validate and send a lock-screen-neutral order confirmation.
 */
export async function sendOrderConfirmation(input, options = {}) {
  const parsed = orderEmailSchema.safeParse(input)
  if (!parsed.success) {
    const error = new Error('Invalid order confirmation payload')
    error.code = 'EMAIL_VALIDATION'
    error.details = parsed.error.flatten()
    throw error
  }

  const data = parsed.data
  const emailHash = await hashEmail(data.email)
  const subject = buildOrderSubject(data.orderId)
  const { text, html } = buildOrderEmailContent(data)
  const resend = getResendClient(options.resend)

  try {
    const result = await resend.emails.send({
      from: ORDER_FROM,
      to: data.email,
      subject,
      text,
      html,
      headers: {
        'Idempotency-Key': options.idempotencyKey || `order-email:${data.orderId}`,
      },
    })

    if (result.error) {
      const error = new Error('Resend rejected the message')
      error.code = 'EMAIL_PROVIDER_ERROR'
      throw error
    }

    console.info(
      JSON.stringify({
        scope: 'email',
        message: 'Order confirmation sent',
        orderId: data.orderId,
        emailHash,
        ...sanitizeLog({ providerId: result.data?.id || null }),
      }),
    )

    return {
      sent: true,
      orderId: data.orderId,
      subject,
      emailHash,
      id: result.data?.id || null,
    }
  } catch (error) {
    if (error.code === 'EMAIL_VALIDATION' || error.code === 'EMAIL_NOT_CONFIGURED') throw error
    console.error(
      JSON.stringify({
        scope: 'email',
        level: 'error',
        message: 'Order confirmation failed; flagged for admin review',
        orderId: data.orderId,
        emailHash,
        errorCode: error.code || 'EMAIL_SEND_FAILED',
      }),
    )
    error.code = error.code || 'EMAIL_SEND_FAILED'
    error.adminReview = true
    throw error
  }
}
