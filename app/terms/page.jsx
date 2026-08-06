import Link from 'next/link'
import { BUSINESS_ADDRESS_FULL, LEGAL_LAST_UPDATED } from '@/lib/contact-info'

export const metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for Room 23 — Age restrictions, account responsibilities, and legal agreements.',
}

export default function TermsPage() {
  return (
    <div className="container-narrow legal-content animate-fade-in-up">
      {/* ── Header ── */}
      <div className="mb-10">
        <p className="last-updated">Last Updated: {LEGAL_LAST_UPDATED}</p>
        <h1>Terms of Service</h1>
        <p>
          Welcome to <strong>Room 23</strong> (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;). By accessing
          or using <strong>room23.net</strong> (the &ldquo;Site&rdquo;), you agree to be bound by these Terms of Service
          (&ldquo;Terms&rdquo;). If you do not agree, you must immediately discontinue use of the Site.
        </p>
      </div>

      <hr />

      {/* ── Section 1 ── */}
      <h2>1. Age Restriction &amp; Eligibility</h2>
      <p>
        <strong>You must be at least 18 years of age</strong> (or the legal age of majority in your
        jurisdiction, whichever is higher) to access, browse, or make a purchase on this Site. By
        entering Room 23, you affirm under penalty of perjury that you meet this age requirement.
      </p>
      <p>
        We reserve the right to request age verification at any time and to refuse service to anyone
        who cannot verify their age. Any attempt to circumvent the age gate or provide false age
        information constitutes a violation of these Terms and may result in legal action.
      </p>

      {/* ── Section 2 ── */}
      <h2>2. Account Responsibilities</h2>
      <p>
        To place an order, you may be required to provide accurate, current, and complete information,
        including your legal name, billing address, shipping address, email address, and payment
        details. You are solely responsible for maintaining the confidentiality of any account
        credentials and for all activity under your account.
      </p>
      <p>
        You agree to notify us immediately of any unauthorized use of your account at{' '}
        <a href="mailto:support@room23.net">support@room23.net</a>.
      </p>

      {/* ── Section 3 ── */}
      <h2>3. Products &amp; Descriptions</h2>
      <p>
        Room 23 offers premium adult wellness and intimacy products. We make every effort to display
        product colors, materials, and specifications accurately. However, we cannot guarantee that
        your device&rsquo;s display will render colors accurately.
      </p>
      <p>
        All product descriptions, images, and pricing are subject to change without notice. We reserve
        the right to discontinue any product at any time.
      </p>

      {/* ── Section 4 ── */}
      <h2>4. Pricing &amp; Payment</h2>
      <p>
        All prices are listed in <strong>United States Dollars (USD)</strong> and are exclusive of
        applicable taxes and shipping charges, which will be calculated and displayed at checkout.
      </p>
      <p>
        <strong>Billing Descriptor:</strong> Charges on your credit or debit card statement will appear
        as <strong>ROOM23</strong> or a similar discreet descriptor. By placing an order, you authorize
        us (or our designated payment processor) to charge your selected payment method for the total
        amount, including shipping and any applicable taxes.
      </p>
      <p>
        We utilize a PCI-compliant third-party payment gateway for all transactions. Room 23 does not
        store full credit card numbers on our servers.
      </p>

      {/* ── Section 5 ── */}
      <h2>5. Shipping &amp; Delivery</h2>
      <p>
        All orders are shipped in <strong>plain, discreet packaging</strong> with no external
        indication of contents. The return address will show a generic business name and address.
        Shipping times and rates are detailed in our{' '}
        <Link href="/shipping" className="link-brass">Shipping &amp; Returns Policy</Link>.
      </p>
      <p>
        Risk of loss and title for purchased items pass to you upon our delivery to the carrier. We are
        not responsible for delays caused by the carrier or customs processing.
      </p>

      {/* ── Section 6 ── */}
      <h2>6. Returns &amp; Refunds</h2>
      <p>
        Due to the intimate nature of our products, <strong>certain items are final sale</strong> and
        cannot be returned for health and hygiene reasons. Unopened and unused items in original
        packaging may be eligible for return within 14 days of delivery. Please refer to our{' '}
        <Link href="/shipping" className="link-brass">Shipping &amp; Returns Policy</Link> for full details.
      </p>

      {/* ── Section 7 ── */}
      <h2>7. Intellectual Property</h2>
      <p>
        All content on this Site — including but not limited to text, graphics, logos, images, product
        descriptions, and the &ldquo;Room 23&rdquo; brand identity — is the exclusive property of Room
        23 and is protected by United States and international copyright, trademark, and intellectual
        property laws.
      </p>
      <p>
        You may not reproduce, distribute, modify, or create derivative works from any Site content
        without our prior written consent.
      </p>

      {/* ── Section 8 ── */}
      <h2>8. Limitation of Liability</h2>
      <p>
        <strong>To the fullest extent permitted by law:</strong> Room 23 and its officers, directors,
        employees, and affiliates shall not be liable for any indirect, incidental, special,
        consequential, or punitive damages — including but not limited to loss of profits, data, use,
        or goodwill — arising from your use of the Site, any products purchased, or any violation of
        these Terms.
      </p>
      <p>
        Our total liability for any claim arising from your use of the Site or purchase of products
        shall not exceed the amount you paid for the specific product(s) giving rise to the claim.
      </p>

      {/* ── Section 9 ── */}
      <h2>9. Indemnification</h2>
      <p>
        You agree to indemnify, defend, and hold harmless Room 23 and its affiliates from any claims,
        damages, liabilities, costs, or expenses (including reasonable attorneys&rsquo; fees) arising
        from (a) your violation of these Terms, (b) your use of the Site, or (c) your violation of any
        rights of a third party.
      </p>

      {/* ── Section 10 ── */}
      <h2>10. Governing Law &amp; Dispute Resolution</h2>
      <p>
        These Terms shall be governed by and construed in accordance with the laws of the <strong>
        State of Delaware</strong>, without regard to its conflict of law provisions.
      </p>
      <p>
        Any dispute arising from these Terms or your use of the Site shall be resolved through binding
        individual arbitration in accordance with the rules of the American Arbitration Association,
        rather than in court. You waive any right to participate in a class-action lawsuit or
        class-wide arbitration.
      </p>

      {/* ── Section 11 ── */}
      <h2>11. Termination</h2>
      <p>
        We reserve the right to terminate or suspend your access to the Site, without prior notice or
        liability, for any reason, including without limitation a breach of these Terms.
      </p>

      {/* ── Section 12 ── */}
      <h2>12. Changes to These Terms</h2>
      <p>
        We may update these Terms from time to time. Material changes will be communicated by posting
        the updated Terms on this page and updating the &ldquo;Last Updated&rdquo; date. Your continued
        use of the Site after any changes constitutes your acceptance of the revised Terms.
      </p>

      {/* ── Section 13 ── */}
      <h2>13. Contact</h2>
      <p>
        For questions about these Terms, please contact us at:
      </p>
      <ul>
        <li>Email: <a href="mailto:support@room23.net">support@room23.net</a></li>
        <li>Mail: Room 23, {BUSINESS_ADDRESS_FULL}, USA</li>
      </ul>
      <p>
        You may also visit our <Link href="/contact" className="link-brass">Contact Page</Link> for
        additional support options.
      </p>

      <hr />

      <p className="text-muted" style={{ fontSize: 'var(--text-sm)' }}>
        &copy; {new Date().getFullYear()} Room 23. All rights reserved.
      </p>
    </div>
  )
}
