import Link from 'next/link'
import { SITE_CONFIG } from '@/config/site'

export const metadata = {
  title: 'Shipping & Returns',
  description: 'Discreet packaging, shipping rates, and return policy for Room 23 premium adult wellness products.',
}

export default function ShippingPage() {
  return (
    <div className="container-narrow legal-content animate-fade-in-up">
      <div className="mb-10">
        <p className="last-updated">Last Updated: {SITE_CONFIG.lastUpdated}</p>
        <h1>Shipping &amp; Returns</h1>
        <p>
          We take <strong>discretion seriously</strong>. Every order is handled with the privacy you expect.
        </p>
      </div>
      <hr />

      <h2>1. Discreet Packaging Guarantee</h2>
      <p>
        Every order ships in a <strong>plain, unbranded box or padded mailer</strong> with no external
        indication of Room 23 or contents. The return address label displays a generic entity name —{' '}
        <strong>not</strong> &ldquo;Room 23.&rdquo; No logos, branding, or product descriptions appear
        externally. Card statements show <strong>ROOM23</strong> only.
      </p>

      <h2>2. Processing Times</h2>
      <ul>
        <li><strong>Standard Orders:</strong> Processed within 1–2 business days of payment confirmation.</li>
        <li><strong>Weekends/Holidays:</strong> Orders placed after 2:00 PM ET Friday process the following Monday.</li>
      </ul>
      <p>
        You will receive a <strong>confirmation email</strong> immediately after purchase and a{' '}
        <strong>shipping confirmation</strong> with tracking once dispatched.
      </p>

      <h2>3. Shipping Methods &amp; Rates</h2>
      <p>We ship within the <strong>United States</strong> (all 50 states, APO/FPO, US territories).</p>
      <div className="surface-card" style={{ margin: '1.5rem 0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <th style={{ textAlign: 'left', padding: '0.75rem 0.5rem', color: 'var(--text-primary)', fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Method</th>
              <th style={{ textAlign: 'left', padding: '0.75rem 0.5rem', color: 'var(--text-primary)', fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Delivery</th>
              <th style={{ textAlign: 'left', padding: '0.75rem 0.5rem', color: 'var(--text-primary)', fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Rate</th>
            </tr>
          </thead>
          <tbody style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
            <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding: '0.75rem 0.5rem' }}>Standard (USPS Ground)</td><td style={{ padding: '0.75rem 0.5rem' }}>5–8 business days</td><td style={{ padding: '0.75rem 0.5rem' }}>$5.99 USD</td></tr>
            <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding: '0.75rem 0.5rem' }}>Expedited (USPS Priority)</td><td style={{ padding: '0.75rem 0.5rem' }}>2–4 business days</td><td style={{ padding: '0.75rem 0.5rem' }}>$12.99 USD</td></tr>
            <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding: '0.75rem 0.5rem' }}>Express (FedEx 2Day)</td><td style={{ padding: '0.75rem 0.5rem' }}>2 business days</td><td style={{ padding: '0.75rem 0.5rem' }}>$24.99 USD</td></tr>
            <tr><td style={{ padding: '0.75rem 0.5rem' }}>Express (UPS Next Day Air)</td><td style={{ padding: '0.75rem 0.5rem' }}>Next business day</td><td style={{ padding: '0.75rem 0.5rem' }}>$29.99 USD</td></tr>
          </tbody>
        </table>
      </div>
      <ul><li>Free standard shipping on orders over <strong>${SITE_CONFIG.freeShippingThreshold.toFixed(2)} USD</strong></li></ul>

      <h2>4. Returns Policy</h2>
      <h3>4.1 Final Sale Items (Non-Returnable)</h3>
      <div className="surface-card-accent" style={{ margin: '1.5rem 0' }}>
        <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--accent)', marginBottom: '0.75rem' }}>FINAL SALE ITEMS</h4>
        <ul style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
          <li>Any product that has been opened, used, or whose seal has been broken</li>
          <li>Lubricants, oils, massage products, and all liquid/gel items (once seal is broken)</li>
          <li>Intimate wear and apparel (once removed from packaging)</li>
          <li>Clearance or &ldquo;Final Sale&rdquo; marked items</li>
        </ul>
      </div>

      <h3>4.2 Eligible Returns</h3>
      <p>Items may be returned only if <strong>all</strong> conditions are met:</p>
      <ul>
        <li>Unopened, factory-sealed packaging intact</li>
        <li>Return requested within <strong>14 calendar days</strong> of delivery</li>
        <li>Proof of purchase provided</li>
      </ul>

      <h3>4.3 Return Process</h3>
      <ol>
        <li>Email <a href="mailto:support@room23.net">support@room23.net</a> with order number and items to return.</li>
        <li>Receive RMA authorization within 1–2 business days.</li>
        <li>Ship back in discreet packaging (customer pays return shipping unless our error).</li>
        <li>Refund issued to original payment method within 5–10 business days after inspection.</li>
      </ol>

      <h2>5. Damaged or Defective Items</h2>
      <p>
        Contact us within <strong>48 hours</strong> of delivery at{' '}
        <a href="mailto:support@room23.net">support@room23.net</a> with order number and photos.
        We will arrange a replacement or full refund at no cost.
      </p>

      <h2>6. Lost or Stolen Packages</h2>
      <p>
        Room 23 is not responsible for packages marked &ldquo;Delivered&rdquo; that are stolen. We
        recommend shipping to a secure address. Missing deliveries must be reported within{' '}
        <strong>7 days</strong>.
      </p>

      <hr />
      <p>Questions? Visit our <Link href="/faq" className="link-brass">FAQ</Link> or <Link href="/contact" className="link-brass">Contact Us</Link>.</p>
      <p className="text-muted" style={{ fontSize: 'var(--text-sm)' }}>
        &copy; {new Date().getFullYear()} Room 23. All rights reserved.
      </p>
    </div>
  )
}
