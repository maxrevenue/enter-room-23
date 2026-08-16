import Link from 'next/link'
import { SITE_CONFIG } from '@/config/site'

export const metadata = {
  title: 'Shipping & Returns',
  description:
    'Shipping rates, private delivery details, and return policy for Room 23 adult wellness products.',
}

export default function ShippingPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-8">
      <h1 className="mb-8 font-serif text-3xl text-white">Shipping &amp; Returns</h1>

      <p className="mb-12 leading-relaxed text-zinc-300">
        Orders ship within the United States. Packaging stays unbranded. Processing typically completes
        within 1–2 business days of payment confirmation, with tracking provided at dispatch.
      </p>

      <div className="mb-12 grid items-center gap-8 border border-zinc-800 bg-zinc-900 p-6 md:grid-cols-2 md:p-8">
        <div className="overflow-hidden border border-zinc-800 bg-zinc-950">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/products/packaging-plain.svg"
            alt="Plain unmarked shipping carton with no outer branding"
            className="h-64 w-full object-cover"
          />
        </div>

        <div>
          <h2 className="mb-4 font-serif text-xl text-white">Private delivery</h2>
          <ul className="list-none space-y-3 p-0 text-sm text-zinc-400">
            <li className="flex items-start gap-2">
              <span className="mt-1 text-zinc-500">•</span>
              <span>Unbranded outer carton — no Room 23 logo on the box.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-zinc-500">•</span>
              <span>Generic return address; no product names on the exterior.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-zinc-500">•</span>
              <span>Packing slips omit explicit SKU names.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-zinc-500">•</span>
              <span>
                Statement descriptor: <span className="font-mono text-zinc-200">{SITE_CONFIG.billingDescriptor}</span>.
                Mobile wallets may still surface the merchant name on a lock screen — that is controlled by the wallet, not the carton.
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="legal-content text-zinc-300">
        <p className="mb-8 text-xs uppercase tracking-widest text-zinc-500">
          Last Updated: {SITE_CONFIG.lastUpdated}
        </p>

        <h2 className="mb-4 mt-10 font-serif text-xl text-white">Processing Times</h2>
        <ul className="mb-6 space-y-2 text-sm text-zinc-400">
          <li>
            <strong className="text-zinc-200">Standard Orders:</strong> Processed within 1–2 business
            days of payment confirmation (within 3 business days at latest).
          </li>
          <li>
            <strong className="text-zinc-200">Weekends/Holidays:</strong> Orders placed after 2:00 PM ET
            Friday process the following Monday.
          </li>
        </ul>
        <p className="mb-8 text-sm leading-relaxed text-zinc-400">
          You will receive a confirmation email after purchase and a shipping confirmation with tracking
          once dispatched.
        </p>

        <h2 className="mb-4 mt-10 font-serif text-xl text-white">Shipping Methods &amp; Rates</h2>
        <p className="mb-4 text-sm text-zinc-400">
          We ship within the United States (all 50 states, APO/FPO, US territories). Checkout applies
          standard shipping at <strong className="text-white">${SITE_CONFIG.flatShippingRate.toFixed(2)}</strong>{' '}
          unless free shipping is unlocked.
        </p>
        <div className="mb-6 overflow-x-auto border border-zinc-800 bg-zinc-900">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="p-3 text-left text-xs font-medium uppercase tracking-widest text-zinc-400">
                  Method
                </th>
                <th className="p-3 text-left text-xs font-medium uppercase tracking-widest text-zinc-400">
                  Delivery
                </th>
                <th className="p-3 text-left text-xs font-medium uppercase tracking-widest text-zinc-400">
                  Rate
                </th>
              </tr>
            </thead>
            <tbody className="text-zinc-300">
              <tr className="border-b border-zinc-800">
                <td className="p-3">Standard (USPS Ground)</td>
                <td className="p-3">5–8 business days</td>
                <td className="p-3">${SITE_CONFIG.flatShippingRate.toFixed(2)} USD</td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="p-3">Expedited (USPS Priority)</td>
                <td className="p-3">2–4 business days</td>
                <td className="p-3">$12.99 USD</td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="p-3">Express (FedEx 2Day)</td>
                <td className="p-3">2 business days</td>
                <td className="p-3">$24.99 USD</td>
              </tr>
              <tr>
                <td className="p-3">Express (UPS Next Day Air)</td>
                <td className="p-3">Next business day</td>
                <td className="p-3">$29.99 USD</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mb-8 text-sm text-zinc-400">
          Free standard shipping on orders over{' '}
          <strong className="text-white">${SITE_CONFIG.freeShippingThreshold.toFixed(2)} USD</strong>.
          Expedited options may be offered at checkout when available; otherwise standard shipping is applied.
        </p>

        <h2 className="mb-4 mt-10 font-serif text-xl text-white">Returns Policy</h2>
        <h3 className="mb-3 text-lg text-white">Final Sale Items (Non-Returnable)</h3>
        <ul className="mb-6 space-y-2 text-sm text-zinc-400">
          <li>Any product that has been opened, used, or whose seal has been broken</li>
          <li>Lubricants, oils, massage products, and all liquid/gel items (once seal is broken)</li>
          <li>Intimate wear and apparel (once removed from packaging)</li>
          <li>Clearance or &ldquo;Final Sale&rdquo; marked items</li>
        </ul>

        <h3 className="mb-3 text-lg text-white">Eligible Returns</h3>
        <p className="mb-3 text-sm text-zinc-400">Items may be returned only if all conditions are met:</p>
        <ul className="mb-6 space-y-2 text-sm text-zinc-400">
          <li>Unopened, factory-sealed packaging intact</li>
          <li>Return requested within 14 calendar days of delivery</li>
          <li>Proof of purchase provided</li>
        </ul>

        <h3 className="mb-3 text-lg text-white">Return Process</h3>
        <ol className="mb-8 list-decimal space-y-2 pl-5 text-sm text-zinc-400">
          <li>
            Email{' '}
            <a href={`mailto:${SITE_CONFIG.supportEmail}`} className="text-zinc-200 underline">
              {SITE_CONFIG.supportEmail}
            </a>{' '}
            with order number and items to return.
          </li>
          <li>Receive RMA authorization within 1–2 business days.</li>
          <li>Ship back in plain packaging (customer pays return shipping unless our error).</li>
          <li>Refund issued to original payment method within 5–10 business days after inspection.</li>
        </ol>

        <h2 className="mb-4 mt-10 font-serif text-xl text-white">Damaged or Defective Items</h2>
        <p className="mb-8 text-sm leading-relaxed text-zinc-400">
          Contact us within 48 hours of delivery at{' '}
          <a href={`mailto:${SITE_CONFIG.supportEmail}`} className="text-zinc-200 underline">
            {SITE_CONFIG.supportEmail}
          </a>{' '}
          with order number and photos. We will arrange a replacement or full refund at no cost.
        </p>

        <h2 className="mb-4 mt-10 font-serif text-xl text-white">Lost or Stolen Packages</h2>
        <p className="mb-10 text-sm leading-relaxed text-zinc-400">
          Room 23 is not responsible for packages marked &ldquo;Delivered&rdquo; that are stolen. We
          recommend shipping to a secure address. Missing deliveries must be reported within 7 days.
        </p>

        <p className="text-sm text-zinc-400">
          Questions? Visit our <Link href="/faq" className="text-zinc-200 underline">FAQ</Link> or{' '}
          <Link href="/contact" className="text-zinc-200 underline">Contact Us</Link>.
        </p>
      </div>
    </div>
  )
}
