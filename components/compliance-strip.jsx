import { SITE_CONFIG } from '@/config/site'

export default function ComplianceStrip() {
  return (
    <section
      className="py-5 px-4"
      style={{
        backgroundColor: 'var(--bne-espresso, #14100d)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
      }}
      aria-label="Compliance and trust information"
    >
      <div className="mx-auto max-w-5xl">
        {/* Mobile: stacked, Desktop: row */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-10 gap-y-3 text-center">
          {/* 18+ Badge */}
          <div className="flex items-center gap-2" role="note">
            <span
              className="inline-flex items-center justify-center w-7 h-7 rounded-full text-[10px] font-bold"
              style={{
                backgroundColor: 'var(--bne-brass, var(--accent))',
                color: 'var(--bne-espresso, #14100d)',
              }}
              aria-label="Age restriction"
            >
              18+
            </span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Adults only
            </span>
          </div>

          {/* Billing descriptor */}
          <div>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Appears as <strong style={{ color: 'var(--bne-brass, var(--accent))', fontWeight: 600 }}>{SITE_CONFIG.billingDescriptor}</strong> on your statement
            </span>
          </div>

          {/* SSL Badge */}
          <div className="flex items-center gap-2">
            <svg
              width="12"
              height="14"
              viewBox="0 0 12 14"
              fill="none"
              aria-hidden="true"
              style={{ color: 'var(--bne-brass, var(--accent))' }}
            >
              <path
                d="M6 0L0 3v4c0 3.5 2.5 6.5 6 7 3.5-.5 6-3.5 6-7V3L6 0z"
                fill="currentColor"
                opacity="0.6"
              />
              <path
                d="M5 8L3.5 6.5 2.5 7.5 5 10l4-4-1-1L5 8z"
                fill="var(--bne-espresso, #14100d)"
              />
            </svg>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              256-bit SSL encrypted
            </span>
          </div>

          {/* Payment processor */}
          <div>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Checkout via {SITE_CONFIG.paymentProcessor}
            </span>
          </div>

          {/* Payment methods */}
          <div className="flex items-center gap-3" aria-label="Accepted payment methods">
            <span className="text-xs tracking-[0.1em] uppercase opacity-60" style={{ color: 'var(--text-muted)' }}>
              Visa
            </span>
            <span className="text-xs tracking-[0.1em] uppercase opacity-60" style={{ color: 'var(--text-muted)' }}>
              Mastercard
            </span>
            <span className="text-xs tracking-[0.1em] uppercase opacity-60" style={{ color: 'var(--text-muted)' }}>
              Amex
            </span>
            <span className="text-xs tracking-[0.1em] uppercase opacity-60" style={{ color: 'var(--text-muted)' }}>
              Discover
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
