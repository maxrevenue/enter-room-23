import Link from 'next/link'
import { SITE_CONFIG } from '@/config/site'

export const metadata = {
  title: 'Shipping & Discretion',
  description: 'Shipping rates, delivery times, and return policy for Room 23.',
}

export default function ShippingPage() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4 md:px-8">
      <h1 className="text-3xl font-serif text-white mb-8">Shipping & Discretion</h1>
      
      <p className="text-zinc-300 mb-12 leading-relaxed">
        Your privacy is our highest priority. All orders are processed, packed, and shipped with absolute discretion so you can shop with total peace of mind.
      </p>

      <div className="grid md:grid-cols-2 gap-8 items-center bg-zinc-900 border border-zinc-800 p-6 md:p-8 mb-12">
        <div className="bg-zinc-950 aspect-square md:aspect-auto md:h-64 flex flex-col items-center justify-center border border-dashed border-zinc-700 text-center p-4">
          {/* TODO: Replace with next/image of physical box */}
          <span className="text-zinc-500 text-sm mb-2">[ Image Placeholder ]</span>
          <span className="text-zinc-600 text-xs">Plain taped brown/white mailer with generic label</span>
        </div>
        
        <div>
          <h2 className="text-xl font-serif text-white mb-4">Exactly How It Arrives</h2>
          <ul className="text-zinc-400 text-sm space-y-3 list-none p-0">
            <li className="flex items-start gap-2">
              <span className="text-red-700 mt-1">•</span>
              <span>Plain, unmarked brown or white outer packaging.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-700 mt-1">•</span>
              <span>Zero exterior branding, logos, or identifying marks.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-700 mt-1">•</span>
              <span>Return address simply reads generic fulfillment center.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-700 mt-1">•</span>
              <span>Customs declarations (international) use vague, compliant terminology (e.g., &quot;Wellness Tool&quot;).</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="legal-content text-zinc-300">
        <p className="text-zinc-500 text-xs uppercase tracking-widest mb-8">Last Updated: {SITE_CONFIG.lastUpdated}</p>

        <h2 className="text-xl font-serif text-white mt-10 mb-4">Processing Times</h2>
        <ul className="text-zinc-400 text-sm space-y-2 mb-6">
          <li><strong className="text-zinc-200">Standard Orders:</strong> Processed within 1–2 business days of payment confirmation.</li>
          <li><strong className="text-zinc-200">Weekends/Holidays:</strong> Orders placed after 2:00 PM ET Friday process the following Monday.</li>
        </ul>
        <p className="text-zinc-400 text-sm leading-relaxed mb-8">
          You will receive a confirmation email immediately after purchase and a shipping confirmation with tracking once dispatched.
        </p>

        <h2 className="text-xl font-serif text-white mt-10 mb-4">Shipping Methods &amp; Rates</h2>
        <p className="text-zinc-400 text-sm mb-4">We ship within the United States (all 50 states, APO/FPO, US territories).</p>
        <div className="overflow-x-auto border border-zinc-800 bg-zinc-900 mb-6">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left p-3 text-xs uppercase tracking-widest text-zinc-400 font-medium">Method</th>
                <th className="text-left p-3 text-xs uppercase tracking-widest text-zinc-400 font-medium">Delivery</th>
                <th className="text-left p-3 text-xs uppercase tracking-widest text-zinc-400 font-medium">Rate</th>
              </tr>
            </thead>
            <tbody className="text-zinc-300">
              <tr className="border-b border-zinc-800"><td className="p-3">Standard (USPS Ground)</td><td className="p-3">5–8 business days</td><td className="p-3">$5.99 USD</td></tr>
              <tr className="border-b border-zinc-800"><td className="p-3">Expedited (USPS Priority)</td><td className="p-3">2–4 business days</td><td className="p-3">$12.99 USD</td></tr>
              <tr className="border-b border-zinc-800"><td className="p-3">Express (FedEx 2Day)</td><td className="p-3">2 business days</td><td className="p-3">$24.99 USD</td></tr>
              <tr><td className="p-3">Express (UPS Next Day Air)</td><td className="p-3">Next business day</td><td className="p-3">$29.99 USD</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-zinc-400 text-sm mb-8">Free standard shipping on orders over <strong className="text-white">${SITE_CONFIG.freeShippingThreshold.toFixed(2)} USD</strong>.</p>

        <h2 className="text-xl font-serif text-white mt-10 mb-4">Returns Policy</h2>
        <h3 className="text-lg text-white mb-3">Final Sale Items (Non-Returnable)</h3>
        <ul className="text-zinc-400 text-sm space-y-2 mb-6">
          <li>Any product that has been opened, used, or whose seal has been broken</li>
          <li>Lubricants, oils, massage products, and all liquid/gel items (once seal is broken)</li>
          <li>Intimate wear and apparel (once removed from packaging)</li>
          <li>Clearance or &ldquo;Final Sale&rdquo; marked items</li>
        </ul>

        <h3 className="text-lg text-white mb-3">Eligible Returns</h3>
        <p className="text-zinc-400 text-sm mb-3">Items may be returned only if all conditions are met:</p>
        <ul className="text-zinc-400 text-sm space-y-2 mb-6">
          <li>Unopened, factory-sealed packaging intact</li>
          <li>Return requested within 14 calendar days of delivery</li>
          <li>Proof of purchase provided</li>
        </ul>

        <h3 className="text-lg text-white mb-3">Return Process</h3>
        <ol className="text-zinc-400 text-sm space-y-2 mb-8 list-decimal pl-5">
          <li>Email <a href="mailto:support@room23.net" className="text-red-500 hover:text-red-400">support@room23.net</a> with order number and items to return.</li>
          <li>Receive RMA authorization within 1–2 business days.</li>
          <li>Ship back in discreet packaging (customer pays return shipping unless our error).</li>
          <li>Refund issued to original payment method within 5–10 business days after inspection.</li>
        </ol>

        <h2 className="text-xl font-serif text-white mt-10 mb-4">Damaged or Defective Items</h2>
        <p className="text-zinc-400 text-sm leading-relaxed mb-8">
          Contact us within 48 hours of delivery at{' '}
          <a href="mailto:support@room23.net" className="text-red-500 hover:text-red-400">support@room23.net</a> with order number and photos.
          We will arrange a replacement or full refund at no cost.
        </p>

        <h2 className="text-xl font-serif text-white mt-10 mb-4">Lost or Stolen Packages</h2>
        <p className="text-zinc-400 text-sm leading-relaxed mb-10">
          Room 23 is not responsible for packages marked &ldquo;Delivered&rdquo; that are stolen. We
          recommend shipping to a secure address. Missing deliveries must be reported within 7 days.
        </p>

        <p className="text-zinc-400 text-sm">
          Questions? Visit our <Link href="/faq" className="text-red-500 hover:text-red-400">FAQ</Link> or <Link href="/contact" className="text-red-500 hover:text-red-400">Contact Us</Link>.
        </p>
      </div>
    </div>
  )
}
