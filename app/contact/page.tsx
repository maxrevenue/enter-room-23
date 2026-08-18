import type { Metadata } from 'next'
import { SITE_CONFIG } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Contact Us - Room 23',
  description: 'Get in touch with Room 23 customer support regarding orders, product inquiries, or general questions.',
  alternates: { canonical: '/contact' },
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-theme-bg text-theme-text">
      <section className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-20 md:py-24">
        <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-theme-muted">
          Client Services
        </p>
        <h1 className="mt-5 font-serif text-3xl tracking-tight text-theme-text sm:text-4xl md:text-[2.75rem]">
          Contact Us
        </h1>
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-theme-muted sm:text-[0.9375rem]">
          Our team is available to assist with order inquiries, product guidance, discrete shipping updates, and billing support.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-10 border-t border-theme-border pt-12 md:grid-cols-2">
          <div className="space-y-8">
            <div>
              <h2 className="text-[10px] font-medium uppercase tracking-[0.25em] text-theme-muted">
                Support Email
              </h2>
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="mt-2 block font-serif text-lg text-theme-text transition-colors hover:text-theme-accent"
              >
                {SITE_CONFIG.email}
              </a>
              <p className="mt-1 text-xs text-theme-muted">
                Inquiries are addressed within 24 business hours.
              </p>
            </div>

            <div>
              <h2 className="text-[10px] font-medium uppercase tracking-[0.25em] text-theme-muted">
                Telephone Support
              </h2>
              <a
                href={`tel:${SITE_CONFIG.phone.replace(/[^0-9]/g, '')}`}
                className="mt-2 block font-serif text-lg text-theme-text transition-colors hover:text-theme-accent"
              >
                {SITE_CONFIG.phone}
              </a>
              <p className="mt-1 text-xs text-theme-muted">
                Monday &ndash; Friday, 9:00 AM &ndash; 5:00 PM PST
              </p>
            </div>

            <div>
              <h2 className="text-[10px] font-medium uppercase tracking-[0.25em] text-theme-muted">
                Corporate Headquarters
              </h2>
              <div className="mt-2 text-sm text-theme-text">
                <p className="font-semibold">{SITE_CONFIG.legalEntity}</p>
                <p>{SITE_CONFIG.address.street}</p>
                <p>{SITE_CONFIG.address.city}, {SITE_CONFIG.address.state} {SITE_CONFIG.address.zip}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-theme-border bg-theme-surface/50 p-6 sm:p-8">
            <h2 className="text-[10px] font-medium uppercase tracking-[0.25em] text-theme-muted">
              Billing & Descriptor Details
            </h2>
            <div className="mt-4 space-y-4 text-xs text-theme-muted">
              <p>
                All transactions on this site are processed securely through {SITE_CONFIG.paymentProcessor}.
              </p>
              <div className="rounded border border-theme-border p-4">
                <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-theme-muted">
                  Credit Card Billing Descriptor
                </p>
                <p className="mt-1 font-mono text-sm font-semibold text-theme-text">
                  {SITE_CONFIG.billingDescriptor}
                </p>
              </div>
              <p className="text-[11px] leading-relaxed">
                {SITE_CONFIG.pciCheckoutWording}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
