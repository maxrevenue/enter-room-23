import Link from 'next/link'
import { SITE_CONFIG } from '@/config/site'

export const metadata = {
  title: 'Frequently Asked Questions',
  description: 'FAQ for Room 23 — Billing, discreet shipping, order tracking, age verification, and more.',
}

const faqs = [
  {
    q: 'What will appear on my credit card statement?',
    a: 'All charges appear discreetly as ROOM23 on your bank or credit card statement. There will never be any reference to specific products, adult content, or wellness \u2014 your billing record remains entirely private.',
  },
  {
    q: 'Is the packaging truly discreet?',
    a: 'Without exception. Every order ships in a plain, unmarked box or padded mailer \u2014 no logos, no branding, no indication of the contents whatsoever. The return address displays a generic business name, never "Room 23." Your privacy is guaranteed from our warehouse to your door.',
  },
  {
    q: 'How long does shipping take?',
    a: 'Standard shipping (USPS Ground / FedEx Ground) arrives in 5\u20138 business days. Expedited (USPS Priority) delivers in 2\u20134 business days. Express (UPS Next Day Air) arrives the very next business day. All orders are processed and dispatched within 1\u20132 business days.',
  },
  {
    q: 'Do you ship internationally?',
    a: 'At this time, we ship exclusively within the United States \u2014 all 50 states, US territories, and APO/FPO military addresses. International shipping is not yet available.',
  },
  {
    q: 'Can I track my order?',
    a: 'Absolutely. The moment your order ships, you will receive an email with your tracking number and a direct link to the carrier\'s tracking portal. Please allow up to 24 hours for tracking information to become active.',
  },
  {
    q: 'Why is there an age verification?',
    a: 'Room 23 exclusively serves adults aged 18 and older. Age verification is a legal requirement for adult wellness commerce and reflects our unwavering commitment to responsible, compliant business practices. We do not knowingly serve minors under any circumstances.',
  },
  {
    q: 'How long does the age verification last?',
    a: 'Your verification persists for the duration of your current browser session. If you close your browser entirely, you will be asked to re-verify upon returning. This session-based approach is intentionally designed to meet strict regulatory compliance standards.',
  },
  {
    q: 'Can I return an item?',
    a: 'Due to the intimate nature of our products, any opened or used item is strictly final sale. Unopened, factory-sealed products may be returned within 14 calendar days of delivery. Please visit our Shipping & Returns page for complete details.',
  },
  {
    q: 'What if I receive a defective item?',
    a: 'Contact us within 48 hours of delivery at support@room23.net with your order number and photos of the issue. We will promptly arrange either a free replacement or a full refund \u2014 no hassle, no questions.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept Visa, Mastercard, American Express, and Discover. Every transaction is processed through PCI-DSS Level 1 compliant payment infrastructure with 256-bit TLS encryption. Room 23 never stores your full credit card number.',
  },
  {
    q: 'Is my payment information secure?',
    a: 'Completely. All transactions are secured with 256-bit TLS encryption and processed through PCI-DSS Level 1 compliant infrastructure \u2014 the highest standard in payment security. We use tokenized payment fields, meaning your full card number never touches our servers.',
  },
  {
    q: 'How do I contact customer support?',
    a: 'Reach us anytime at support@room23.net. Our team responds to every inquiry within 24 hours on business days. You can also visit our Contact page for additional ways to get in touch.',
  },
]

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
