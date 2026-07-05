import Link from 'next/link'

export const metadata = { title: 'Refund Policy — AW Holdings LLC' }

export default function RefundPolicyPage() {
  return (
    <article className="container max-w-3xl py-16 space-y-8 flex-1">
      <div>
        <div className="text-[10px] tracking-[0.3em] uppercase text-white/50">Legal</div>
        <h1 className="text-4xl font-light tracking-tight mt-2">Refund Policy</h1>
        <p className="text-white/50 text-sm mt-3">Effective: June 1, 2025</p>
      </div>

      {/* Prominent policy statement — required verbatim text */}
      <div className="border-2 border-white/40 bg-neutral-950 p-6 shadow-[0_0_60px_rgba(255,255,255,0.04)]">
        <div className="text-[10px] tracking-[0.3em] uppercase text-white/60 mb-3">
          Our Refund Policy
        </div>
        <p className="text-white text-base sm:text-lg leading-relaxed tracking-tight">
          Due to the intimate nature of our products and strict hygiene standards, we do not accept
          returns or exchanges on any opened or used items. Unopened items may be returned within
          14 days.
        </p>
        <p className="text-white text-base sm:text-lg leading-relaxed tracking-tight mt-4">
          <span className="font-bold">Chargeback Policy:</span> We take credit card fraud
          seriously. Contact us directly to resolve issues before contacting your bank.
        </p>
      </div>

      <section className="space-y-3 text-white/70 leading-relaxed">
        <h2 className="text-xl text-white font-light">1. Non-Returnable Items (Final Sale)</h2>
        <p>
          Any product that has been opened, unsealed, or used is FINAL SALE and cannot be returned,
          exchanged, or refunded under any circumstance. This includes but is not limited to:
        </p>
        <ul className="list-disc pl-6 space-y-1 marker:text-white/40">
          <li>All personal-use silicone, glass, metal, or textile products intended for intimate contact (including wands, massagers, and similar wellness objects).</li>
          <li>Wearables such as blindfolds, restraints, and apparel that come into direct contact with the skin.</li>
          <li>Lubricants, oils, balms, and any topical or consumable products.</li>
          <li>Items whose factory hygiene seal has been broken, removed, or tampered with.</li>
          <li>Printed matter, including magazines and journals, once dispatched.</li>
        </ul>
      </section>

      <section className="space-y-3 text-white/70 leading-relaxed">
        <h2 className="text-xl text-white font-light">2. Unopened Item Returns (14-Day Window)</h2>
        <p>
          Unopened items in their original, factory-sealed packaging may be returned for a refund
          within <span className="text-white font-medium">14 days</span> of the delivery date.
          Return shipping is the responsibility of the customer, and items must arrive in resalable
          condition. Contact <span className="text-white">care@awholdings.example</span> with your
          order number to initiate a return.
        </p>
      </section>

      <section className="space-y-3 text-white/70 leading-relaxed">
        <h2 className="text-xl text-white font-light">3. Damaged or Defective Items</h2>
        <p>
          If your item arrives with a manufacturing defect or shipping damage that renders it
          unusable, you must notify us within <span className="text-white font-medium">48 hours</span>{' '}
          of delivery at <span className="text-white">care@awholdings.example</span> with
          photographic evidence and your order number. Approved cases will receive a replacement of
          the same item or a store credit.
        </p>
      </section>

      <section className="space-y-3 text-white/70 leading-relaxed">
        <h2 className="text-xl text-white font-light">4. Order Cancellations</h2>
        <p>
          Orders may be cancelled for a full refund only if the request is received before the
          order enters our fulfillment workflow (typically within 60 minutes of placement). Once
          packed, orders cannot be recalled.
        </p>
      </section>

      <section className="space-y-3 text-white/70 leading-relaxed">
        <h2 className="text-xl text-white font-light">5. Chargebacks</h2>
        <p>
          As stated above, we take credit card fraud seriously and ask that you contact us directly
          before initiating a chargeback with your bank. Fraudulent chargebacks on delivered,
          non-returnable hygiene items will be contested with delivery evidence, this policy, and
          your signed order confirmation. Your statement will appear as{' '}
          <span className="text-white font-medium">AW Holdings LLC</span>.
        </p>
      </section>

      <section className="space-y-3 text-white/70 leading-relaxed">
        <h2 className="text-xl text-white font-light">6. Acknowledgment</h2>
        <p>
          By completing checkout, you acknowledge that you have read, understood, and expressly
          agree to this hygiene-based Refund Policy, and to our{' '}
          <Link href="/terms-of-service" className="underline text-white hover:text-white/80">
            Terms of Service
          </Link>
          .
        </p>
      </section>
    </article>
  )
}
