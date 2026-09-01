import type { Metadata } from 'next'
import { SITE_CONFIG } from '@/lib/constants'
import { STATEMENT_CHECKOUT } from '@/lib/customer-copy'

export const metadata: Metadata = {
  title: 'Shipping & Returns - Room 23',
  description: 'Unlabeled packaging, shipping timelines, and the 14-day unused return window for Room 23.',
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
          Shipping & Returns
        </h1>

        <div className="mt-12 space-y-12 border-t border-theme-border pt-12">
          <section className="space-y-4">
            <h2 className="font-serif text-xl text-theme-text">Packaging & Billing</h2>
            <p className="text-sm leading-relaxed text-theme-muted">
              Every order ships in plain, unlabeled packaging. The exterior does not name what is inside.
            </p>
            <p className="text-sm leading-relaxed text-theme-muted">
              {STATEMENT_CHECKOUT} It will not include product names.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-xl text-theme-text">Fulfillment & Delivery Timelines</h2>
            <p className="text-sm leading-relaxed text-theme-muted">
              Orders are processed within 1–2 business days (Monday through Friday, excluding public holidays). Standard shipping (USPS Ground) arrives in 5–8 business days. Expedited shipping (USPS Priority) takes 2–4 business days. Express options include FedEx 2Day (2 business days) and UPS Next Day Air (next business day).
            </p>
            <p className="text-sm leading-relaxed text-theme-muted">
              We ship within the United States only, including all 50 states, US territories, and APO/FPO addresses.
            </p>
            <p className="text-sm leading-relaxed text-theme-muted">
              When your order ships, we email a tracking number. Tracking can take up to 24 hours to activate.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-xl text-theme-text">Return & Refund Policy</h2>
            <p className="text-sm leading-relaxed text-theme-muted">
              Unused items in original packaging can be returned within 14 days of delivery for a refund to the original payment method.
            </p>
            <p className="text-sm leading-relaxed text-theme-muted">
              For hygiene, we cannot accept returns of items that have been opened or used. We will not ask you to describe use.
            </p>
            <p className="text-sm leading-relaxed text-theme-muted">
              If something arrived damaged or incorrect, we will replace or refund it. Email{' '}
              <a href={`mailto:${SITE_CONFIG.email}`} className="text-theme-text underline hover:text-theme-accent">
                {SITE_CONFIG.email}
              </a>{' '}
              with your order number. A photo of the damaged product (the item, not a person or ID) can help. You do not need to send a photo of an ID.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-xl text-theme-text">Return Shipping Costs</h2>
            <p className="text-sm leading-relaxed text-theme-muted">
              Return shipping is your responsibility unless the item is damaged or incorrect.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-xl text-theme-text">Cancellation Policy</h2>
            <p className="text-sm leading-relaxed text-theme-muted">
              If an order has not shipped, we can cancel it and refund the original payment method in full. Email {SITE_CONFIG.email} and we will confirm when the cancellation is complete. If it has already shipped, unused items may be returned within 14 days of delivery.
            </p>
          </section>

          <section className="space-y-4 rounded-lg border border-theme-border bg-theme-surface/40 p-6 sm:p-8">
            <h2 className="font-serif text-lg text-theme-text">Merchant Support Contact</h2>
            <div className="text-xs leading-relaxed text-theme-muted space-y-1">
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
