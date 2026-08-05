'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/lib/cart-context'
import { ShoppingBag, Archive, Key, ArrowRight } from 'lucide-react'

const COLLECTION_CARDS = [
  {
    href: '/shop',
    icon: ShoppingBag,
    title: 'SHOP',
    subtitle: 'Curated Essentials',
    description: 'Explore our full collection of premium adult wellness products.',
    glowColor: 'var(--accent)',
  },
  {
    href: '/faq',
    icon: Archive,
    title: 'FAQ',
    subtitle: 'Get Answers',
    description: 'Billing, shipping, age verification — everything you need to know.',
    glowColor: 'var(--color-brass)',
  },
  {
    href: '/contact',
    icon: Key,
    title: 'CONTACT',
    subtitle: 'We\'re Here',
    description: 'Reach our support team for discreet, private assistance.',
    glowColor: 'var(--accent)',
  },
]

export default function HomePage() {
  const { ageVerified, mounted } = useCart()
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    if (mounted && ageVerified) {
      const timer = setTimeout(() => setShowContent(true), 100)
      return () => clearTimeout(timer)
    }
  }, [mounted, ageVerified])

  if (!mounted || !ageVerified) return null

  return (
    <main
      className={`flex-1 transition-opacity duration-700 ${showContent ? 'opacity-100' : 'opacity-0'}`}
      style={{ backgroundColor: 'var(--bg-base)' }}
    >
      {/* ── Welcome Section ── */}
      <section className="relative px-4 py-12 sm:py-16 md:py-20 text-center overflow-hidden">
        {/* Ambient light leaks */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[50%] h-full opacity-[0.04]"
            style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(255,0,51,0.6) 0%, transparent 70%)' }}
          />
        </div>

        <h2
          className="font-syne text-2xl sm:text-3xl md:text-4xl font-bold tracking-[0.12em] uppercase mb-3 animate-fade-in-up"
          style={{ color: 'var(--text-primary)' }}
        >
          Welcome to <span style={{ color: 'var(--accent)' }}>Room 23</span>
        </h2>
        <p
          className="max-w-xl mx-auto text-sm sm:text-base animate-fade-in-up delay-100"
          style={{ color: 'var(--text-secondary)', letterSpacing: '0.05em' }}
        >
          Explore our curated collections of sensual wellness essentials — designed for those who appreciate discretion, quality, and exclusivity.
        </p>

        <hr className="neon-divider my-8 sm:my-10 max-w-md mx-auto" />
      </section>

      {/* ── Collection Cards Grid ── */}
      <section className="px-4 sm:px-6 pb-12 sm:pb-16 md:pb-20">
        <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {COLLECTION_CARDS.map((card, i) => (
            <Link
              key={card.href}
              href={card.href}
              className="glass-card glass-card-hover group relative flex flex-col items-center text-center p-6 sm:p-8 animate-fade-in-up cursor-pointer select-none"
              style={{ animationDelay: `${0.2 + i * 0.1}s`, opacity: 0 }}
            >
              {/* Top accent line */}
              <div
                className="absolute top-0 left-6 right-6 h-[1px] transition-all duration-500 group-hover:left-3 group-hover:right-3"
                style={{ backgroundColor: card.glowColor, opacity: 0.3 }}
              />

              {/* Icon with glow ring */}
              <div className="relative mb-5 mt-2">
                <div
                  className="absolute inset-0 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ backgroundColor: card.glowColor, opacity: 0.15 }}
                />
                <div
                  className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center border transition-all duration-500 group-hover:shadow-[var(--neon-glow-sm)]"
                  style={{
                    borderColor: 'var(--border-accent)',
                    backgroundColor: 'var(--bg-surface)',
                  }}
                >
                  <card.icon
                    className="w-6 h-6 sm:w-7 sm:h-7 transition-colors duration-500 group-hover:scale-110"
                    style={{ color: card.glowColor }}
                  />
                </div>
              </div>

              {/* Title */}
              <h3
                className="font-syne text-lg sm:text-xl font-bold tracking-[0.1em] uppercase mb-1"
                style={{ color: 'var(--text-primary)' }}
              >
                {card.title}
              </h3>

              {/* Subtitle */}
              <p
                className="text-xs font-medium tracking-[0.15em] uppercase mb-3"
                style={{ color: card.glowColor }}
              >
                {card.subtitle}
              </p>

              {/* Description */}
              <p
                className="text-sm leading-relaxed mb-5"
                style={{ color: 'var(--text-muted)' }}
              >
                {card.description}
              </p>

              {/* CTA arrow */}
              <div
                className="mt-auto flex items-center gap-2 text-xs font-semibold tracking-[0.12em] uppercase transition-all duration-300 group-hover:gap-3"
                style={{ color: card.glowColor }}
              >
                EXPLORE <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
              </div>

              {/* Bottom accent line */}
              <div
                className="absolute bottom-0 left-6 right-6 h-[1px] transition-all duration-500 group-hover:left-3 group-hover:right-3"
                style={{ backgroundColor: card.glowColor, opacity: 0.2 }}
              />
            </Link>
          ))}
        </div>
      </section>

      {/* ── Trust Badge Section (inline) ── */}
      <section
        className="px-4 sm:px-6 pb-12 sm:pb-16"
        style={{ backgroundColor: 'var(--bg-surface)' }}
      >
        <div className="mx-auto max-w-5xl">
          <div
            className="glass-card p-6 sm:p-8 text-center animate-fade-in-up"
            style={{ animationDelay: '0.5s', opacity: 0 }}
          >
            <div className="flex flex-wrap items-center justify-center gap-x-8 sm:gap-x-12 gap-y-3 mb-6">
              {[
                { title: 'Discreet', desc: 'Plain packaging, private billing' },
                { title: 'Curated', desc: 'Hand-selected premium products' },
                { title: 'Exclusive', desc: 'Member-only collections & access' },
              ].map((trait) => (
                <div key={trait.title} className="text-center">
                  <p
                    className="text-sm font-syne font-bold tracking-[0.1em] uppercase mb-0.5"
                    style={{ color: 'var(--accent)' }}
                  >
                    {trait.title}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {trait.desc}
                  </p>
                </div>
              ))}
            </div>

            <hr className="neon-divider mb-5" />

            <p
              className="text-sm max-w-lg mx-auto"
              style={{ color: 'var(--text-secondary)' }}
            >
              Room 23 is a private sanctuary. Every order is handled with absolute confidentiality. Your privacy is our priority.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
