import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { SITE_CONFIG } from '@/config/site'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const name = typeof body?.name === 'string' ? body.name.trim() : ''
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
    const orderNumber = typeof body?.orderNumber === 'string' ? body.orderNumber.trim() : ''
    const subject = typeof body?.subject === 'string' ? body.subject.trim() : ''
    const message = typeof body?.message === 'string' ? body.message.trim() : ''

    if (!name || !email || !EMAIL_RE.test(email) || !subject || !message) {
      return NextResponse.json(
        { error: 'Name, valid email, subject, and message are required.' },
        { status: 400 },
      )
    }

    if (message.length > 5000) {
      return NextResponse.json({ error: 'Message is too long.' }, { status: 400 })
    }

    const to = process.env.ADMIN_EMAIL || SITE_CONFIG.supportEmail
    const apiKey = process.env.RESEND_API_KEY

    if (!apiKey) {
      console.log('[contact]', { name, email, subject, orderNumber, message: message.slice(0, 200) })
      return NextResponse.json({
        ok: true,
        queued: true,
        note: 'Message received. Our team responds within 24 hours on business days.',
      })
    }

    const resend = new Resend(apiKey)
    const { error } = await resend.emails.send({
      from: `Room 23 Contact <noreply@${SITE_CONFIG.domain}>`,
      to: [to],
      replyTo: email,
      subject: `[Room 23 Contact] ${subject}`,
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
    })

    if (error) {
      console.error('[contact] resend error', error)
      return NextResponse.json({ error: 'Unable to send message right now.' }, { status: 502 })
    }

    return NextResponse.json({
      ok: true,
      note: 'Message received. Our team responds within 24 hours on business days.',
    })
  } catch {
    return NextResponse.json({ error: 'Unable to send message.' }, { status: 500 })
  }
}
