import Link from 'next/link'

export const metadata = {
  title: 'Contact Us',
  description: 'Contact Room 23 customer support — Email, operating hours, and business address.',
}

export default function ContactPage() {
  return (
    <div className="container-narrow" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
      <div className="mb-10 animate-fade-in-up">
        <p className="last-updated" style={{ marginBottom: '0.25rem' }}>Last Updated: August 5, 2026</p>
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

          <form
            onSubmit={(e) => {
              e.preventDefault()
              // Form submission will be wired to backend email service
              alert('Thank you for your message. We will respond within 24 hours. For immediate assistance, email support@room23.net.')
            }}
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

            <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)', textAlign: 'center' }}>
              Your message is handled with complete discretion and never shared.
            </p>
          </form>
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
                  [Phone Number]
                </p>
              </div>

              {/* Hours */}
              <div>
                <h4 className="label" style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                  Operating Hours
                </h4>
                <p style={{ color: 'var(--text-primary)', fontSize: 'var(--text-sm)' }}>
                  Monday – Friday: 9:00 AM – 6:00 PM ET<br />
                  Saturday: 10:00 AM – 4:00 PM ET<br />
                  Sunday: Closed
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
                  [Business Street Address]<br />
                  [City, State ZIP]<br />
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
