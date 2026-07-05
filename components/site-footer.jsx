import Link from 'next/link'

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10 mt-auto">
      <div className="container pt-8">
        <div className="bg-neutral-950 border border-white/15 p-5 text-center">
          <p className="text-sm sm:text-base font-bold tracking-tight text-white">
            DISCREET SHIPPING &amp; BILLING: Your credit card statement will discreetly read as AW Holdings LLC.
          </p>
        </div>
      </div>
      <div className="container py-8 grid gap-6 sm:grid-cols-3 items-start">
        <div>
          <div className="text-lg font-light tracking-[0.3em]">AW</div>
          <p className="text-xs text-white/40 mt-2 max-w-xs leading-relaxed">
            AW Holdings LLC. A premium adult wellness house. Discreet, considered, adult.
          </p>
        </div>
        <div className="space-y-2 text-sm">
          <div className="text-white/50 text-xs tracking-[0.2em] uppercase mb-2">Legal</div>
          <div>
            <Link href="/terms" className="text-white/70 hover:text-white">Terms of Service</Link>
          </div>
          <div>
            <Link href="/refund-policy" className="text-white/70 hover:text-white">Refund Policy</Link>
          </div>
        </div>
        <div className="text-xs text-white/40">
          &copy; {new Date().getFullYear()} AW Holdings LLC. All rights reserved. 18+ only.
        </div>
      </div>
    </footer>
  )
}
