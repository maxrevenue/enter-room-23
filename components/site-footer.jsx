import Link from 'next/link'
import BrandLogo from '@/components/brand-logo'
import { SITE_CONFIG } from '@/config/site'

const PRIMARY_LINKS = [
  { href: '/shop', label: 'Shop' },
  { href: '/journal', label: 'Journal' },
  { href: '/about', label: 'About' },
  { href: '/shipping', label: 'Shipping' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
]

const TRUST_SIGNALS = [
  'Body-safe',
  'Discreet packaging',
  'Private billing',
  'Secure checkout',
]

export default function SiteFooter() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <div className="mb-8">
          <BrandLogo size="lg" />
        </div>

        <p className="mb-8 text-xs uppercase tracking-[0.22em] text-zinc-500">
          Considered pleasure.
        </p>

        <ul className="mb-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10px] uppercase tracking-[0.2em] text-zinc-500">
          {TRUST_SIGNALS.map((signal) => (
            <li key={signal}>{signal}</li>
          ))}
        </ul>

        <nav
          aria-label="Footer"
          className="mb-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-3"
        >
          {PRIMARY_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-400 transition-colors hover:text-white"
            >
              {label}
            </Link>
          ))}
        </nav>

        <p className="max-w-sm text-[11px] leading-relaxed text-zinc-600">
          {SITE_CONFIG.legalName}
          <br />
          {SITE_CONFIG.bizAddressFull}
          <br />
          {SITE_CONFIG.supportEmail}
        </p>

        <p className="mt-8 text-[10px] uppercase tracking-[0.16em] text-zinc-600">
          &copy; {new Date().getFullYear()} {SITE_CONFIG.legalName}. Adults 18+ only.
          <br className="sm:hidden" />{' '}
          Charges appear as {SITE_CONFIG.billingDescriptor}.
        </p>
      </div>
    </footer>
  )
}
