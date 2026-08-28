import Link from 'next/link'
import { Lock, ShieldCheck } from 'lucide-react'
import { siteConfig } from '@/lib/config'

type CheckoutDisclaimerProps = {
  agreedToTerms?: boolean
  onAgreedChange?: (checked: boolean) => void
  showCheckbox?: boolean
}

export default function CheckoutDisclaimer({
  agreedToTerms = false,
  onAgreedChange,
  showCheckbox = false,
}: CheckoutDisclaimerProps) {
  return (
    <div className="checkout-trust-card">
      <div className="flex items-start gap-3">
        <Lock className="mt-0.5 h-4 w-4 shrink-0 text-theme-muted" aria-hidden="true" />
        <div className="space-y-3 text-sm leading-relaxed text-theme-muted">
          <p>
            <span className="font-medium text-theme-text/90">Discreet &amp; secure.</span>{' '}
            Card data is entered on CCBill&apos;s hosted payment page — never on room23.net.
          </p>
          <p>
            Your statement will show{' '}
            <span className="inline-flex items-center rounded-sm border border-theme-border bg-theme-bg px-2 py-0.5 font-mono text-xs text-theme-text">
              {siteConfig.billingDescriptor}
            </span>
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-theme-muted">
            <span className="inline-flex items-center gap-1">
              <Lock className="h-3 w-3" aria-hidden="true" />
              256-bit SSL
            </span>
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" aria-hidden="true" />
              PCI via CCBill
            </span>
          </div>
        </div>
      </div>

      {showCheckbox && onAgreedChange && (
        <label
          className={`mt-4 flex min-h-11 cursor-pointer items-start gap-3 rounded-md border p-3 transition-colors duration-150 ${
            agreedToTerms
              ? 'border-theme-accent/50 bg-theme-accent/5'
              : 'border-theme-border bg-theme-bg/40'
          }`}
        >
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => onAgreedChange(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-[hsl(var(--primary))]"
          />
          <span className="text-xs leading-5 text-theme-muted">
            I am <strong className="text-theme-text/90">18+ years old</strong> and agree to the{' '}
            <Link href="/terms" target="_blank" className="link-brass">
              Terms
            </Link>{' '}
            and{' '}
            <Link href="/privacy" target="_blank" className="link-brass">
              Privacy Policy
            </Link>
            .
          </span>
        </label>
      )}
    </div>
  )
}
