'use client'

import { useState } from 'react'
import { SITE_CONFIG } from '@/config/site'
import { CheckCircle2, Shield } from 'lucide-react'

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    const form = e.currentTarget
    const payload = {
      name: form.elements.namedItem('name')?.value,
      email: form.elements.namedItem('email')?.value,
      orderNumber: form.elements.namedItem('orderNumber')?.value,
      subject: form.elements.namedItem('subject')?.value,
      message: form.elements.namedItem('message')?.value,
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Unable to send your message.')
        setSubmitting(false)
        return
      }
      setSubmitted(true)
      form.reset()
    } catch {
      setError(`Network error. Please email ${SITE_CONFIG.supportEmail}.`)
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-8 px-6 rounded-xl space-y-4" style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-elevated)' }}>
        <CheckCircle2 className="w-12 h-12 mx-auto" style={{ color: 'var(--color-emerald)' }} />
        <h3 className="text-xl font-bold font-[var(--font-syne)]" style={{ color: 'var(--color-text-primary)' }}>Message received</h3>
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          Thank you. {SITE_CONFIG.legalName} will reply to your email within 24 hours on business days.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="text-xs font-semibold uppercase tracking-wider underline underline-offset-4 pt-2"
          style={{ color: 'var(--color-emerald)' }}
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <label htmlFor="contact-name" className="input-label">Full Name</label>
        <input id="contact-name" name="name" type="text" className="input-field" required />
      </div>

      <div>
        <label htmlFor="contact-email" className="input-label">Email Address</label>
        <input id="contact-email" name="email" type="email" className="input-field" required />
      </div>

      <div>
        <label htmlFor="contact-order" className="input-label">Order Number (if applicable)</label>
        <input id="contact-order" name="orderNumber" type="text" className="input-field" />
      </div>

      <div>
        <label htmlFor="contact-subject" className="input-label">Subject</label>
        <select id="contact-subject" name="subject" className="input-field" defaultValue="" required>
          <option value="" disabled>Select a topic</option>
          <option value="order">Order Status / Tracking</option>
          <option value="returns">Returns &amp; Refunds</option>
          <option value="product">Product Questions</option>
          <option value="billing">Billing &amp; Payments</option>
          <option value="privacy">Privacy Concern</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="contact-message" className="input-label">Message</label>
        <textarea id="contact-message" name="message" className="input-field" rows={5} required style={{ resize: 'vertical' }} />
      </div>

      {error && (
        <p style={{ color: 'var(--color-accent)', fontSize: 'var(--text-sm)' }}>{error}</p>
      )}

      <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={submitting}>
        {submitting ? 'Sending…' : 'Send Message'}
      </button>

      <div className="flex items-center justify-center gap-1.5 pt-1 text-center" style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
        <Shield className="w-3.5 h-3.5" />
        <span>Messages go to {SITE_CONFIG.supportEmail}. We do not invent ticket numbers.</span>
      </div>
    </form>
  )
}
