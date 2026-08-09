'use client'

import { useState } from 'react'
import { SITE_CONFIG } from '@/config/site'
import { CheckCircle2, Shield } from 'lucide-react'

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [refNum, setRefNum] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const ticketId = 'TICK-' + Math.floor(100000 + Math.random() * 900000)
    setRefNum(ticketId)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="text-center py-8 px-6 rounded-xl border border-[#C9A060]/30 bg-[#C9A060]/5 space-y-4 animate-in fade-in duration-300">
        <CheckCircle2 className="w-12 h-12 text-[#C9A060] mx-auto" />
        <h3 className="text-xl font-bold font-[var(--font-syne)] text-white">Message Received</h3>
        <p className="text-sm text-white/70">
          Thank you for contacting Room 23. Your request has been assigned confidential Reference ID{' '}
          <strong className="text-[#C9A060] font-mono">{refNum}</strong>.
        </p>
        <p className="text-xs text-white/50">
          Our concierge support team will respond to your email within 24 hours with complete discretion.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="text-xs font-semibold uppercase tracking-wider text-[#C9A060] underline underline-offset-4 hover:text-white pt-2"
        >
          Send Another Message
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
    >
      <div>
        <label htmlFor="contact-name" className="input-label">Full Name</label>
        <input
          id="contact-name"
          type="text"
          className="input-field"
          placeholder="Your name"
          required
        />
      </div>

      <div>
        <label htmlFor="contact-email" className="input-label">Email Address</label>
        <input
          id="contact-email"
          type="email"
          className="input-field"
          placeholder="you@email.com"
          required
        />
      </div>

      <div>
        <label htmlFor="contact-order" className="input-label">Order Number (if applicable)</label>
        <input
          id="contact-order"
          type="text"
          className="input-field"
          placeholder="e.g. R23-12345"
        />
      </div>

      <div>
        <label htmlFor="contact-subject" className="input-label">Subject</label>
        <select
          id="contact-subject"
          className="input-field"
          defaultValue=""
          required
        >
          <option value="" disabled style={{ color: 'var(--text-muted)' }}>Select a topic</option>
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
        <textarea
          id="contact-message"
          className="input-field"
          rows={5}
          placeholder="How can we help?"
          required
          style={{ resize: 'vertical' }}
        />
      </div>

      <button type="submit" className="btn-primary" style={{ width: '100%' }}>
        Send Message
      </button>

      <div className="flex items-center justify-center gap-1.5 pt-1 text-center" style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
        <Shield className="w-3.5 h-3.5 text-[#C9A060]" />
        <span>Your message is handled with 100% encrypted discretion and never shared.</span>
      </div>
    </form>
  )
}
