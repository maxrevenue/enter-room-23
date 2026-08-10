import Link from 'next/link'
import { SITE_CONFIG } from '@/config/site'

export const metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Room 23 — How we collect, use, and protect your personal data. GDPR and CCPA compliant.',
}

export default function PrivacyPage() {
  return (
    <div className="container-narrow legal-content animate-fade-in-up">
      <div className="mb-10">
        <p className="last-updated">Last Updated: {SITE_CONFIG.lastUpdated}</p>
        <h1>Privacy Policy</h1>
        <p>
          At <strong>Room 23</strong>, your privacy is foundational to our business. We handle
          sensitive personal data with the discretion and care you expect from a premium wellness
          retailer. This Privacy Policy explains what information we collect, how we use it, and your
          rights regarding that information.
        </p>
      </div>

      <hr />

      {/* ── Section 1 ── */}
      <h2>1. Information We Collect</h2>

      <h3>1.1 Information You Provide Directly</h3>
      <p>When you make a purchase, create an account, or contact us, we may collect:</p>
      <ul>
        <li><strong>Identity &amp; Contact Data:</strong> Full name, email address, shipping address, billing address, and phone number.</li>
        <li><strong>Payment Data:</strong> Credit/debit card information, billing ZIP code, and cardholder name. <strong>Note:</strong> Full card numbers are tokenized and processed exclusively by our PCI-DSS Level 1 compliant payment gateway. Room 23 never stores complete card numbers on its servers.</li>
        <li><strong>Account Credentials:</strong> Email and hashed password if you create an account.</li>
        <li><strong>Communication Data:</strong> Messages, inquiries, and feedback sent to our support team.</li>
      </ul>

      <h3>1.2 Information Collected Automatically</h3>
      <p>When you browse the Site, we may automatically collect:</p>
      <ul>
        <li><strong>Technical Data:</strong> IP address, browser type and version, device type, operating system, and screen resolution.</li>
        <li><strong>Usage Data:</strong> Pages visited, time spent on pages, products viewed, referral source, and interaction patterns.</li>
        <li><strong>Cookie Data:</strong> Session identifiers, age verification status, cart contents, and theme preferences.</li>
      </ul>

      <h3>1.3 Age Verification Data</h3>
      <p>
        We set a session <strong>age_verified</strong> cookie upon entry confirmation. This cookie
        contains no personal information — it simply indicates that you affirmed being 18+. It is a
        session cookie that expires when you close your browser and is used solely to re-verify
        age compliance on return visits.
      </p>

      {/* ── Section 2 ── */}
      <h2>2. How We Use Your Information</h2>
      <p>We use collected information for the following purposes:</p>
      <ul>
        <li><strong>Order Fulfillment:</strong> Processing payments, shipping products, sending order confirmations and tracking updates, and handling returns.</li>
        <li><strong>Customer Support:</strong> Responding to inquiries, resolving disputes, and providing assistance.</li>
        <li><strong>Legal Compliance:</strong> Age verification, fraud prevention, tax reporting, and responding to lawful requests from authorities.</li>
        <li><strong>Site Improvement:</strong> Analyzing aggregate usage patterns to improve product offerings and user experience.</li>
        <li><strong>Marketing (with consent):</strong> Sending promotional emails if you opt in. You may unsubscribe at any time.</li>
      </ul>

      {/* ── Section 3 ── */}
      <h2>3. Discreet Handling Commitment</h2>
      <p>
        <strong>We understand the sensitive nature of your purchases.</strong> We take the following
        measures to protect your privacy:
      </p>
      <ul>
        <li>All shipments use <strong>plain, unbranded packaging</strong> with no indication of contents or Room 23 branding externally.</li>
        <li>The return address label shows a generic entity name — not &ldquo;Room 23.&rdquo;</li>
        <li>Card statements show a discreet billing descriptor (typically <strong>ROOM23</strong>).</li>
        <li>We do not send unsolicited physical mail or catalogs to your shipping address.</li>
        <li>Your email address is never sold, rented, or shared with third parties for their marketing purposes.</li>
      </ul>

      {/* ── Section 4 ── */}
      <h2>4. Third-Party Sharing &amp; Processors</h2>
      <p>We share information only as strictly necessary to operate the Site and fulfill orders:</p>

      <h3>4.1 Payment Processing</h3>
      <p>
        Payment transactions are processed through a
        PCI-DSS Level 1 compliant payment gateway utilizing 256-bit TLS encryption. Cardholder data is received directly through
        tokenized fields; Room 23 does not have access to complete card numbers. Our payment processor&rsquo;s privacy policy
        governs their handling of your payment data.
      </p>

      <h3>4.2 Shipping Carriers</h3>
      <p>
        We share your name, shipping address, and (optionally) phone number with carriers (USPS, UPS,
        FedEx) solely to deliver your order. Tracking information is provided to you via email.
      </p>

      <h3>4.3 Hosting &amp; Infrastructure</h3>
      <p>
        Our Site is hosted on <strong>Cloudflare Workers / Pages</strong>. Cloudflare processes
        technical data (IP addresses, request logs) per their privacy policy for security and
        performance purposes.
      </p>

      <h3>4.4 Legal Disclosures</h3>
      <p>
        We may disclose information if required by law, subpoena, or court order, or if we believe in
        good faith that disclosure is necessary to protect our rights, your safety, or the safety of
        others.
      </p>
      <p>
        <strong>We do not sell, rent, or trade your personal information to any third party</strong> for
        their advertising, data brokering, or marketing purposes.
      </p>

      {/* ── Section 5 ── */}
      <h2>5. Cookies &amp; Tracking Technologies</h2>
      <p>We use the following categories of cookies:</p>
      <ul>
        <li><strong>Essential Cookies:</strong> Age verification status, cart contents, and session management. These are required for Site functionality and cannot be disabled.</li>
        <li><strong>Preference Cookies:</strong> UI preference persistence. Purely functional.</li>
        <li><strong>Analytics Cookies:</strong> Anonymous usage statistics (pages viewed, referral sources). No personal identifiers are included.</li>
      </ul>
      <p>
        You may configure your browser to reject cookies; however, the Site may not function properly
        without essential cookies.
      </p>

      {/* ── Section 6 ── */}
      <h2>6. Data Retention</h2>
      <p>
        We retain personal data only as long as necessary to fulfill the purposes outlined in this
        policy:
      </p>
      <ul>
        <li><strong>Order data:</strong> Retained for tax and accounting purposes (typically 7 years per IRS requirements).</li>
        <li><strong>Account data:</strong> Retained until you request deletion or your account is inactive for 24 months.</li>
        <li><strong>Age verification cookie:</strong> Session cookie (expires when browser is closed).</li>
        <li><strong>Analytics data:</strong> Aggregated and anonymized; raw logs purged after 30 days.</li>
      </ul>

      {/* ── Section 7 ── */}
      <h2>7. Your Rights (GDPR &amp; CCPA)</h2>
      <p>
        Depending on your jurisdiction, you may have the following rights regarding your personal data:
      </p>

      <h3>7.1 GDPR (EU/EEA Residents)</h3>
      <ul>
        <li><strong>Right of Access:</strong> Request a copy of your personal data.</li>
        <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete data.</li>
        <li><strong>Right to Erasure:</strong> Request deletion of your data (&ldquo;right to be forgotten&rdquo;).</li>
        <li><strong>Right to Restriction:</strong> Request limited processing of your data.</li>
        <li><strong>Right to Data Portability:</strong> Receive your data in a structured, machine-readable format.</li>
        <li><strong>Right to Object:</strong> Object to processing based on legitimate interests.</li>
      </ul>

      <h3>7.2 CCPA (California Residents)</h3>
      <ul>
        <li><strong>Right to Know:</strong> Request disclosure of categories and specific pieces of personal information collected.</li>
        <li><strong>Right to Delete:</strong> Request deletion of personal information (subject to exceptions).</li>
        <li><strong>Right to Opt-Out:</strong> We do not sell personal information, so this right is inherently respected.</li>
        <li><strong>Right to Non-Discrimination:</strong> We will not discriminate against you for exercising any CCPA rights.</li>
      </ul>

      <p>
        To exercise any of these rights, email us at{' '}
        <a href="mailto:privacy@room23.net">privacy@room23.net</a> with the subject line
        &ldquo;Data Rights Request.&rdquo; We will respond within 30 days (GDPR) or 45 days (CCPA), as
        applicable.
      </p>

      {/* ── Section 8 ── */}
      <h2>8. Data Security</h2>
      <p>
        We implement industry-standard security measures to protect your data:
      </p>
      <ul>
        <li><strong>Encryption:</strong> All data transmitted between your browser and our servers is encrypted via TLS 1.3 (256-bit SSL).</li>
        <li><strong>PCI Compliance:</strong> Payment data is handled exclusively through PCI-DSS Level 1 compliant infrastructure with 256-bit TLS encryption.</li>
        <li><strong>Access Controls:</strong> Personal data access is restricted to authorized personnel on a need-to-know basis.</li>
        <li><strong>Security Headers:</strong> Strict Content Security Policy, HSTS, X-Frame-Options, and other defensive headers are enforced.</li>
      </ul>
      <p>
        No method of electronic storage or transmission is 100% secure. While we strive to protect your
        data, we cannot guarantee absolute security.
      </p>

      {/* ── Section 9 ── */}
      <h2>9. Children&rsquo;s Privacy</h2>
      <p>
        <strong>Room 23 is an adults-only website.</strong> We do not knowingly collect or solicit
        personal information from anyone under the age of 18. If we learn that we have collected
        personal data from an individual under 18, we will delete it immediately. If you believe a
        minor has provided us with information, please contact us at{' '}
        <a href="mailto:privacy@room23.net">privacy@room23.net</a>.
      </p>

      {/* ── Section 10 ── */}
      <h2>10. International Data Transfers</h2>
      <p>
        Room 23 is based in the United States. If you access the Site from outside the US, your data
        will be transferred to, stored, and processed in the United States. By using the Site, you
        consent to such transfer and processing in accordance with this Privacy Policy.
      </p>

      {/* ── Section 11 ── */}
      <h2>11. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy periodically. Material changes will be communicated by
        posting the updated policy on this page and updating the &ldquo;Last Updated&rdquo; date. We
        encourage you to review this policy regularly.
      </p>

      {/* ── Section 12 ── */}
      <h2>12. Contact Information</h2>
      <p>For privacy-related inquiries or to exercise your data rights:</p>
      <ul>
        <li>Email: <a href="mailto:privacy@room23.net">privacy@room23.net</a></li>
        <li>General Support: <a href="mailto:support@room23.net">support@room23.net</a></li>
        <li>Mail: Room 23, {SITE_CONFIG.bizAddressFull}, USA</li>
      </ul>
      <p>
        Visit our <Link href="/contact" className="link-brass">Contact Page</Link> for additional
        information.
      </p>

      <hr />

      <p className="text-muted" style={{ fontSize: 'var(--text-sm)' }}>
        &copy; {new Date().getFullYear()} Room 23. All rights reserved.
      </p>
    </div>
  )
}
