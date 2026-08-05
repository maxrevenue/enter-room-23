import Link from 'next/link'

export const metadata = {
  title: 'Frequently Asked Questions',
  description: 'FAQ for Room 23 — Billing, discreet shipping, order tracking, age verification, and more.',
}

const faqs = [
  {
    q: 'What will appear on my credit card statement?',
    a: 'Charges will appear as ROOM23 or a similar discreet descriptor on your bank statement. No mention of products, adult items, or wellness appears anywhere on your billing record.',
  },
  {
    q: 'Is the packaging really discreet?',
    a: 'Absolutely. Every order ships in a plain, unbranded box or padded mailer with absolutely no external logos, branding, or indication of Room 23 or the contents. The return address displays a generic entity name — not "Room 23." This is a core part of our service commitment.',
  },
  {
    q: 'How long does shipping take?',
    a: 'Standard shipping (USPS Ground) takes 5–8 business days. Expedited (USPS Priority) takes 2–4 business days. Express (UPS Next Day Air) delivers the next business day. Orders are processed within 1–2 business days. See our Shipping & Returns page for full details.',
  },
  {
    q: 'Do you ship internationally?',
    a: 'Currently, we ship within the United States only, including all 50 states, APO/FPO addresses, and US territories. International shipping is not available at this time.',
  },
  {
    q: 'Can I track my order?',
    a: 'Yes. Once your order ships, you will receive an email containing your tracking number and a link to the carrier\'s tracking portal. Please allow up to 24 hours for the tracking number to activate.',
  },
  {
    q: 'Why is there an age verification?',
    a: 'Room 23 sells adult wellness products intended only for individuals 18 years or older. Age verification is required by law, by our payment processor (NMI), and by our commitment to responsible commerce. We do not knowingly serve minors.',
  },
  {
    q: 'How long does the age verification last?',
    a: 'Upon confirming your age, a cookie is set for 24 hours. After that, you will be asked to re-verify on your next visit. This re-verification is intentionally designed to satisfy high-risk merchant compliance requirements.',
  },
  {
    q: 'Can I return an item?',
    a: 'Due to the intimate nature of our products, opened or used items are final sale and cannot be returned. Unopened, factory-sealed items may be eligible for return within 14 calendar days of delivery. Please see our Shipping & Returns page for the full policy.',
  },
  {
    q: 'What if I receive a defective item?',
    a: 'If you receive a damaged or defective product, contact us within 48 hours of delivery at support@room23.net with your order number and photos. We will arrange a free replacement or full refund.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept Visa, Mastercard, American Express, and Discover — all processed securely through NMI, a PCI-DSS Level 1 compliant payment gateway. Room 23 never stores full credit card numbers.',
  },
  {
    q: 'Is my payment information secure?',
    a: 'Yes. All transactions are processed through NMI\'s PCI-DSS Level 1 compliant infrastructure with 256-bit TLS encryption. We use tokenized payment fields — your full card number is never stored on our servers.',
  },
  {
    q: 'How do I contact customer support?',
    a: 'Email us at support@room23.net. We respond to all inquiries within 24 hours during business days. Visit our Contact page for additional support options.',
  },
]

export default function FAQPage() {
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
          Frequently Asked Questions
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-lg)' }}>
          Everything you need to know about ordering from Room 23.
        </p>
      </div>

      <hr style={{ marginBottom: '2rem', border: 'none', borderTop: '1px solid var(--border)' }} />

      <div className="space-y-3">
        {faqs.map((faq, idx) => (
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
            {/* CSS to rotate the + icon when open */}
            <style jsx>{`
              details[open] .summary-icon {
                transform: rotate(45deg);
              }
            `}</style>
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
          We&rsquo;re here to help. Reach out and we&rsquo;ll respond within 24 hours.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/contact" className="btn-primary">Contact Us</Link>
          <a href="mailto:support@room23.net" className="btn-secondary">Email Support</a>
        </div>
      </div>
    </div>
  )
}
