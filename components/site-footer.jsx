import Link from 'next/link'

export default function SiteFooter() {
  return (
    <footer className="border-t border-border mt-auto">
      {/* Compliance banner — required bold discreet-billing text */}
      <div className="container pt-12">
        <div className="bg-card border border-border p-6 text-center">
          <p className="text-sm sm:text-base font-bold tracking-tight text-foreground">
            DISCREET SHIPPING &amp; BILLING: Your credit card statement will discreetly read as AW
            Holdings LLC.
          </p>
        </div>
      </div>

      {/* Compliance links row */}
      <div className="container pt-8">
        <nav
          aria-label="Compliance"
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[11px] tracking-[0.25em] uppercase"
        >
          <Link href="/terms-of-service" className="text-foreground/70 hover:text-foreground transition-colors">
            Terms of Service
          </Link>
          <span className="text-foreground/20" aria-hidden="true">•</span>
          <Link href="/refund-policy" className="text-foreground/70 hover:text-foreground transition-colors">
            Refund Policy
          </Link>
          <span className="text-foreground/20" aria-hidden="true">•</span>
          <Link href="/privacy-policy" className="text-foreground/70 hover:text-foreground transition-colors">
            Privacy Policy
          </Link>
        </nav>
      </div>

      <div className="container py-12 grid gap-8 sm:grid-cols-3 items-start">
        <div>
          <div className="text-xl font-light tracking-[0.35em]">AW</div>
          <p className="text-xs text-foreground/50 mt-3 max-w-xs leading-loose">
            AW Holdings LLC. A premium adult wellness house. Discreet, considered, adult.
          </p>
        </div>
        <div className="space-y-3 text-sm">
          <div className="text-foreground/50 text-[10px] tracking-[0.25em] uppercase mb-3">Legal</div>
          <div>
            <Link href="/terms-of-service" className="text-foreground/70 hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
          <div>
            <Link href="/refund-policy" className="text-foreground/70 hover:text-foreground transition-colors">
              Refund Policy
            </Link>
          </div>
          <div>
            <Link href="/privacy-policy" className="text-foreground/70 hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
        <div className="text-xs text-foreground/40 leading-relaxed">
          &copy; {new Date().getFullYear()} AW Holdings LLC.<br />
          All rights reserved. 18+ only.
        </div>
      </div>
    </footer>
  )
}
