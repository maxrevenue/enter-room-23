import Link from 'next/link'

export const metadata = { title: 'Refund Policy — AW Holdings LLC' }

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10">
        <div className="container h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-light tracking-[0.4em]">AW</Link>
          <Link href="/" className="text-xs tracking-[0.2em] uppercase text-white/60 hover:text-white">← Back to shop</Link>
        </div>
      </header>

      <article className="container max-w-3xl py-16 space-y-8">
        <div>
          <div className="text-[10px] tracking-[0.3em] uppercase text-white/50">Legal</div>
          <h1 className="text-4xl font-light tracking-tight mt-2">Refund Policy</h1>
          <p className="text-white/50 text-sm mt-3">Effective: June 1, 2025</p>
        </div>

        <div className="border border-white/20 bg-neutral-950 p-5">
          <p className="font-bold text-white text-sm sm:text-base">
            HYGIENE NOTICE: For the health and safety of every customer, all intimate-use and personal-care
            products are FINAL SALE and STRICTLY NON-RETURNABLE once the outer packaging seal has been broken
            or the item has left our fulfillment center.
          </p>
        </div>

        <section className="space-y-3 text-white/70 leading-relaxed">
          <h2 className="text-xl text-white font-light">1. Non-Returnable Items (Final Sale)</h2>
          <p>Due to hygiene, health, and safety regulations, the following categories cannot be returned, exchanged, or refunded under any circumstance once shipped:</p>
          <ul className="list-disc pl-6 space-y-1 marker:text-white/40">
            <li>All personal-use silicone, glass, metal, or textile products intended for intimate contact (including but not limited to wands, massagers, and similar wellness objects).</li>
            <li>Wearables such as blindfolds, restraints, and apparel that come into direct contact with the skin.</li>
            <li>Lubricants, oils, balms, and any topical or consumable products.</li>
            <li>Items whose factory hygiene seal has been broken, removed, or tampered with.</li>
            <li>Printed matter, including magazines and journals, once dispatched.</li>
          </ul>
        </section>

        <section className="space-y-3 text-white/70 leading-relaxed">
          <h2 className="text-xl text-white font-light">2. Damaged or Defective Items</h2>
          <p>
            If your item arrives with a manufacturing defect or shipping damage that renders it unusable,
            you must notify us within <span className="text-white font-medium">48 hours</span> of delivery at{' '}
            <span className="text-white">care@awholdings.example</span> with photographic evidence and your order number.
            Approved cases will receive a replacement of the same item or a store credit — cash refunds are issued only
            when a replacement is unavailable.
          </p>
        </section>

        <section className="space-y-3 text-white/70 leading-relaxed">
          <h2 className="text-xl text-white font-light">3. Order Cancellations</h2>
          <p>
            Orders may be cancelled for a full refund only if the request is received before the order enters our
            fulfillment workflow (typically within 60 minutes of placement). Once packed, orders cannot be recalled.
          </p>
        </section>

        <section className="space-y-3 text-white/70 leading-relaxed">
          <h2 className="text-xl text-white font-light">4. Chargebacks</h2>
          <p>
            We ask that you contact us before initiating a chargeback. Fraudulent chargebacks on delivered,
            non-returnable hygiene items will be contested with delivery evidence, this policy, and your signed
            order confirmation. Your statement will appear as{' '}
            <span className="text-white font-medium">AW Holdings LLC</span>.
          </p>
        </section>

        <section className="space-y-3 text-white/70 leading-relaxed">
          <h2 className="text-xl text-white font-light">5. Acknowledgment</h2>
          <p>
            By completing checkout, you acknowledge that you have read, understood, and expressly agree to this
            hygiene-based non-returnable Refund Policy, and to our{' '}
            <Link href="/terms" className="underline text-white hover:text-white/80">Terms of Service</Link>.
          </p>
        </section>
      </article>

      <footer className="border-t border-white/10">
        <div className="container py-8 text-xs text-white/40">
          © {new Date().getFullYear()} AW Holdings LLC. 18+ only.
        </div>
      </footer>
    </main>
  )
}
