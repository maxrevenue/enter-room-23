import Link from 'next/link'
import { SITE_CONFIG } from '@/config/site'
import { ShieldCheck, Truck, CreditCard } from 'lucide-react'

export default function SiteFooter() {
  return (
    <footer
      className="border-t px-4 py-14 sm:py-20"
      style={{
        backgroundColor: 'var(--bg-elevated, var(--bg-surface))',
        borderColor: 'var(--border)',
      }}
    >
      <div className="mx-auto max-w-5xl">
        {/* ── Top: Logo + Short descriptor ── */}
        <div className="text-center mb-12 sm:mb-14">
          <p
            className="font-syne text-xl font-bold tracking-[0.15em] uppercase mb-3"
            style={{ color: 'var(--accent)' }}
          >
            {SITE_CONFIG.name}
          </p>
          <p
            className="text-sm max-w-sm mx-auto"
            style={{ color: 'var(--text-secondary)' }}
          >
            Discreet delivery. Private billing. Curated for adults 18+ only.
          </p>
        </div>

        {/* ── Middle: Three Columns ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12 text-center sm:text-left">
          {/* Support */}
          <div>
            <h4
              className="font-syne text-sm font-semibold tracking-[0.1em] uppercase mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              Support
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/faq"
                  className="text-sm transition-colors duration-200 hover:text-[var(--accent)]"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-sm transition-colors duration-200 hover:text-[var(--accent)]"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Shipping
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm transition-colors duration-200 hover:text-[var(--accent)]"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/journal"
                  className="text-sm transition-colors duration-200 hover:text-[var(--accent)]"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  The Column
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4
              className="font-syne text-sm font-semibold tracking-[0.1em] uppercase mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              Legal
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/terms"
                  className="text-sm transition-colors duration-200 hover:text-[var(--accent)]"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm transition-colors duration-200 hover:text-[var(--accent)]"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4
              className="font-syne text-sm font-semibold tracking-[0.1em] uppercase mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              {SITE_CONFIG.legalName}
            </h4>
            <p
              className="text-sm leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              {SITE_CONFIG.bizStreet}
              <br />
              {SITE_CONFIG.bizCityState}
              <br />
              {SITE_CONFIG.location}
            </p>
            <p
              className="text-sm mt-3"
              style={{ color: 'var(--text-secondary)' }}
            >
              {SITE_CONFIG.supportEmail}
            </p>
            <p
              className="text-sm mt-1"
              style={{ color: 'var(--text-secondary)' }}
            >
              {SITE_CONFIG.supportPhone}
            </p>
            <p
              className="text-xs mt-0.5"
              style={{ color: 'var(--text-muted)' }}
            >
              {SITE_CONFIG.hours}
            </p>
          </div>
        </div>

        {/* ── Trust Strip ── */}
        <div
          className="flex flex-wrap justify-center gap-6 sm:gap-8 mb-10 py-4 border-y text-xs"
          style={{
            borderColor: 'var(--border)',
            color: 'var(--text-muted)',
          }}
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" style={{ color: 'var(--accent)' }} />
            <span>Discreet Packaging</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4" style={{ color: 'var(--accent)' }} />
            <span>{SITE_CONFIG.carriers.join(' / ')}</span>
          </div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" style={{ color: 'var(--accent)' }} />
            <span>Bills as {SITE_CONFIG.billingDescriptor}</span>
          </div>
        </div>

        {/* ── Bottom ── */}
        <p
          className="text-xs text-center"
          style={{ color: 'var(--text-muted)' }}
        >
          &copy; {new Date().getFullYear()} {SITE_CONFIG.legalName}. All rights reserved.
          <br />
          <span className="opacity-60">
            Last updated: {SITE_CONFIG.legalLastUpdated}
          </span>
        </p>
      </div>
    </footer>
  )
}
