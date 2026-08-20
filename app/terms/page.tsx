import type { Metadata } from 'next'
import { SITE_CONFIG } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Terms of Service - Room 23',
  description: 'Terms and conditions governing the use of Room 23 services and product purchases.',
  alternates: { canonical: '/terms' },
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-theme-bg text-theme-text">
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-8 sm:py-20 md:py-24">
        <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-theme-muted sm:tracking-[0.28em]">
          Legal Agreement
        </p>
        <h1 className="mt-5 font-serif text-3xl tracking-tight text-theme-text sm:text-4xl md:text-[2.75rem]">
          Terms of Service
        </h1>
        <p className="mt-2 text-xs text-theme-muted">Last Updated: August 2026</p>

        <div className="mt-12 space-y-10 border-t border-theme-border pt-12 text-sm text-theme-muted leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-serif text-xl text-theme-text">1. Overview & Ownership</h2>
            <p>
              This website ({SITE_CONFIG.domain}) is operated by {SITE_CONFIG.legalEntity}, located at {SITE_CONFIG.address.full}. Throughout the site, the terms &ldquo;we&rdquo;, &ldquo;us&rdquo;, and &ldquo;our&rdquo; refer to {SITE_CONFIG.legalEntity}. By visiting our site or purchasing products from us, you engage in our service and agree to be bound by the following terms and conditions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl text-theme-text">2. Age Requirement (18+)</h2>
            <p>
              By accessing this website or purchasing adult wellness products, you affirm that you are at least 18 years of age (or the legal age of majority in your jurisdiction). Access to or purchase of items by minors is strictly prohibited.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl text-theme-text">3. Payment Processing & Billing Descriptor</h2>
            <p>
              All online purchases are billed securely. Payments are processed by our authorized payment processor, CCBill. Secure checkout processed by CCBill. Payment details are handled by our PCI-compliant payment processor.
            </p>
            <p>
              Your credit card, debit card, or bank statement will show charges under the exact billing descriptor:
            </p>
            <div className="inline-block rounded border border-theme-border bg-theme-surface/60 px-4 py-2 font-mono text-sm font-semibold text-theme-text">
              {SITE_CONFIG.billingDescriptor}
            </div>
            <p>
              You agree to provide current, complete, and accurate purchase and account information for all purchases made at our store.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl text-theme-text">4. Products & Personal Use</h2>
            <p>
              All products offered on this site are intended strictly for individual personal use. Products must be used in accordance with the provided packaging and instructions. We reserve the right to limit sales quantities or refuse service to any customer if commercial resale or improper usage is suspected.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl text-theme-text">5. Order Cancellations & Refunds</h2>
            <p>
              For details on cancellations, returns, and damaged shipments, please consult our Shipping & Returns policy. Refunds will be issued back to the original payment instrument via CCBill upon inspection of returned unopened merchandise.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl text-theme-text">6. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by applicable law, {SITE_CONFIG.legalEntity} and its officers, directors, employees, and suppliers shall not be liable for any indirect, incidental, punitive, or consequential damages resulting from product use or inability to use our services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl text-theme-text">7. Contact Information</h2>
            <p>
              Questions about the Terms of Service should be sent to us at:
            </p>
            <div className="rounded-lg border border-theme-border bg-theme-surface/50 p-6 space-y-1 text-xs text-theme-text">
              <p className="font-semibold">{SITE_CONFIG.legalEntity}</p>
              <p>{SITE_CONFIG.address.street}</p>
              <p>{SITE_CONFIG.address.city}, {SITE_CONFIG.address.state} {SITE_CONFIG.address.zip}</p>
              <p>Telephone: {SITE_CONFIG.phone}</p>
              <p>Support Email: {SITE_CONFIG.email}</p>
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}
