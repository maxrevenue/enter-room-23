import Link from 'next/link'
import { SITE_CONFIG } from '@/config/site'

export const metadata = {
  title: 'FAQ - Shipping, Billing & Discretion',
  description:
    'Answers on Room 23 billing descriptors, unmarked packaging, US shipping times, age verification, and returns for adult wellness orders.',
  alternates: { canonical: '/faq' },
}

const faqs = [
  {
    q: 'What will appear on my credit card statement?',
    a: `Charges appear as ${SITE_CONFIG.billingDescriptor} on your bank statement. No product names or adult descriptors appear on the billing record.`,
  },
  {
    q: 'Is the packaging really discreet?',
    a: 'Absolutely. Every order is shipped in a plain, unbranded box or padded mailer, completely free of external logos, branding, or any indication of the contents. The return address will show a generic entity name, never "Room 23," ensuring total privacy from our warehouse to your doorstep.',
  },
  {
    q: 'How long does shipping take?',
    a: 'Standard shipping (USPS Ground / FedEx Ground) arrives in 5-8 business days. Expedited shipping (USPS Priority) takes 2-4 business days, and Express shipping (UPS Next Day Air) delivers the very next business day. All orders are processed within 1-2 business days.',
  },
  {
    q: 'Do you ship internationally?',
    a: 'At this time, we exclusively ship within the United States, which includes all 50 states, US territories, and APO/FPO addresses. International shipping is currently unavailable.',
  },
  {
    q: 'Can I track my order?',
    a: 'Yes. The moment your order ships, you will receive an email containing your tracking number and a direct link to the carrier\'s tracking portal. Please allow up to 24 hours for the tracking information to activate.',
  },
  {
    q: 'Why do you require age verification, and are you tracking me?',
    a: 'Because we sell premium adult wellness products, we are legally required to ensure all visitors are 18 or older. We respect your privacy implicitly: our age gate does not collect personal data. It simply places a secure, 30-day cookie on your browser so you don’t have to re-verify every time you visit. No tracking, no judgment.',
  },
  {
    q: 'Can I return an item?',
    a: 'Due to the intimate nature of our collection, opened or used items are strictly final sale and cannot be returned. However, unopened, factory-sealed products may be eligible for return within 14 calendar days of delivery.',
  },
  {
    q: 'What if I receive a defective item?',
    a: `If a product arrives damaged or defective, please contact us within 48 hours of delivery at ${SITE_CONFIG.supportEmail}, including your order number and photos of the item. We will swiftly arrange a free replacement or a full refund.`,
  },
  {
    q: 'What payment methods do you accept?',
    a: `We accept Visa, Mastercard, American Express, and Discover. ${SITE_CONFIG.pciCheckoutWording} Room 23 never stores full credit card numbers.`,
  },
  {
    q: 'Is my payment information secure?',
    a: `${SITE_CONFIG.pciCheckoutWording} Card data is entered on ${SITE_CONFIG.paymentProcessor}'s hosted payment page — never on room23.net.`,
  },
  {
    q: 'How do I contact customer support?',
    a: `You can reach us at ${SITE_CONFIG.supportEmail} or ${SITE_CONFIG.supportPhone}. Our team responds to all inquiries within 24 hours during normal business days.`,
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
          <a href={`mailto:${SITE_CONFIG.supportEmail}`} className="btn-secondary">Email Support</a>
        </div>
      </div>
    </div>
  )
}
