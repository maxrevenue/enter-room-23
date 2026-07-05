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

      {/* Required verbatim clause — prominently displayed */}
      <div className="border-2 border-white/40 bg-neutral-950 p-6 shadow-[0_0_60px_rgba(255,255,255,0.04)]">
        <div className="text-[10px] tracking-[0.3em] uppercase text-white/60 mb-3">
          Acceptance of Terms
        </div>
        <p className="text-white text-base sm:text-lg font-medium leading-relaxed tracking-tight">
          By using this site, you confirm you are 18+ years of age. All products are sold as adult
          novelties. We reserve the right to refuse service.
        </p>
      </div>

      {/* Billing descriptor clause (retained from prior update) */}
      <div className="border border-white/20 bg-neutral-950 p-5">
        <div className="text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2">
          Billing Descriptor
        </div>
        <p className="text-white/90 text-sm leading-relaxed">
          To ensure your privacy, your credit card statement will reflect a charge from{' '}
          <span className="text-white font-medium">AW Holdings LLC</span>. It will not list the
          name of this storefront or the specific items purchased.
        </p>
      </div>

      <section className="space-y-3 text-white/70 leading-relaxed">
        <h2 className="text-xl text-white font-light">1. Eligibility</h2>
        <p>
          You must be at least 18 years of age (or the age of majority in your jurisdiction,
          whichever is greater) to access, purchase from, or otherwise use this website. By
          entering, you affirm under penalty of perjury that you meet this requirement. AW Holdings
          LLC reserves the right to refuse service for any reason at its sole discretion.
        </p>
      </section>

      <section className="space-y-3 text-white/70 leading-relaxed">
        <h2 className="text-xl text-white font-light">2. Products &amp; Use</h2>
        <p>
          Products offered on this site are sold as adult novelties, intended for adult wellness
          use only. You are solely responsible for using each product in accordance with its
          accompanying instructions and applicable law. Products are not medical devices and are
          not intended to diagnose, treat, cure, or prevent any disease.
        </p>
      </section>

      <section className="space-y-3 text-white/70 leading-relaxed">
        <h2 className="text-xl text-white font-light">3. Orders, Pricing &amp; Billing</h2>
        <p>
          All prices are listed in USD. As stated in our Billing Descriptor above, your credit card
          statement will reflect a charge from{' '}
          <span className="text-white font-medium">AW Holdings LLC</span> and will not identify
          this storefront or the specific items purchased. AW Holdings LLC may refuse or cancel any
          order at its sole discretion.
        </p>
      </section>

      <section className="space-y-3 text-white/70 leading-relaxed">
        <h2 className="text-xl text-white font-light">4. Shipping &amp; Discretion</h2>
        <p>
          All shipments are dispatched in unmarked, opaque packaging with no product branding on
          the exterior. See our{' '}
          <Link href="/privacy-policy" className="underline text-white hover:text-white/80">
            Privacy Policy
          </Link>{' '}
          for details on how we protect your information.
        </p>
      </section>

      <section className="space-y-3 text-white/70 leading-relaxed">
        <h2 className="text-xl text-white font-light">5. Returns &amp; Refunds</h2>
        <p>
          Due to the intimate and hygienic nature of our products, most items are final sale. See
          our full{' '}
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
          These Terms are governed by the laws of the State of Delaware. Exclusive jurisdiction
          lies with the state and federal courts in Wilmington, Delaware.
        </p>
      </section>

      <section className="space-y-3 text-white/70 leading-relaxed">
        <h2 className="text-xl text-white font-light">8. Contact</h2>
        <p>AW Holdings LLC · 1209 Orange Street, Wilmington, DE 19801 · legal@awholdings.example</p>
      </section>
    </article>
  )
}
