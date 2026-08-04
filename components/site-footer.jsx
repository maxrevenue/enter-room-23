'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function SiteFooter() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) setSubmitted(true)
  }

  return (
    <footer
      className="w-full border-t mt-auto"
      style={{
        backgroundColor: 'var(--footer-bg)',
        borderColor: 'var(--border-soft)',
      }}
    >
      {/* ── Trust Badge Banner ── */}
      <div
        className="w-full py-3 sm:py-4 px-4 text-center border-b overflow-hidden relative"
        style={{
          borderColor: 'var(--border-soft)',
        }}
      >
        {/* Neon glow background line */}
        <div className="absolute left-0 right-0 top-0 h-[1px] pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, var(--divider-glow) 30%, var(--accent) 50%, var(--divider-glow) 70%, transparent 100%)',
          }}
        />

        <div className="flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-10 gap-y-1.5 text-[10px] sm:text-xs tracking-[0.15em] uppercase font-medium"
          style={{ color: 'var(--text-secondary)' }}
        >
          {[
            { icon: '✓', label: 'DISCREET PACKAGING' },
            { icon: '✓', label: 'PRIVATE BILLING' },
            { icon: '✓', label: 'SECURE CHECKOUT' },
          ].map((item) => (
            <span key={item.label} className="flex items-center gap-1.5 animate-fade-in">
              <span className="text-sm sm:text-base" style={{ color: 'var(--accent)' }}>
                {item.icon}
              </span>
              {item.label}
            </span>
          ))}
        </div>
      </div>

      {/* ── Main Footer Content ── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3
              className="font-syne text-lg font-bold tracking-[0.12em] uppercase mb-3"
              style={{ color: 'var(--accent)' }}
            >
              ROOM 23
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              An exclusive sanctuary for sensual well-being. Discover curated essentials for your private side.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className="font-syne text-xs font-semibold tracking-[0.15em] uppercase mb-4"
              style={{ color: 'var(--text-secondary)' }}
            >
              EXPLORE
            </h4>
            <ul className="space-y-2">
              {[
                { href: '/shop', label: 'Shop' },
                { href: '/archive', label: 'The Archive' },
                { href: '/vault', label: 'The Vault' },
                { href: '/essentials', label: 'Essentials' },
                { href: '/new', label: 'New Arrivals' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors duration-200 hover:text-[var(--accent)]"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4
              className="font-syne text-xs font-semibold tracking-[0.15em] uppercase mb-4"
              style={{ color: 'var(--text-secondary)' }}
            >
              SUPPORT
            </h4>
            <ul className="space-y-2">
              {[
                { href: '/faq', label: 'FAQ' },
                { href: '/shipping', label: 'Shipping & Returns' },
                { href: '/privacy', label: 'Privacy Policy' },
                { href: '/terms', label: 'Terms of Service' },
                { href: '/contact', label: 'Contact Us' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors duration-200 hover:text-[var(--accent)]"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4
              className="font-syne text-xs font-semibold tracking-[0.15em] uppercase mb-4"
              style={{ color: 'var(--text-secondary)' }}
            >
              STAY CONNECTED
            </h4>
            <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>
              Private previews, member-only offers, and exclusive collections.
            </p>
            {submitted ? (
              <p
                className="text-sm font-medium animate-fade-in py-2"
                style={{ color: 'var(--accent)' }}
              >
                You&rsquo;re on the list.
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  required
                  className="flex-1 px-3 py-2 text-sm rounded-md border transition-all duration-300 outline-none focus:border-[var(--border-glow)] focus:shadow-[var(--neon-glow-sm)]"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-accent)',
                    color: 'var(--text-primary)',
                  }}
                />
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold tracking-[0.1em] uppercase rounded-md border transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.97]"
                  style={{
                    borderColor: 'var(--button-border)',
                    backgroundColor: 'var(--button-bg)',
                    color: 'var(--accent)',
                  }}
                >
                  JOIN
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div
        className="border-t py-4 px-4 sm:px-6"
        style={{ borderColor: 'var(--border-soft)' }}
      >
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-2 text-xs"
          style={{ color: 'var(--text-muted)' }}
        >
          <span>&copy; {new Date().getFullYear()} Room 23. All rights reserved.</span>
          <span>DISCREET · CURATED · EXCLUSIVE</span>
        </div>
      </div>
    </footer>
  )
}
