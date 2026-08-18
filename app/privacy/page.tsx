import type { Metadata } from 'next'
import { SITE_CONFIG } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Privacy Policy - Room 23',
  description: 'Privacy Policy for Room 23 detailing data handling, CCBill payment processing, and consumer rights.',
  alternates: { canonical: '/privacy' },
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-theme-bg text-theme-text">
      <section className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-20 md:py-24">
        <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-theme-muted">
          Data Protection
        </p>
        <h1 className="mt-5 font-serif text-3xl tracking-tight text-theme-text sm:text-4xl md:text-[2.75rem]">
          Privacy Policy
        </h1>
        <p className="mt-2 text-xs text-theme-muted">Last Updated: August 2026</p>

        <div className="mt-12 space-y-10 border-t border-theme-border pt-12 text-sm text-theme-muted leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-serif text-xl text-theme-text">1. Information We Collect</h2>
            <p>
              {SITE_CONFIG.legalEntity} (&ldquo;Room 23&rdquo;) collects personal information necessary to fulfill orders and provide client services. This includes your name, shipping address, email address, and phone number when placing an order.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl text-theme-text">2. Payment Security & Payment Processing</h2>
            <p>
              We do not store complete credit card or payment card account numbers on our servers. All transaction data is handled directly by our payment processor, {SITE_CONFIG.paymentProcessor}.
            </p>
            <p>
              {SITE_CONFIG.pciCheckoutWording} Your transaction will appear on your bank statement under the descriptor:{' '}
              <strong className="text-theme-text font-semibold">{SITE_CONFIG.billingDescriptor}</strong>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl text-theme-text">3. How We Use Your Information</h2>
            <p>
              Personal data collected is used solely to process transactions, dispatch packages, send tracking updates, respond to customer inquiry emails, and fulfill tax and legal requirements. We do not sell, rent, or trade client personal data to third parties.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl text-theme-text">4. Discrete Communications</h2>
            <p>
              All email notifications (order confirmations, shipping numbers, support messages) are dispatched with minimal metadata. We respect your confidentiality and will never share your purchase history.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl text-theme-text">5. Contact Information & Privacy Requests</h2>
            <p>
              To request access, correction, or deletion of your personal data, contact our data compliance officer at:
            </p>
            <div className="rounded-lg border border-theme-border bg-theme-surface/50 p-6 space-y-1 text-xs text-theme-text">
              <p className="font-semibold">{SITE_CONFIG.legalEntity}</p>
              <p>{SITE_CONFIG.address.street}</p>
              <p>{SITE_CONFIG.address.city}, {SITE_CONFIG.address.state} {SITE_CONFIG.address.zip}</p>
              <p>Phone: {SITE_CONFIG.phone}</p>
              <p>Email: {SITE_CONFIG.email}</p>
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}
