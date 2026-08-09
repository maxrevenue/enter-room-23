'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/lib/cart-context'
import { ShoppingBag, Archive, Key, ArrowRight } from 'lucide-react'
import EditorChoice from '@/components/editor-choice'
import BrandPhilosophy from '@/components/brand-philosophy'
import TheColumn from '@/components/the-column'
import VipWaitlist from '@/components/vip-waitlist'
import ComplianceStrip from '@/components/compliance-strip'

const COLLECTION_CARDS = [
  {
    href: '/shop',
    icon: ShoppingBag,
    title: 'SHOP',
    subtitle: 'Curated Essentials',
    description: 'Explore our full collection of premium adult wellness products.',
    glowColor: 'var(--bne-brass, var(--accent))',
  },
  {
    href: '/faq',
    icon: Archive,
    title: 'FAQ',
    subtitle: 'Get Answers',
    description: 'Billing, shipping, age verification — everything you need to know.',
    glowColor: 'var(--bne-brass, var(--accent))',
  },
  {
    href: '/contact',
    icon: Key,
    title: 'CONTACT',
    subtitle: "We're Here",
    description: 'Reach our support team for discreet, private assistance.',
    glowColor: 'var(--bne-brass, var(--accent))',
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
    <div
      className={`flex-1 transition-opacity duration-700 ${showContent ? 'opacity-100' : 'opacity-0'}`}
      style={{ backgroundColor: 'var(--bg-base)' }}
    >
      {/* ═══════════════════════════════════════════════════════
          1. HERO / WELCOME
          ═══════════════════════════════════════════════════════ */}
      <section
        className="relative px-4 py-14 sm:py-20 md:py-24 text-center overflow-hidden"
        aria-label="Welcome to Room 23"
        style={{ backgroundColor: 'var(--bg-base)' }}
      >
        {/* Ambient brass glow */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div
            className="absolute top-0 left-1/4 w-[60%] h-full opacity-[0.04]"
            style={{
              background: 'radial-gradient(ellipse at 50% 0%, var(--bne-brass, #c8a34e) 0%, transparent 70%)',
            }}
          />
        </div>

        <h1
          className="font-syne text-3xl sm:text-4xl md:text-5xl font-bold tracking-[0.12em] uppercase mb-4 animate-fade-in-up"
          style={{ color: 'var(--text-primary)' }}
        >
          Welcome to{' '}
          <span style={{ color: 'var(--bne-brass, var(--accent))' }}>Room 23</span>
        </h1>
        <p
          className="max-w-xl mx-auto text-sm sm:text-base animate-fade-in-up leading-relaxed"
          style={{ color: 'var(--text-secondary)', letterSpacing: '0.05em', animationDelay: '0.1s' }}
        >
          Considered pleasure. Discreet delivery. — Exclusive collections for those who appreciate
          refinement behind closed doors.
        </p>

        <div
          className="mx-auto mt-8 h-[1px] max-w-xs"
          style={{
            background: 'linear-gradient(90deg, transparent, var(--bne-brass, var(--accent)), transparent)',
          }}
        />
      </section>

      {/* ═══════════════════════════════════════════════════════
          2. EDITOR'S CHOICE / PRODUCT OF THE MONTH
          ═══════════════════════════════════════════════════════ */}
      <EditorChoice />

      {/* ═══════════════════════════════════════════════════════
          3. COLLECTION CARDS GRID
          ═══════════════════════════════════════════════════════ */}
      <section
        className="px-4 sm:px-6 pb-12 sm:pb-16"
        aria-label="Collections"
        style={{ backgroundColor: 'var(--bg-base)' }}
      >
        <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {COLLECTION_CARDS.map((card, i) => (
            <Link
              key={card.href}
              href={card.href}
              className="group relative flex flex-col items-center text-center p-6 sm:p-8 cursor-pointer transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)',
                animationDelay: `${0.2 + i * 0.1}s`,
                opacity: 0,
              }}
              aria-label={`Go to ${card.title} — ${card.subtitle}`}
            >
              {/* Top brass accent line */}
              <div
                className="absolute top-0 left-6 right-6 h-[1px] transition-all duration-500 group-hover:left-3 group-hover:right-3"
                style={{ backgroundColor: card.glowColor, opacity: 0.3 }}
              />

              {/* Icon */}
              <div className="relative mb-5 mt-2">
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center border transition-all duration-500 group-hover:shadow-[0_0_16px_var(--bne-brass-glow,rgba(200,163,78,0.2))]"
                  style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-elevated)' }}
                >
                  <card.icon className="w-6 h-6 sm:w-7 sm:h-7 transition-transform duration-300 group-hover:scale-110"
                    style={{ color: card.glowColor }}
                    aria-hidden="true"
                  />
                </div>
              </div>

              <h3 className="font-syne text-lg sm:text-xl font-bold tracking-[0.1em] uppercase mb-1"
                style={{ color: 'var(--text-primary)' }}
              >
                {card.title}
              </h3>
              <p className="text-xs font-semibold tracking-[0.15em] uppercase mb-3"
                style={{ color: card.glowColor }}
              >
                {card.subtitle}
              </p>
              <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-muted)' }}>
                {card.description}
              </p>
              <div className="mt-auto flex items-center gap-2 text-xs font-semibold tracking-[0.12em] uppercase transition-all duration-300 group-hover:gap-3"
                style={{ color: card.glowColor }}
              >
                EXPLORE <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" aria-hidden="true" />
              </div>

              <div className="absolute bottom-0 left-6 right-6 h-[1px] transition-all duration-500 group-hover:left-3 group-hover:right-3"
                style={{ backgroundColor: card.glowColor, opacity: 0.2 }}
              />
            </Link>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          4. BRAND PHILOSOPHY
          ═══════════════════════════════════════════════════════ */}
      <BrandPhilosophy />

      {/* ═══════════════════════════════════════════════════════
          5. THE COLUMN (BLOG)
          ═══════════════════════════════════════════════════════ */}
      <TheColumn />

      {/* ═══════════════════════════════════════════════════════
          6. VIP WAITLIST
          ═══════════════════════════════════════════════════════ */}
      <VipWaitlist />

      {/* ═══════════════════════════════════════════════════════
          7. COMPLIANCE STRIP
          ═══════════════════════════════════════════════════════ */}
      <ComplianceStrip />

      {/* ═══════════════════════════════════════════════════════
          8. TRUST BADGES
          ═══════════════════════════════════════════════════════ */}
      <section
        className="px-4 sm:px-6 py-12 sm:py-16"
        aria-label="Our commitments"
        style={{ backgroundColor: 'var(--bg-base)' }}
      >
        <div className="mx-auto max-w-4xl">
          <div
            className="p-6 sm:p-8 text-center"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border)',
            }}
          >
            <div className="flex flex-wrap items-center justify-center gap-x-8 sm:gap-x-12 gap-y-3 mb-6">
              {[
                { title: 'Discreet', desc: 'Plain packaging, private billing' },
                { title: 'Curated', desc: 'Hand-selected premium products' },
                { title: 'Exclusive', desc: 'Member-only collections & access' },
              ].map((trait) => (
                <div key={trait.title}>
                  <p className="text-sm font-syne font-bold tracking-[0.1em] uppercase mb-0.5"
                    style={{ color: 'var(--bne-brass, var(--accent))' }}
                  >
                    {trait.title}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{trait.desc}</p>
                </div>
              ))}
            </div>

            <div className="mx-auto h-[1px] max-w-xs mb-5"
              style={{ background: 'linear-gradient(90deg, transparent, var(--bne-brass, var(--accent)), transparent)' }}
            />

            <p className="text-sm max-w-lg mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Room 23 is a private sanctuary. Every order is handled with absolute confidentiality.
              Your privacy is our priority.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
