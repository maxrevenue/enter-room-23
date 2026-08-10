'use client'

import Link from 'next/link'
import { useState } from 'react'
import { SITE_CONFIG } from '@/config/site'
import { ShieldCheck, Truck, CreditCard, Mail, ArrowRight, Check, ArrowUp } from 'lucide-react'
import { track } from '@/lib/analytics-client'

export default function SiteFooter() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email && email.includes('@')) {
      track('newsletter_signup', { email })
      setSubscribed(true)
      setEmail('')
    }
  }

  return (
    <footer
      className="border-t px-4 py-14 sm:py-20"
      style={{
        backgroundColor: 'var(--bg-elevated, var(--bg-surface))',
        borderColor: 'var(--border)',
      }}
    >
      <div className="mx-auto max-w-5xl">
        {/* ── Top: Official Logo + Short descriptor ── */}
        <div className="text-center mb-12 sm:mb-14 flex flex-col items-center">
          <Link href="/" className="inline-block mb-3 focus:outline-none" aria-label="Room 23 Home">
            <img
              src="/new logo 2.png"
              alt="Room 23 — Private Wellness"
              className="h-24 w-auto object-contain animate-float"
              style={{ filter: 'drop-shadow(0 4px 16px rgba(0,134,107,0.12))' }}
            />
          </Link>

          <p
            className="text-sm max-w-sm mx-auto mb-2"
            style={{ color: 'var(--text-secondary)' }}
          >
            Discreet delivery. Private billing. Curated for adults 18+ only.
          </p>
          <p
            className="text-xs"
            style={{ color: 'var(--text-muted)', opacity: 0.6 }}
          >
            Serving discerning adults since 2024
          </p>
        </div>

        {/* ── Middle: Three Columns ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12 text-center sm:text-left">
          {/* Support */}
          <div>
            <h4
              className="font-syne text-sm font-semibold tracking-[0.1em] uppercase mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              Support
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/faq"
                  className="text-sm transition-colors duration-200 hover:text-[var(--accent)]"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-sm transition-colors duration-200 hover:text-[var(--accent)]"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Shipping
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm transition-colors duration-200 hover:text-[var(--accent)]"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/journal"
                  className="text-sm transition-colors duration-200 hover:text-[var(--accent)]"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  The Column
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4
              className="font-syne text-sm font-semibold tracking-[0.1em] uppercase mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              Legal
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/terms"
                  className="text-sm transition-colors duration-200 hover:text-[var(--accent)]"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm transition-colors duration-200 hover:text-[var(--accent)]"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4
              className="font-syne text-sm font-semibold tracking-[0.1em] uppercase mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              {SITE_CONFIG.legalName}
            </h4>
            <p
              className="text-sm leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              {SITE_CONFIG.bizStreet}
              <br />
              {SITE_CONFIG.bizCityState}
              <br />
              {SITE_CONFIG.location}
            </p>
            <p
              className="text-sm mt-3"
              style={{ color: 'var(--text-secondary)' }}
            >
              {SITE_CONFIG.supportEmail}
            </p>
            <p
              className="text-sm mt-1"
              style={{ color: 'var(--text-secondary)' }}
            >
              {SITE_CONFIG.supportPhone}
            </p>
            <p
              className="text-xs mt-0.5"
              style={{ color: 'var(--text-muted)' }}
            >
              {SITE_CONFIG.hours}
            </p>
          </div>
        </div>

        {/* ── Newsletter ── */}
        <div
          className="text-center mb-10 p-7 rounded-xl"
          style={{
            background: 'linear-gradient(135deg, rgba(212,168,83,0.06) 0%, rgba(212,168,83,0.02) 100%)',
            border: '1px solid rgba(212,168,83,0.12)',
          }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Mail className="inline w-4 h-4" style={{ color: 'var(--color-accent)' }} />
            <h4
              className="font-syne text-sm font-semibold tracking-[0.1em] uppercase"
              style={{ color: 'var(--text-primary)' }}
            >
              The Room 23 Dispatch
            </h4>
          </div>
          <p className="text-xs mb-5" style={{ color: 'var(--text-muted)' }}>
            Product drops, curated editorial, and member-only offers. No spam, adults only.
          </p>
          {subscribed ? (
            <p className="text-sm flex items-center justify-center gap-2" style={{ color: 'var(--color-success)' }}>
              <Check className="w-4 h-4" /> Subscribed — thank you.
            </p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-xs mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 px-3 py-2 text-sm rounded-md border outline-none"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  color: 'var(--text-primary)',
                  borderColor: 'var(--border)',
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-brass)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
              />
              <button
                type="submit"
                className="p-2 rounded-md transition-colors"
                style={{
                  backgroundColor: 'var(--color-accent)',
                  color: '#fff',
                }}
                aria-label="Subscribe"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

        {/* ── Trust Strip ── */}
        <div
          className="flex flex-wrap justify-center gap-6 sm:gap-8 mb-10 py-4 border-y text-xs"
          style={{
            borderColor: 'var(--border)',
            color: 'var(--text-muted)',
          }}
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" style={{ color: 'var(--accent)' }} />
            <span>Discreet Packaging</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4" style={{ color: 'var(--accent)' }} />
            <span>{SITE_CONFIG.carriers.join(' / ')}</span>
          </div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" style={{ color: 'var(--accent)' }} />
            <span>Bills as {SITE_CONFIG.billingDescriptor}</span>
          </div>
        </div>

        {/* ── Bottom ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p
            className="text-xs"
            style={{ color: 'var(--text-muted)' }}
          >
            &copy; {new Date().getFullYear()} {SITE_CONFIG.legalName}. All rights reserved.
            {' '}Billing: {SITE_CONFIG.billingDescriptor}
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-1.5 text-xs transition-colors duration-200 hover:text-[var(--color-brass)]"
            style={{ color: 'var(--text-muted)' }}
          >
            <ArrowUp size={12} />
            Back to top
          </button>
        </div>
      </div>
    </footer>
  )
}
