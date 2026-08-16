import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { SITE_CONFIG } from '@/config/site'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export async function POST(request) {
  try {
    const body = await request.json()
    const name = typeof body.name === 'string' ? body.name.trim() : ''
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    const orderNumber = typeof body.orderNumber === 'string' ? body.orderNumber.trim() : ''
    const subject = typeof body.subject === 'string' ? body.subject.trim() : 'Customer message'
    const message = typeof body.message === 'string' ? body.message.trim() : ''

    if (!name || !email || !EMAIL_RE.test(email) || !message) {
      return NextResponse.json({ error: 'Name, a valid email, and a message are required.' }, { status: 400 })
    }

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Messaging is temporarily unavailable. Please email support@room23.net directly.' },
        { status: 503 },
      )
    }

    const to = process.env.CONTACT_TO_EMAIL || SITE_CONFIG.supportEmail
    const from = process.env.CONTACT_FROM_EMAIL || `Room 23 <${SITE_CONFIG.supportEmail}>`
    const resend = new Resend(apiKey)

    const result = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `[Room 23 contact] ${subject}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        orderNumber ? `Order: ${orderNumber}` : null,
        `Subject: ${subject}`,
        '',
        message,
      ]
        .filter(Boolean)
        .join('\n'),
      html: `<p><strong>Name:</strong> ${escapeHtml(name)}</p>
<p><strong>Email:</strong> ${escapeHtml(email)}</p>
${orderNumber ? `<p><strong>Order:</strong> ${escapeHtml(orderNumber)}</p>` : ''}
<p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
<p>${escapeHtml(message).replace(/\n/g, '<br/>')}</p>`,
    })

    if (result.error) {
      return NextResponse.json(
        { error: 'Unable to send your message. Please email support@room23.net.' },
        { status: 502 },
      )
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json(
      { error: 'Unable to send your message. Please email support@room23.net.' },
      { status: 500 },
    )
  }
}
