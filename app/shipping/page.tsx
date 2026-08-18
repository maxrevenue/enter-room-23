import Image from 'next/image'
import Link from 'next/link'
import { SITE_CONFIG } from '@/config/site'
import { SHIPPING_METHODS, FREE_SHIPPING_THRESHOLD } from '@/lib/shipping'

export const metadata = {
  title: 'Shipping & Returns - Discreet US Delivery',
  description:
    'Room 23 ships unmarked US parcels with tracking. See rates, free-shipping threshold, packing policy, and the 14-day unopened return window.',
  alternates: { canonical: '/shipping' },
}

export default function ShippingPage() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4 md:px-8">
      <h1 className="text-3xl font-serif text-theme-text mb-8">Shipping & Returns</h1>

      <p className="text-theme-text/80 mb-12 leading-relaxed">
        {SITE_CONFIG.legalName} ships physical wellness goods within the United States. Orders are
        processed in 1–2 business days and leave with tracking. Privacy is a customer-experience
        policy: unmarked cartons, a generic return address, and a packing slip without explicit SKU names.
      </p>

      <div className="grid md:grid-cols-2 gap-8 items-center bg-theme-surface border border-theme-border p-6 md:p-8 mb-12">
        <div className="overflow-hidden border border-theme-border">
          <Image
            src="/images/shipping/discreet-mailer-01.jpg"
            alt="Plain unmarked carton with a generic shipping label"
            width={800}
            height={512}
            unoptimized
            className="h-64 w-full object-cover"
          />
        </div>

        <div>
          <h2 className="text-xl font-serif text-theme-text mb-4">Exactly how it arrives</h2>
          <ul className="text-theme-muted text-sm space-y-3 list-none p-0">
            <li>Plain, unmarked brown or white outer packaging.</li>
            <li>No exterior branding, logos, or product names on the carton.</li>
            <li>Generic return address — not “Room 23.”</li>
            <li>Packing slip lists generic item names, not explicit SKU titles.</li>
            <li>Card statement shows {SITE_CONFIG.billingDescriptor}.</li>
          </ul>
        </div>
      </div>

      <div className="legal-content text-theme-text/80">
        <p className="text-theme-muted text-xs uppercase tracking-widest mb-8">Last Updated: {SITE_CONFIG.lastUpdated}</p>

        <h2 className="text-xl font-serif text-theme-text mt-10 mb-4">Discretion details</h2>
        <p className="text-theme-muted text-sm leading-relaxed mb-4">
          Unbranded carton. Generic return address. Packing slip without explicit SKU names.
          We do not print product photography on the exterior. If you use Apple Pay or a wallet
          notification, your lock screen may still show the merchant name {SITE_CONFIG.billingDescriptor}
          or “Room 23” depending on your device — that is a wallet behavior we cannot fully suppress.
        </p>

        <h2 className="text-xl font-serif text-theme-text mt-10 mb-4">Processing times</h2>
        <ul className="text-theme-muted text-sm space-y-2 mb-6">
          <li><strong className="text-theme-text/90">Standard orders:</strong> Processed within 1–2 business days of payment confirmation, then shipped with tracking (within 3 business days of payment at the latest).</li>
          <li><strong className="text-theme-text/90">Weekends/holidays:</strong> Orders placed after 2:00 PM ET Friday process the following Monday.</li>
        </ul>

        <h2 className="text-xl font-serif text-theme-text mt-10 mb-4">Shipping methods &amp; rates</h2>
        <p className="text-theme-muted text-sm mb-4">We ship within the United States (all 50 states, APO/FPO, US territories). We do not ship internationally.</p>
        <div className="overflow-x-auto border border-theme-border bg-theme-surface mb-6">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-theme-border">
                <th className="text-left p-3 text-xs uppercase tracking-widest text-theme-muted font-medium">Method</th>
                <th className="text-left p-3 text-xs uppercase tracking-widest text-theme-muted font-medium">Delivery</th>
                <th className="text-left p-3 text-xs uppercase tracking-widest text-theme-muted font-medium">Rate</th>
              </tr>
            </thead>
            <tbody className="text-theme-text/80">
              {SHIPPING_METHODS.map((method) => (
                <tr key={method.id} className="border-b border-theme-border last:border-0">
                  <td className="p-3">{method.name}</td>
                  <td className="p-3">{method.delivery}</td>
                  <td className="p-3">${method.rate.toFixed(2)} USD</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-theme-muted text-sm mb-8">
          Free standard shipping on orders over <strong className="text-theme-text">${FREE_SHIPPING_THRESHOLD.toFixed(2)} USD</strong>.
          Expedited and express rates still apply above that threshold.
        </p>

        <h2 className="text-xl font-serif text-theme-text mt-10 mb-4">Returns policy</h2>
        <h3 className="text-lg text-theme-text mb-3">Final sale (non-returnable)</h3>
        <ul className="text-theme-muted text-sm space-y-2 mb-6">
          <li>Any product that has been opened, used, or whose seal has been broken</li>
          <li>Lubricants, oils, massage products, and all liquid/gel items (once seal is broken)</li>
          <li>Intimate wear and apparel (once removed from packaging)</li>
          <li>Clearance or “Final Sale” marked items</li>
        </ul>

        <h3 className="text-lg text-theme-text mb-3">Eligible returns</h3>
        <ul className="text-theme-muted text-sm space-y-2 mb-6">
          <li>Unopened, factory-sealed packaging intact</li>
          <li>Return requested within 14 calendar days of delivery</li>
          <li>Proof of purchase provided</li>
        </ul>

        <h3 className="text-lg text-theme-text mb-3">How to return</h3>
        <ol className="text-theme-muted text-sm space-y-2 mb-8 list-decimal pl-5">
          <li>Email <a href={`mailto:${SITE_CONFIG.supportEmail}`} className="text-theme-accent hover:opacity-80">{SITE_CONFIG.supportEmail}</a> with your order number and the items to return.</li>
          <li>Receive RMA authorization within 1–2 business days.</li>
          <li>Ship back in discreet packaging. You pay return shipping unless we shipped the wrong item or the item arrived damaged or defective.</li>
          <li>Refund issued to the original payment method within 5–10 business days after inspection.</li>
        </ol>

        <h2 className="text-xl font-serif text-theme-text mt-10 mb-4">Damaged or defective items</h2>
        <p className="text-theme-muted text-sm leading-relaxed mb-8">
          Contact us within 48 hours of delivery at{' '}
          <a href={`mailto:${SITE_CONFIG.supportEmail}`} className="text-theme-accent hover:opacity-80">{SITE_CONFIG.supportEmail}</a> with
          your order number and photos. We will arrange a replacement or full refund at no cost.
        </p>

        <h2 className="text-xl font-serif text-theme-text mt-10 mb-4">Lost or stolen packages</h2>
        <p className="text-theme-muted text-sm leading-relaxed mb-10">
          {SITE_CONFIG.legalName} is not responsible for packages marked “Delivered” that are stolen.
          Ship to a secure address. Report missing deliveries within 7 days.
        </p>

        <p className="text-theme-muted text-sm">
          Questions? Visit our <Link href="/faq" className="text-theme-accent hover:opacity-80">FAQ</Link> or <Link href="/contact" className="text-theme-accent hover:opacity-80">Contact Us</Link>.
        </p>
      </div>
    </div>
  )
}
