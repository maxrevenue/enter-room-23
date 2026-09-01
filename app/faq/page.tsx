import Link from 'next/link'
import { SITE_CONFIG } from '@/config/site'
import { FAQ_ITEMS } from '@/lib/customer-copy'

export const metadata = {
  title: 'FAQ - Shipping, Billing & Discretion',
  description:
    'Answers on Room 23 billing, unlabeled packaging, US shipping times, age verification, and returns.',
  alternates: { canonical: '/faq' },
}

export default function FAQPage() {
  return (
    <div className="container-narrow" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
      <div className="mb-10 animate-fade-in-up">
        <p className="last-updated" style={{ marginBottom: '0.25rem' }}>Last Updated: {SITE_CONFIG.lastUpdated}</p>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-4xl)',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: '0.5rem',
        }}>
          Frequently Asked Questions
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-lg)' }}>
          Billing, shipping, returns, and how we handle your order.
        </p>
      </div>

      <hr style={{ marginBottom: '2rem', border: 'none', borderTop: '1px solid var(--border)' }} />

      <div className="space-y-3">
        {FAQ_ITEMS.map((faq, idx) => (
          <details
            key={idx}
            className="surface-card"
            style={{ cursor: 'pointer' }}
          >
            <summary
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-lg)',
                fontWeight: 600,
                color: 'var(--text-primary)',
                listStyle: 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                userSelect: 'none',
              }}
            >
              {faq.q}
              <span
                className="summary-icon"
                style={{
                  fontSize: 'var(--text-xl)',
                  color: 'var(--color-brass)',
                  transition: 'transform 0.2s ease',
                  flexShrink: 0,
                  marginLeft: '1rem',
                }}
              >
                +
              </span>
            </summary>
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: 'var(--text-base)',
                lineHeight: 1.7,
                marginTop: '1rem',
                paddingTop: '0.75rem',
                borderTop: '1px solid var(--border)',
              }}
            >
              {faq.a}
            </p>
          </details>
        ))}
      </div>

      <hr style={{ margin: '2.5rem 0', border: 'none', borderTop: '1px solid var(--border)' }} />

      <div className="surface-card" style={{ textAlign: 'center' }}>
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-xl)',
          fontWeight: 600,
          color: 'var(--text-primary)',
          marginBottom: '0.5rem',
        }}>
          Still have questions?
        </h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Email support@room23.net. We respond within 24 hours on business days.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/contact" className="btn-primary">Contact Us</Link>
          <a href="mailto:support@room23.net" className="btn-secondary">Email Support</a>
        </div>
      </div>
    </div>
  )
}
