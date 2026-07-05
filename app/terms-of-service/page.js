import Link from 'next/link'

export const metadata = { title: 'Terms of Service — AW Holdings LLC' }

export default function TermsOfServicePage() {
  return (
    <article className="container max-w-3xl py-16 space-y-8 flex-1">
      <div>
        <div className="text-[10px] tracking-[0.3em] uppercase text-white/50">Legal</div>
        <h1 className="text-4xl font-light tracking-tight mt-2">Terms of Service</h1>
        <p className="text-white/50 text-sm mt-3">Last updated: June 1, 2025</p>
      </div>

      {/* Prominent Billing Descriptor callout — required verbatim clause */}
      <div className="border-2 border-white/40 bg-neutral-950 p-6 shadow-[0_0_60px_rgba(255,255,255,0.04)]">
        <div className="text-[10px] tracking-[0.3em] uppercase text-white/60 mb-3">
          Billing Descriptor
        </div>
        <p className="text-white text-base sm:text-lg font-medium leading-relaxed tracking-tight">
          Billing Descriptor: To ensure your privacy, your credit card statement will reflect a
          charge from <span className="underline decoration-white/40 underline-offset-4">AW Holdings LLC</span>. It will not list the name of this storefront or the
          specific items purchased.
        </p>
      </div>

      <section className="space-y-3 text-white/70 leading-relaxed">
        <h2 className="text-xl text-white font-light">1. Age Requirement</h2>
        <p>
          You must be at least 18 years of age (or the age of majority in your jurisdiction,
          whichever is greater) to access, purchase from, or otherwise use this website. By
          entering, you affirm under penalty of perjury that you meet this requirement. AW Holdings
          LLC reserves the right to refuse service.
        </p>
      </section>

      <section className="space-y-3 text-white/70 leading-relaxed">
        <h2 className="text-xl text-white font-light">2. Products &amp; Use</h2>
        <p>
          Products offered on this site are intended for adult wellness use only. You are solely
          responsible for using each product in accordance with its accompanying instructions and
          applicable law. Products are not medical devices and are not intended to diagnose, treat,
          cure, or prevent any disease.
        </p>
      </section>

      <section className="space-y-3 text-white/70 leading-relaxed">
        <h2 className="text-xl text-white font-light">3. Orders, Pricing &amp; Billing</h2>
        <p>
          All prices are listed in USD. As stated in our Billing Descriptor above, your credit card
          statement will reflect a charge from{' '}
          <span className="text-white font-medium">AW Holdings LLC</span> and will not identify
          this storefront or the specific items purchased. AW Holdings LLC may refuse or cancel
          any order at its sole discretion, including for suspected fraud, prohibited
          jurisdictions, or restrictions on quantity.
        </p>
      </section>

      <section className="space-y-3 text-white/70 leading-relaxed">
        <h2 className="text-xl text-white font-light">4. Shipping</h2>
        <p>
          All shipments are dispatched in unmarked, opaque packaging with no product branding on the
          exterior. Title and risk of loss transfer to you upon delivery to the carrier.
        </p>
      </section>

      <section className="space-y-3 text-white/70 leading-relaxed">
        <h2 className="text-xl text-white font-light">5. Returns &amp; Refunds</h2>
        <p>
          Due to the intimate and hygienic nature of our products, most items are strictly
          non-returnable and non-refundable once opened or used. Unopened items may be returned
          within 14 days of delivery. See our full{' '}
          <Link href="/refund-policy" className="underline text-white hover:text-white/80">
            Refund Policy
          </Link>{' '}
          for details.
        </p>
      </section>

      <section className="space-y-3 text-white/70 leading-relaxed">
        <h2 className="text-xl text-white font-light">6. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, AW Holdings LLC shall not be liable for any
          indirect, incidental, special, consequential, or punitive damages arising out of or
          relating to your use of this site or products.
        </p>
      </section>

      <section className="space-y-3 text-white/70 leading-relaxed">
        <h2 className="text-xl text-white font-light">7. Governing Law</h2>
        <p>
          These Terms are governed by the laws of the State of Delaware, without regard to its
          conflict of law principles. Exclusive jurisdiction lies with the state and federal courts
          in Wilmington, Delaware.
        </p>
      </section>

      <section className="space-y-3 text-white/70 leading-relaxed">
        <h2 className="text-xl text-white font-light">8. Contact</h2>
        <p>AW Holdings LLC · 1209 Orange Street, Wilmington, DE 19801 · legal@awholdings.example</p>
      </section>
    </article>
  )
}
