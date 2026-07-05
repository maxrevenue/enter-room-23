import Link from 'next/link'

export const metadata = { title: 'Terms of Service — AW Holdings LLC' }

export default function TermsOfServicePage() {
  return (
    <article className="container max-w-3xl py-20 sm:py-28 space-y-12 flex-1">
      <div>
        <div className="text-[10px] tracking-[0.35em] uppercase text-foreground/50">Legal</div>
        <h1 className="text-4xl sm:text-5xl font-light tracking-tight mt-3">
          <span className="font-serif italic">Terms</span> of Service
        </h1>
        <p className="text-foreground/50 text-sm mt-4">Last updated: June 1, 2025</p>
      </div>

      <div className="border border-foreground/30 bg-card p-8">
        <div className="text-[10px] tracking-[0.3em] uppercase text-foreground/60 mb-4">
          Acceptance of Terms
        </div>
        <p className="text-foreground text-base sm:text-lg font-medium leading-loose tracking-tight">
          By using this site, you confirm you are 18+ years of age. All products are sold as adult
          novelties. We reserve the right to refuse service.
        </p>
      </div>

      <div className="border border-border bg-card p-6">
        <div className="text-[10px] tracking-[0.3em] uppercase text-foreground/50 mb-3">
          Billing Descriptor
        </div>
        <p className="text-foreground/90 text-sm leading-loose">
          To ensure your privacy, your credit card statement will reflect a charge from{' '}
          <span className="text-foreground font-medium">AW Holdings LLC</span>. It will not list
          the name of this storefront or the specific items purchased.
        </p>
      </div>

      <Section title="1. Eligibility">
        You must be at least 18 years of age (or the age of majority in your jurisdiction,
        whichever is greater) to access, purchase from, or otherwise use this website. By entering,
        you affirm under penalty of perjury that you meet this requirement. AW Holdings LLC
        reserves the right to refuse service for any reason at its sole discretion.
      </Section>

      <Section title="2. Products & Use">
        Products offered on this site are sold as adult novelties, intended for adult wellness use
        only. You are solely responsible for using each product in accordance with its accompanying
        instructions and applicable law. Products are not medical devices and are not intended to
        diagnose, treat, cure, or prevent any disease.
      </Section>

      <Section title="3. Orders, Pricing & Billing">
        All prices are listed in USD. As stated in our Billing Descriptor above, your credit card
        statement will reflect a charge from{' '}
        <span className="text-foreground font-medium">AW Holdings LLC</span> and will not identify
        this storefront or the specific items purchased. AW Holdings LLC may refuse or cancel any
        order at its sole discretion.
      </Section>

      <Section title="4. Shipping & Discretion">
        All shipments are dispatched in unmarked, opaque packaging with no product branding on the
        exterior. See our{' '}
        <Link href="/privacy-policy" className="underline text-foreground hover:text-foreground/80">
          Privacy Policy
        </Link>{' '}
        for details on how we protect your information.
      </Section>

      <Section title="5. Returns & Refunds">
        Due to the intimate and hygienic nature of our products, most items are final sale. See
        our full{' '}
        <Link href="/refund-policy" className="underline text-foreground hover:text-foreground/80">
          Refund Policy
        </Link>{' '}
        for details.
      </Section>

      <Section title="6. Limitation of Liability">
        To the maximum extent permitted by law, AW Holdings LLC shall not be liable for any
        indirect, incidental, special, consequential, or punitive damages arising out of or
        relating to your use of this site or products.
      </Section>

      <Section title="7. Governing Law">
        These Terms are governed by the laws of the State of Delaware. Exclusive jurisdiction lies
        with the state and federal courts in Wilmington, Delaware.
      </Section>

      <Section title="8. Contact">
        AW Holdings LLC · 1209 Orange Street, Wilmington, DE 19801 · legal@awholdings.example
      </Section>
    </article>
  )
}

function Section({ title, children }) {
  return (
    <section className="space-y-4 text-foreground/75 leading-loose">
      <h2 className="text-xl sm:text-2xl text-foreground font-light tracking-tight">{title}</h2>
      <p>{children}</p>
    </section>
  )
}
