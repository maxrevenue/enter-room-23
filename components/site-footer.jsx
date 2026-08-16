'use client'

import Link from 'next/link'
import BrandLogo from '@/components/brand-logo'
import { SITE_CONFIG } from '@/config/site'

export default function SiteFooter() {
  return (
    <footer
      className="border-t py-16 sm:py-24 px-4 sm:px-6"
      style={{
        backgroundColor: 'var(--color-bg-primary)',
        borderColor: 'rgba(200,16,46,0.15)',
      }}
    >
      <div className="mx-auto max-w-4xl flex flex-col items-center justify-center">

        <div className="mb-8">
          <BrandLogo size="lg" />
        </div>

        {/* Tagline */}
        <p
          className="text-xs tracking-[0.2em] uppercase mb-8 text-center"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Considered pleasure. Private delivery.
        </p>

        {/* Crimson divider */}
        <div
          className="w-24 h-px mb-8"
          style={{ background: 'linear-gradient(90deg, transparent, #C8102E, transparent)' }}
        />

        <p
          className="text-[11px] tracking-[0.08em] uppercase mb-10 text-center max-w-sm"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {SITE_CONFIG.softLaunch
            ? 'Browsing is open. Checkout follows shortly.'
            : 'Questions? Reach us at support@room23.net'}
        </p>

        {/* ── Nav Links ── */}
        <div className="flex items-center flex-wrap justify-center gap-6 md:gap-10 mb-12">
          {[
            { href: '/shop', label: 'SHOP' },
            { href: '/journal', label: 'JOURNAL' },
            { href: '/faq', label: 'FAQ' },
            { href: '/contact', label: 'CONTACT' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-xs tracking-[0.2em] uppercase font-semibold transition-colors duration-200"
              style={{ color: 'var(--color-text-secondary)' }}
              onMouseOver={e => e.currentTarget.style.color = '#C8102E'}
              onMouseOut={e => e.currentTarget.style.color = 'var(--color-text-secondary)'}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* ── Legal strip ── */}
        <div className="flex flex-col md:flex-row items-center gap-3 md:gap-8 text-center">
          <span style={{ color: '#3A3A3C', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            &copy; {new Date().getFullYear()} Room 23. All rights reserved.
          </span>
          <div className="flex items-center gap-5">
            {[
              { href: '/about', label: 'ABOUT' },
              { href: '/privacy', label: 'PRIVACY' },
              { href: '/terms', label: 'TERMS' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="transition-colors duration-200"
                style={{ color: '#3A3A3C', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase' }}
                onMouseOver={e => e.currentTarget.style.color = '#C8102E'}
                onMouseOut={e => e.currentTarget.style.color = '#3A3A3C'}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  )
}
