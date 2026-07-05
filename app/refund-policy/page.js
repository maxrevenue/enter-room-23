import Link from 'next/link'

export const metadata = { title: 'Refund Policy — AW Holdings LLC' }

export default function RefundPolicyPage() {
  return (
    <article className="container max-w-3xl py-20 sm:py-28 space-y-12 flex-1">
      <div>
        <div className="text-[10px] tracking-[0.35em] uppercase text-foreground/50">Legal</div>
        <h1 className="text-4xl sm:text-5xl font-light tracking-tight mt-3">
          <span className="font-serif italic">Refund</span> Policy
        </h1>
        <p className="text-foreground/50 text-sm mt-4">Effective: June 1, 2025</p>
      </div>

      <div className="border border-foreground/30 bg-card p-8">
        <div className="text-[10px] tracking-[0.3em] uppercase text-foreground/60 mb-4">
          Our Refund Policy
        </div>
        <p className="text-foreground text-base sm:text-lg leading-loose tracking-tight">
          Due to hygiene standards, all sales are final. Unopened items may be returned within 14
          days. If an item arrives defective, contact support for a replacement.
        </p>
      </div>

      <section className="space-y-4 text-foreground/75 leading-loose">
        <h2 className="text-xl sm:text-2xl text-foreground font-light tracking-tight">1. Final Sale Items</h2>
        <p>
          Any product that has been opened, unsealed, or used is FINAL SALE and cannot be returned,
          exchanged, or refunded under any circumstance. This is a strict hygiene requirement.
        </p>
        <ul className="list-disc pl-6 space-y-2 marker:text-foreground/40">
          <li>All personal-use silicone, glass, metal, or textile products intended for intimate contact.</li>
          <li>Wearables such as blindfolds, restraints, and apparel that come into direct contact with the skin.</li>
          <li>Lubricants, oils, balms, and any topical or consumable products.</li>
          <li>Items whose factory hygiene seal has been broken, removed, or tampered with.</li>
          <li>Printed matter, including magazines and journals, once dispatched.</li>
        </ul>
      </section>

      <Section title="2. Unopened Item Returns (14-Day Window)">
        Unopened items in their original, factory-sealed packaging may be returned for a refund
        within <span className="text-foreground font-medium">14 days</span> of the delivery date.
        Return shipping is the responsibility of the customer, and items must arrive in resalable
        condition. Email <span className="text-foreground">care@awholdings.example</span> with your
        order number to initiate a return.
      </Section>

      <Section title="3. Defective Items">
        If your item arrives defective, contact support for a replacement. Notify us within{' '}
        <span className="text-foreground font-medium">48 hours</span> of delivery at{' '}
        <span className="text-foreground">care@awholdings.example</span> with photographic
        evidence and your order number. Approved cases receive a replacement of the same item or
        store credit.
      </Section>

      <Section title="4. Order Cancellations">
        Orders may be cancelled for a full refund only if the request is received before the order
        enters our fulfillment workflow (typically within 60 minutes of placement). Once packed,
        orders cannot be recalled.
      </Section>

      <Section title="5. Chargebacks">
        We take credit card fraud seriously. Please contact us directly to resolve issues before
        contacting your bank. Your statement will appear as{' '}
        <span className="text-foreground font-medium">AW Holdings LLC</span>.
      </Section>

      <Section title="6. Acknowledgment">
        By completing checkout, you acknowledge that you have read and agree to this Refund Policy
        and to our{' '}
        <Link href="/terms-of-service" className="underline text-foreground hover:text-foreground/80">
          Terms of Service
        </Link>
        .
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
