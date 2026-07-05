import Link from 'next/link'

export const metadata = { title: 'Privacy Policy — AW Holdings LLC' }

export default function PrivacyPolicyPage() {
  return (
    <article className="container max-w-3xl py-16 space-y-8 flex-1">
      <div>
        <div className="text-[10px] tracking-[0.3em] uppercase text-white/50">Legal</div>
        <h1 className="text-4xl font-light tracking-tight mt-2">Privacy Policy</h1>
        <p className="text-white/50 text-sm mt-3">Effective: June 1, 2025</p>
      </div>

      {/* Required verbatim clause — prominently displayed */}
      <div className="border-2 border-white/40 bg-neutral-950 p-6 shadow-[0_0_60px_rgba(255,255,255,0.04)]">
        <div className="text-[10px] tracking-[0.3em] uppercase text-white/60 mb-3">
          Our Privacy Promise
        </div>
        <p className="text-white text-base sm:text-lg leading-relaxed tracking-tight">
          We prioritize your privacy. All orders are shipped discreetly in plain packaging. Your
          credit card statement will show a charge from AW Holdings LLC.
        </p>
      </div>

      <section className="space-y-3 text-white/70 leading-relaxed">
        <h2 className="text-xl text-white font-light">1. Information We Collect</h2>
        <p>
          To fulfill your order and maintain a legal record of the transaction, we collect only the
          information strictly necessary: your name, shipping address, email, and payment
          authorization details. We do not retain your full card number — only the last four
          digits, for reference on your receipt.
        </p>
      </section>

      <section className="space-y-3 text-white/70 leading-relaxed">
        <h2 className="text-xl text-white font-light">2. How We Use It</h2>
        <p>
          Your information is used exclusively to process your order, ship your items in plain,
          unmarked packaging, and provide customer support. We do not sell, rent, or share your
          personal data with third parties for marketing purposes.
        </p>
      </section>

      <section className="space-y-3 text-white/70 leading-relaxed">
        <h2 className="text-xl text-white font-light">3. Discreet Shipping</h2>
        <p>
          Every order is dispatched in an opaque, unbranded outer box. There is no product name,
          product image, or company logo visible on the exterior. The return address uses a neutral
          descriptor consistent with{' '}
          <span className="text-white font-medium">AW Holdings LLC</span>.
        </p>
      </section>

      <section className="space-y-3 text-white/70 leading-relaxed">
        <h2 className="text-xl text-white font-light">4. Discreet Billing</h2>
        <p>
          Your credit card statement will show a charge from{' '}
          <span className="text-white font-medium">AW Holdings LLC</span>. The specific storefront
          name and the items purchased will not appear on your statement.
        </p>
      </section>

      <section className="space-y-3 text-white/70 leading-relaxed">
        <h2 className="text-xl text-white font-light">5. Cookies &amp; Session Data</h2>
        <p>
          We use a minimal amount of local browser storage to remember your age verification and
          keep your shopping bag in place between visits. This data stays on your device and is
          never sent to a marketing partner.
        </p>
      </section>

      <section className="space-y-3 text-white/70 leading-relaxed">
        <h2 className="text-xl text-white font-light">6. Your Rights</h2>
        <p>
          You may request access to, correction of, or deletion of your personal information at any
          time by writing to <span className="text-white">privacy@awholdings.example</span>.
          Depending on your jurisdiction, additional rights may apply under GDPR, CCPA, or similar
          laws.
        </p>
      </section>

      <section className="space-y-3 text-white/70 leading-relaxed">
        <h2 className="text-xl text-white font-light">7. Related Policies</h2>
        <p>
          See also our{' '}
          <Link href="/terms-of-service" className="underline text-white hover:text-white/80">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/refund-policy" className="underline text-white hover:text-white/80">
            Refund Policy
          </Link>
          .
        </p>
      </section>

      <section className="space-y-3 text-white/70 leading-relaxed">
        <h2 className="text-xl text-white font-light">8. Contact</h2>
        <p>AW Holdings LLC · 1209 Orange Street, Wilmington, DE 19801 · privacy@awholdings.example</p>
      </section>
    </article>
  )
}
