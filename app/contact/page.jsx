import Link from 'next/link'
import ContactForm from './contact-form'
import { SITE_CONFIG } from '@/config/site'

export const metadata = {
  title: 'Contact Us',
  description: 'Contact Room 23 customer support — Email, operating hours, and business address.',
}

export default function ContactPage() {
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
          Contact Us
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-lg)' }}>
          We&rsquo;re here to help. Every inquiry is handled with complete discretion.
        </p>
      </div>

      {/* ── Contact Grid ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '2rem',
          marginBottom: '3rem',
        }}
        className="md:grid-cols-2"
      >
        {/* ── Support Form ── */}
        <div className="surface-card animate-fade-in-up">
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-xl)',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: '1.5rem',
          }}>
            Send Us a Message
          </h2>

          <ContactForm />
        </div>

        {/* ── Contact Information ── */}
        <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="surface-card">
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-xl)',
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: '1.5rem',
            }}>
              Contact Information
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Email */}
              <div>
                <h4 className="label" style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                  Email Support
                </h4>
                <a
                  href="mailto:support@room23.net"
                  className="link-brass"
                  style={{ fontSize: 'var(--text-base)' }}
                >
                  support@room23.net
                </a>
              </div>

              {/* Phone */}
              <div>
                <h4 className="label" style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                  Phone
                </h4>
                <p style={{ color: 'var(--text-primary)', fontSize: 'var(--text-base)' }}>
                  {SITE_CONFIG.supportPhone}
                </p>
              </div>

              {/* Hours */}
              <div>
                <h4 className="label" style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                  Operating Hours
                </h4>
                <p style={{ color: 'var(--text-primary)', fontSize: 'var(--text-sm)' }}>
                  {SITE_CONFIG.hours}
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)', marginTop: '0.25rem' }}>
                  Response within 24 hours on business days.
                </p>
              </div>

              {/* Mailing Address */}
              <div>
                <h4 className="label" style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                  Mailing Address
                </h4>
                <p style={{ color: 'var(--text-primary)', fontSize: 'var(--text-sm)' }}>
                  Room 23<br />
                  {SITE_CONFIG.bizStreet}<br />
                  {SITE_CONFIG.bizCityState}<br />
                  United States
                </p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="surface-card">
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-xl)',
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: '1rem',
            }}>
              Quick Links
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Link href="/faq" className="link-brass" style={{ fontSize: 'var(--text-sm)' }}>
                Frequently Asked Questions
              </Link>
              <Link href="/shipping" className="link-brass" style={{ fontSize: 'var(--text-sm)' }}>
                Shipping &amp; Returns
              </Link>
              <Link href="/terms" className="link-brass" style={{ fontSize: 'var(--text-sm)' }}>
                Terms of Service
              </Link>
              <Link href="/privacy" className="link-brass" style={{ fontSize: 'var(--text-sm)' }}>
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
