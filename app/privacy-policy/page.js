import Link from 'next/link'

export const metadata = { title: 'Privacy Policy — AW Holdings LLC' }

export default function PrivacyPolicyPage() {
  return (
    <article className="container max-w-3xl py-20 sm:py-28 space-y-12 flex-1">
      <div>
        <div className="text-[10px] tracking-[0.35em] uppercase text-foreground/50">Legal</div>
        <h1 className="text-4xl sm:text-5xl font-light tracking-tight mt-3">
          <span className="font-serif italic">Privacy</span> Policy
        </h1>
        <p className="text-foreground/50 text-sm mt-4">Effective: June 1, 2025</p>
      </div>

      <div className="border border-foreground/30 bg-card p-8">
        <div className="text-[10px] tracking-[0.3em] uppercase text-foreground/60 mb-4">
          Our Privacy Promise
        </div>
        <p className="text-foreground text-base sm:text-lg leading-loose tracking-tight">
          We prioritize your privacy. All orders are shipped discreetly in plain packaging. Your
          credit card statement will show a charge from AW Holdings LLC.
        </p>
      </div>

      <Section title="1. Information We Collect">
        To fulfill your order and maintain a legal record of the transaction, we collect only the
        information strictly necessary: your name, shipping address, email, and payment
        authorization details. We do not retain your full card number — only the last four
        digits, for reference on your receipt.
      </Section>

      <Section title="2. How We Use It">
        Your information is used exclusively to process your order, ship your items in plain,
        unmarked packaging, and provide customer support. We do not sell, rent, or share your
        personal data with third parties for marketing purposes.
      </Section>

      <Section title="3. Discreet Shipping">
        Every order is dispatched in an opaque, unbranded outer box. There is no product name,
        product image, or company logo visible on the exterior. The return address uses a neutral
        descriptor consistent with{' '}
        <span className="text-foreground font-medium">AW Holdings LLC</span>.
      </Section>

      <Section title="4. Discreet Billing">
        Your credit card statement will show a charge from{' '}
        <span className="text-foreground font-medium">AW Holdings LLC</span>. The specific
        storefront name and the items purchased will not appear on your statement.
      </Section>

      <Section title="5. Cookies & Session Data">
        We use a minimal amount of local browser storage to remember your age verification, theme
        preference, and shopping bag between visits. This data stays on your device and is never
        sent to a marketing partner.
      </Section>

      <Section title="6. Your Rights">
        You may request access to, correction of, or deletion of your personal information at any
        time by writing to <span className="text-foreground">privacy@awholdings.example</span>.
        Depending on your jurisdiction, additional rights may apply under GDPR, CCPA, or similar
        laws.
      </Section>

      <Section title="7. Related Policies">
        See also our{' '}
        <Link href="/terms-of-service" className="underline text-foreground hover:text-foreground/80">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="/refund-policy" className="underline text-foreground hover:text-foreground/80">
          Refund Policy
        </Link>
        .
      </Section>

      <Section title="8. Contact">
        AW Holdings LLC · 1209 Orange Street, Wilmington, DE 19801 · privacy@awholdings.example
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
