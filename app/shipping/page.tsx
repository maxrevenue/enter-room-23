import type { Metadata } from 'next'
import { SITE_CONFIG } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Shipping & Returns - Room 23',
  description: 'Discrete packaging, order fulfillment timelines, and return policy details for Room 23.',
  alternates: { canonical: '/shipping' },
}

export default function ShippingPage() {
  return (
    <main className="min-h-screen bg-theme-bg text-theme-text">
      <section className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-20 md:py-24">
        <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-theme-muted">
          Customer Service
        </p>
        <h1 className="mt-5 font-serif text-3xl tracking-tight text-theme-text sm:text-4xl md:text-[2.75rem]">
          Shipping & Returns
        </h1>

        <div className="mt-12 space-y-12 border-t border-theme-border pt-12">
          <section className="space-y-4">
            <h2 className="font-serif text-xl text-theme-text">Discrete Packaging & Billing</h2>
            <p className="text-sm leading-relaxed text-theme-muted">
              We uphold complete privacy for every client. All orders are shipped in plain, unbranded outer boxes or mailers without any external product descriptions, logo branding, or sensitive phrasing.
            </p>
            <p className="text-sm leading-relaxed text-theme-muted">
              Your credit card or bank statement will discreetly list charges under the exact billing descriptor:{' '}
              <strong className="text-theme-text font-semibold">{SITE_CONFIG.billingDescriptor}</strong>.
            </p>
            <p className="text-sm leading-relaxed text-theme-muted">
              {SITE_CONFIG.pciCheckoutWording}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-xl text-theme-text">Fulfillment & Delivery Timelines</h2>
            <p className="text-sm leading-relaxed text-theme-muted">
              Orders are processed and dispatched within 1 to 2 business days (Monday through Friday, excluding public holidays). Standard domestic shipping typically arrives within 3 to 5 business days after fulfillment.
            </p>
            <p className="text-sm leading-relaxed text-theme-muted">
              Upon shipment, you will receive a confirmation email containing a tracking number to monitor your delivery status in real time.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-xl text-theme-text">Return & Refund Policy</h2>
            <p className="text-sm leading-relaxed text-theme-muted">
              Due to the personal and intimate nature of adult wellness items, unopened products in their original factory-sealed packaging may be returned within 14 days of delivery for a refund.
            </p>
            <p className="text-sm leading-relaxed text-theme-muted">
              For safety and hygiene compliance, any item that has been opened, unsealed, or used cannot be returned or exchanged. If an item arrives damaged or defective, please contact client support within 48 hours of delivery at{' '}
              <a href={`mailto:${SITE_CONFIG.email}`} className="text-theme-text underline hover:text-theme-accent">
                {SITE_CONFIG.email}
              </a>{' '}
              with photos and order details for an immediate replacement or store credit.
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
