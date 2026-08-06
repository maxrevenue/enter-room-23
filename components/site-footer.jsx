'use client'

import Link from 'next/link'
import { BUSINESS_STREET, BUSINESS_CITY_STATE, BUSINESS_ADDRESS_FULL, BUSINESS_PHONE, SUPPORT_EMAIL } from '@/lib/contact-info'
import { Shield, Lock, CreditCard } from 'lucide-react'

export default function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer style={{ backgroundColor: 'var(--color-bg-surface)', borderTop: '1px solid var(--color-border)' }}>
      <div className="container-page" style={{ paddingTop: '3rem', paddingBottom: '2rem' }}>

        {/* ── 4-Column Grid ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '2.5rem',
          }}
          className="sm:grid-cols-2 lg:grid-cols-4"
        >
          {/* ── Column 1: Brand & Legal Entity ── */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-lg)',
                fontWeight: 700,
                color: 'var(--color-brass)',
                letterSpacing: '0.08em',
                marginBottom: '1rem',
              }}
            >
              ROOM 23
            </h4>
            <div style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.8 }}>
              <p style={{ marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>
                Premium Adult Wellness<br />
                Discreet · Private · Curated
              </p>
              <p style={{ marginBottom: '0.25rem' }}>
                <strong style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Registered Entity:</strong>
              </p>
              <p style={{ marginBottom: '0.75rem' }}>
                Room 23<br />
                {BUSINESS_STREET}<br />
                {BUSINESS_CITY_STATE}<br />
                United States
              </p>
              <p style={{ marginBottom: '0.25rem' }}>
                <strong style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Support Email:</strong>
              </p>
              <a href="mailto:support@room23.net" className="link-brass" style={{ fontSize: 'var(--text-sm)' }}>
                support@room23.net
              </a>
              <p style={{ marginTop: '0.75rem', marginBottom: '0.25rem' }}>
                <strong style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Phone:</strong>
              </p>
              <p style={{ color: 'var(--text-primary)', fontSize: 'var(--text-sm)' }}>{BUSINESS_PHONE}</p>
              <p style={{ marginTop: '0.5rem', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                Mon–Fri 9:00 AM–6:00 PM ET
              </p>
            </div>
          </div>

          {/* ── Column 2: Legal Links ── */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                color: 'var(--text-primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '1rem',
              }}
            >
              Legal
            </h4>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              <Link href="/terms" className="link-muted" style={{ fontSize: 'var(--text-sm)' }}>
                Terms of Service
              </Link>
              <Link href="/privacy" className="link-muted" style={{ fontSize: 'var(--text-sm)' }}>
                Privacy Policy
              </Link>
              <Link href="/shipping" className="link-muted" style={{ fontSize: 'var(--text-sm)' }}>
                Shipping &amp; Returns
              </Link>
            </nav>
          </div>

          {/* ── Column 3: Customer Care ── */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                color: 'var(--text-primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '1rem',
              }}
            >
              Customer Care
            </h4>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              <Link href="/faq" className="link-muted" style={{ fontSize: 'var(--text-sm)' }}>
                FAQ
              </Link>
              <Link href="/contact" className="link-muted" style={{ fontSize: 'var(--text-sm)' }}>
                Contact Us
              </Link>
              <Link href="/shop" className="link-muted" style={{ fontSize: 'var(--text-sm)' }}>
                Shop
              </Link>
            </nav>
          </div>

          {/* ── Column 4: Gateway & Trust Badges ── */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                color: 'var(--text-primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '1rem',
              }}
            >
              Trust &amp; Security
            </h4>
            <div style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>

              {/* Statement Descriptor */}
              <div
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem',
                  marginBottom: '1rem',
                  border: '1px solid var(--border-light)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <CreditCard size={16} style={{ color: 'var(--color-brass)', marginTop: '1px', flexShrink: 0 }} />
                  <p style={{ fontSize: 'var(--text-xs)', lineHeight: 1.5 }}>
                    Charges will appear as <strong style={{ color: 'var(--text-primary)' }}>ROOM23</strong> on your card statement.
                  </p>
                </div>
              </div>

              {/* SSL Badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Lock size={14} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
                <span style={{ fontSize: 'var(--text-xs)' }}>256-bit SSL Encrypted</span>
              </div>

              {/* PCI Badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Shield size={14} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
                <span style={{ fontSize: 'var(--text-xs)' }}>PCI-DSS Level 1 Compliant</span>
              </div>

              {/* Payment Badges */}
              <div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                  Accepted Payments
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {['Visa', 'Mastercard', 'Amex', 'Discover'].map((card) => (
                    <span
                      key={card}
                      style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.6rem',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 600,
                        color: 'var(--text-secondary)',
                        backgroundColor: 'var(--bg-elevated)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-sm)',
                      }}
                    >
                      {card}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div
          style={{
            marginTop: '2.5rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
          }}
          className="md:flex-row md:justify-between"
        >
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
            &copy; {year} Room 23. All rights reserved. For adults 18+ only.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)', opacity: 0.6 }}>
            Discreet packaging · Private billing · Secure checkout
          </p>
        </div>
      </div>
    </footer>
  )
}
