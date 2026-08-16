'use client'

import { useState } from 'react'
import { SITE_CONFIG } from '@/config/site'
import { CheckCircle2, Shield } from 'lucide-react'

export default function ContactForm() {
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [note, setNote] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setStatus('submitting')

    const form = e.currentTarget
    const data = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      orderNumber: form.orderNumber.value.trim(),
      subject: form.subject.value,
      message: form.message.value.trim(),
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(json.error || 'Unable to send message.')
        setStatus('idle')
        return
      }
      setNote(json.note || 'Message received. Our team responds within 24 hours on business days.')
      setStatus('success')
      form.reset()
    } catch {
      setError('Unable to send message. Please email support@room23.net directly.')
      setStatus('idle')
    }
  }

  if (status === 'success') {
    return (
      <div
        className="space-y-4 rounded-xl px-6 py-8 text-center"
        style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-elevated)' }}
      >
        <CheckCircle2 className="mx-auto h-12 w-12" style={{ color: 'var(--color-emerald)' }} />
        <h3 className="font-[var(--font-syne)] text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
          Message received
        </h3>
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          {note}
        </p>
        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
          Or email {SITE_CONFIG.supportEmail} / call {SITE_CONFIG.supportPhone}.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="pt-2 text-xs font-semibold uppercase tracking-wider underline underline-offset-4"
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
        <label htmlFor="contact-name" className="input-label">
          Full Name
        </label>
        <input id="contact-name" name="name" type="text" className="input-field" placeholder="Your name" required />
      </div>

      <div>
        <label htmlFor="contact-email" className="input-label">
          Email Address
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          className="input-field"
          placeholder="you@email.com"
          required
        />
      </div>

      <div>
        <label htmlFor="contact-order" className="input-label">
          Order Number (if applicable)
        </label>
        <input
          id="contact-order"
          name="orderNumber"
          type="text"
          className="input-field"
          placeholder="e.g. R23-12345"
        />
      </div>

      <div>
        <label htmlFor="contact-subject" className="input-label">
          Subject
        </label>
        <select id="contact-subject" name="subject" className="input-field" defaultValue="" required>
          <option value="" disabled>
            Select a topic
          </option>
          <option value="Order Status / Tracking">Order Status / Tracking</option>
          <option value="Returns & Refunds">Returns &amp; Refunds</option>
          <option value="Product Questions">Product Questions</option>
          <option value="Billing & Payments">Billing &amp; Payments</option>
          <option value="Privacy Concern">Privacy Concern</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="contact-message" className="input-label">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          className="input-field"
          rows={5}
          placeholder="How can we help?"
          required
          style={{ resize: 'vertical' }}
        />
      </div>

      {error ? (
        <p className="text-xs text-red-400" role="alert">
          {error}
        </p>
      ) : null}

      <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Sending…' : 'Send Message'}
      </button>

      <div
        className="flex items-center justify-center gap-1.5 pt-1 text-center"
        style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}
      >
        <Shield className="h-3.5 w-3.5" />
        <span>We respond within 24 hours on business days. Adults 18+ only.</span>
      </div>
    </form>
  )
}
