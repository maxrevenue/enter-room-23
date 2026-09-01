import type { Metadata } from 'next'
import { SITE_CONFIG } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Shipping, Returns & Cancellations - Room 23',
  description:
    'Discreet packaging, who pays return shipping, and how to cancel an order that has not yet shipped. Charges appear as ROOM23 WELLNESS.',
  alternates: { canonical: '/shipping' },
}

export default function ShippingPage() {
  return (
    <main className="min-h-screen bg-theme-bg text-theme-text">
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-8 sm:py-20 md:py-24">
        <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-theme-muted sm:tracking-[0.28em]">
          Customer Service
        </p>
        <h1 className="mt-5 font-serif text-3xl tracking-tight text-theme-text sm:text-4xl md:text-[2.75rem]">
          Shipping, Returns &amp; Cancellations
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-theme-muted">
          Order cancellation, return shipping costs, and packing are stated here so they are easy to find before you pay.
        </p>
        <nav
          aria-label="Policy sections"
          className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-[11px] uppercase tracking-[0.14em] text-theme-muted"
        >
          <a href="#cancellation" className="underline-offset-4 hover:text-theme-text hover:underline">
            Cancellation
          </a>
          <a href="#return-shipping" className="underline-offset-4 hover:text-theme-text hover:underline">
            Return shipping costs
          </a>
          <a href="#returns" className="underline-offset-4 hover:text-theme-text hover:underline">
            Returns
          </a>
          <a href="#fulfillment" className="underline-offset-4 hover:text-theme-text hover:underline">
            Fulfillment
          </a>
        </nav>

        <div className="mt-12 space-y-12 border-t border-theme-border pt-12">
          <section id="cancellation" className="scroll-mt-24 space-y-4">
            <h2 className="font-serif text-xl text-theme-text">Order Cancellation Policy</h2>
            <p className="text-sm leading-relaxed text-theme-muted">
              It is possible to cancel an order that has not yet shipped. Email{' '}
              <a href={`mailto:${SITE_CONFIG.email}`} className="text-theme-text underline hover:text-theme-accent">
                {SITE_CONFIG.email}
              </a>{' '}
              with your order number. We will confirm when the cancellation is complete and refund the original payment method in full.
            </p>
            <p className="text-sm leading-relaxed text-theme-muted">
              Unfortunately, we are unable to cancel an order that has already been shipped. Unused items in original packaging may still be returned within 14 days of delivery, as described below.
            </p>
          </section>

          <section id="return-shipping" className="scroll-mt-24 space-y-4">
            <h2 className="font-serif text-xl text-theme-text">Who Pays Return Shipping</h2>
            <p className="text-sm leading-relaxed text-theme-muted">
              The customer is responsible for return shipping costs, unless the item is damaged, defective, or incorrect. In those cases Room 23 covers return shipping and will arrange a replacement or refund.
            </p>
          </section>

          <section id="returns" className="scroll-mt-24 space-y-4">
            <h2 className="font-serif text-xl text-theme-text">Return &amp; Refund Policy</h2>
            <p className="text-sm leading-relaxed text-theme-muted">
              Unopened products in original factory-sealed packaging may be returned within 14 days of delivery for a refund to the original payment method.
            </p>
            <p className="text-sm leading-relaxed text-theme-muted">
              Opened, unsealed, or used items cannot be returned or exchanged. If an item arrives damaged or defective, contact us within 48 hours of delivery at{' '}
              <a href={`mailto:${SITE_CONFIG.email}`} className="text-theme-text underline hover:text-theme-accent">
                {SITE_CONFIG.email}
              </a>{' '}
              with your order number. A photo of the damaged product (the item, not a person or ID) can help.
            </p>
          </section>

          <section id="fulfillment" className="scroll-mt-24 space-y-4">
            <h2 className="font-serif text-xl text-theme-text">Fulfillment</h2>
            <p className="text-sm leading-relaxed text-theme-muted">
              Items currently listed on {SITE_CONFIG.domain} ship from established U.S. wholesale partner warehouses. Room 23 does not hold this catalog as on-hand warehouse inventory. Customer packing slips and cartons do not name wholesale partners.
            </p>
            <p className="text-sm leading-relaxed text-theme-muted">
              Orders are processed within 1 to 2 business days (Monday through Friday, excluding public holidays). Standard shipping (USPS Ground) arrives in 5–8 business days after fulfillment. Expedited (USPS Priority) takes 2–4 business days. Express options include FedEx 2Day and UPS Next Day Air.
            </p>
            <p className="text-sm leading-relaxed text-theme-muted">
              We ship within the United States only, including all 50 states, US territories, and APO/FPO addresses. When your order ships, we email a tracking number. Tracking can take up to 24 hours to activate.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-xl text-theme-text">Discreet Packaging &amp; Billing</h2>
            <p className="text-sm leading-relaxed text-theme-muted">
              Every order ships in a plain, unbranded outer box or mailer. The exterior does not name what is inside.
            </p>
            <p className="text-sm leading-relaxed text-theme-muted">
              Your credit card or bank statement will list charges under the exact billing descriptor:{' '}
              <strong className="font-semibold text-theme-text">{SITE_CONFIG.billingDescriptor}</strong>.
            </p>
          </section>

          <section className="space-y-4 rounded-lg border border-theme-border bg-theme-surface/40 p-6 sm:p-8">
            <h2 className="font-serif text-lg text-theme-text">Merchant Support Contact</h2>
            <div className="space-y-1 text-xs leading-relaxed text-theme-muted">
              <p className="font-semibold text-theme-text">{SITE_CONFIG.legalEntity}</p>
              <p>{SITE_CONFIG.address.full}</p>
              <p>Phone: {SITE_CONFIG.phone}</p>
              <p>Email: {SITE_CONFIG.email}</p>
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}
