import Link from 'next/link'
import { useState } from 'react'
import { SITE_CONFIG } from '@/config/site'
import { ShieldCheck, Truck, CreditCard, Mail, ArrowRight, Check } from 'lucide-react'
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
        {/* ── Top: Logo + Short descriptor ── */}
        <div className="text-center mb-12 sm:mb-14">
          <p
            className="font-syne text-xl font-bold tracking-[0.15em] uppercase mb-3"
            style={{ color: 'var(--accent)' }}
          >
            {SITE_CONFIG.name}
          </p>
          <p
            className="text-sm max-w-sm mx-auto"
            style={{ color: 'var(--text-secondary)' }}
          >
            Discreet delivery. Private billing. Curated for adults 18+ only.
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
        <div className="text-center mb-10">
          <h4
            className="font-syne text-sm font-semibold tracking-[0.1em] uppercase mb-3"
            style={{ color: 'var(--text-primary)' }}
          >
            <Mail className="inline w-4 h-4 mr-2" style={{ color: 'var(--accent)' }} />
            The Room 23 Dispatch
          </h4>
          <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
            Product drops, curated editorial, and member-only offers. No spam, adults only.
          </p>
          {subscribed ? (
            <p className="text-sm" style={{ color: 'var(--color-success)' }}>
              <Check className="inline w-4 h-4 mr-1" /> Subscribed — thank you.
            </p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-xs mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 px-3 py-2 text-sm rounded-md border"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  borderColor: 'var(--border)',
                }}
              />
              <button
                type="submit"
                className="p-2 rounded-md transition-colors"
                style={{
                  backgroundColor: 'var(--accent)',
                  color: 'var(--text-primary)',
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
        <p
          className="text-xs text-center"
          style={{ color: 'var(--text-muted)' }}
        >
          &copy; {new Date().getFullYear()} {SITE_CONFIG.legalName}. All rights reserved.
          Billing descriptor: {SITE_CONFIG.billingDescriptor}
          <br />
          <span className="opacity-60">
            Last updated: {SITE_CONFIG.lastUpdated}
          </span>
        </p>
      </div>
    </footer>
  )
}
