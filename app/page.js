'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/lib/cart-context'
import { ShoppingBag, Archive, Key, ArrowRight, ChevronUp } from 'lucide-react'
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
    count: '6 Products',
    glowColor: 'var(--color-brass)',
    glowBg: 'var(--color-brass-glow)',
  },
  {
    href: '/faq',
    icon: Archive,
    title: 'FAQ',
    subtitle: 'Get Answers',
    description: 'Billing, shipping, age verification — everything you need to know.',
    count: '12 Topics',
    glowColor: 'var(--color-brass)',
    glowBg: 'var(--color-brass-glow)',
  },
  {
    href: '/contact',
    icon: Key,
    title: 'CONTACT',
    subtitle: "We're Here",
    description: 'Reach our support team for discreet, private assistance.',
    count: 'Always Private',
    glowColor: 'var(--color-brass)',
    glowBg: 'var(--color-brass-glow)',
  },
]

export default function HomePage() {
  const { ageVerified, mounted } = useCart()
  const [showContent, setShowContent] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    if (mounted && ageVerified) {
      const timer = setTimeout(() => setShowContent(true), 100)
      return () => clearTimeout(timer)
    }
  }, [mounted, ageVerified])

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 600)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!mounted || !ageVerified) return null

  return (
    <div
      className={`flex-1 transition-opacity duration-700 ${showContent ? 'opacity-100' : 'opacity-0'}`}
      style={{ backgroundColor: 'var(--bg-base)' }}
    >
      {/* ══════════════════════════════════════════
          1. HERO
          ══════════════════════════════════════════ */}
      <section
        className="relative px-4 py-16 sm:py-24 md:py-32 text-center overflow-hidden"
        aria-label="Welcome to Room 23"
        style={{ backgroundColor: 'var(--bg-base)' }}
      >
        {/* Multi-layer ambient glows */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-[0.06]"
            style={{
              background: 'radial-gradient(ellipse at 50% 0%, #d4a853 0%, transparent 65%)',
            }}
          />
          <div
            className="absolute bottom-0 left-1/4 w-[400px] h-[250px] opacity-[0.04]"
            style={{
              background: 'radial-gradient(ellipse at 50% 100%, #FF1A1A 0%, transparent 70%)',
            }}
          />
          {/* Subtle horizontal rule glows */}
          <div
            className="absolute top-[60%] left-0 right-0 h-[1px] opacity-[0.06]"
            style={{ background: 'linear-gradient(90deg, transparent, #d4a853, transparent)' }}
          />
        </div>

        {/* Official Brand Logo — Full Lockup Crest */}
        <div className="flex justify-center mb-5 animate-fade-in-up">
          <img
            src="/new logo 2.png"
            alt="Room 23 — Private Wellness"
            className="h-40 sm:h-52 w-auto object-contain transition-transform duration-500 hover:scale-[1.03]"
            style={{ filter: 'drop-shadow(0 12px 32px rgba(0,134,107,0.13))' }}
          />
        </div>

        {/* Eyebrow pill */}
        <div
          className="inline-flex items-center gap-2 mb-7 animate-fade-in-up"
          style={{
            padding: '0.4rem 1.4rem',
            borderRadius: '9999px',
            border: '1px solid rgba(0,134,107,0.28)',
            backgroundColor: 'rgba(0,134,107,0.06)',
            animationDelay: '0.05s',
          }}
        >
          <span
            style={{
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--color-emerald)',
            }}
          >
            ✦ Private · Curated · Discreet ✦
          </span>
        </div>

        {/* Hero Tagline — refined, no duplicate "Room 23" since logo already has it */}
        <p
          className="max-w-lg mx-auto animate-fade-in-up"
          style={{
            fontSize: 'clamp(1.05rem, 2.5vw, 1.2rem)',
            color: 'var(--text-secondary)',
            lineHeight: 1.75,
            letterSpacing: '0.02em',
            marginBottom: '2.5rem',
            animationDelay: '0.1s',
            fontStyle: 'italic',
          }}
        >
          Considered pleasure. Discreet delivery. — Exclusive collections for those who
          appreciate refinement behind closed doors.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in-up"
          style={{ animationDelay: '0.15s' }}
        >
          <Link
            href="/shop"
            className="btn-brass inline-flex items-center gap-2 group"
            style={{ padding: '0.875rem 2rem', fontSize: 'var(--text-sm)' }}
          >
            SHOP NOW
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform duration-200"
            />
          </Link>
          <Link
            href="/faq"
            className="btn-secondary"
            style={{ padding: '0.875rem 1.75rem', fontSize: 'var(--text-sm)' }}
          >
            HOW IT WORKS
          </Link>
        </div>

        {/* Animated brass divider */}
        <div
          className="mx-auto mt-14 h-[1px] max-w-xs animate-pulse-glow"
          style={{
            background: 'linear-gradient(90deg, transparent, var(--color-brass), transparent)',
            boxShadow: '0 0 12px rgba(212,168,83,0.4)',
          }}
        />
      </section>

      {/* ══════════════════════════════════════════
          2. EDITOR'S CHOICE
          ══════════════════════════════════════════ */}
      <EditorChoice />

      {/* ══════════════════════════════════════════
          3. COLLECTION CARDS
          ══════════════════════════════════════════ */}
      <section
        className="px-4 sm:px-6 pb-14 sm:pb-20"
        aria-label="Collections"
        style={{ backgroundColor: 'var(--bg-base)' }}
      >
        <div className="mx-auto max-w-5xl">
          {/* Section label */}
          <p
            className="text-center mb-8 animate-fade-in-up"
            style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--color-brass)',
            }}
          >
            Explore
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {COLLECTION_CARDS.map((card, i) => (
              <Link
                key={card.href}
                href={card.href}
                className="group relative flex flex-col items-center text-center p-7 sm:p-8 cursor-pointer transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border)',
                  animationDelay: `${0.2 + i * 0.08}s`,
                  opacity: 0,
                }}
                aria-label={`Go to ${card.title} — ${card.subtitle}`}
              >
                {/* Top brass accent line — expands on hover */}
                <div
                  className="absolute top-0 left-8 right-8 h-[1px] transition-all duration-500 group-hover:left-4 group-hover:right-4"
                  style={{ backgroundColor: card.glowColor, opacity: 0.3 }}
                />

                {/* Hover background glow */}
                <div
                  className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: 'radial-gradient(ellipse at 50% 0%, rgba(212,168,83,0.06) 0%, transparent 65%)',
                  }}
                />

                {/* Icon */}
                <div className="relative mb-5 mt-1">
                  <div
                    className="relative w-14 h-14 rounded-full flex items-center justify-center border transition-all duration-500 group-hover:shadow-[0_0_20px_rgba(212,168,83,0.25)]"
                    style={{
                      borderColor: 'var(--border)',
                      backgroundColor: 'var(--bg-elevated)',
                    }}
                  >
                    <card.icon
                      className="w-6 h-6 transition-transform duration-300 group-hover:scale-110"
                      style={{ color: card.glowColor }}
                      aria-hidden="true"
                    />
                  </div>
                </div>

                <h3
                  className="font-syne text-lg font-bold tracking-[0.1em] uppercase mb-1"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {card.title}
                </h3>
                <p
                  className="text-xs font-semibold tracking-[0.15em] uppercase mb-3"
                  style={{ color: card.glowColor }}
                >
                  {card.subtitle}
                </p>
                <p className="text-sm leading-relaxed mb-1" style={{ color: 'var(--text-muted)' }}>
                  {card.description}
                </p>
                <p
                  className="text-xs font-semibold mb-5"
                  style={{ color: 'rgba(212,168,83,0.5)' }}
                >
                  {card.count}
                </p>
                <div
                  className="mt-auto flex items-center gap-2 text-xs font-semibold tracking-[0.12em] uppercase transition-all duration-300 group-hover:gap-3"
                  style={{ color: card.glowColor }}
                >
                  EXPLORE <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" aria-hidden="true" />
                </div>

                <div
                  className="absolute bottom-0 left-8 right-8 h-[1px] transition-all duration-500 group-hover:left-4 group-hover:right-4"
                  style={{ backgroundColor: card.glowColor, opacity: 0.15 }}
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          4. BRAND PHILOSOPHY
          ══════════════════════════════════════════ */}
      <BrandPhilosophy />

      {/* ══════════════════════════════════════════
          5. THE COLUMN (BLOG)
          ══════════════════════════════════════════ */}
      <TheColumn />

      {/* ══════════════════════════════════════════
          6. VIP WAITLIST
          ══════════════════════════════════════════ */}
      <VipWaitlist />

      {/* ══════════════════════════════════════════
          7. COMPLIANCE STRIP
          ══════════════════════════════════════════ */}
      <ComplianceStrip />

      {/* ══════════════════════════════════════════
          8. TRUST BADGES
          ══════════════════════════════════════════ */}
      <section
        className="px-4 sm:px-6 py-12 sm:py-16"
        aria-label="Our commitments"
        style={{ backgroundColor: 'var(--bg-base)' }}
      >
        <div className="mx-auto max-w-4xl">
          <div
            className="p-8 sm:p-10 text-center relative overflow-hidden"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border)',
            }}
          >
            {/* Background shimmer */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at 50% 0%, rgba(212,168,83,0.04) 0%, transparent 60%)',
              }}
            />
            <div className="relative z-10">
              <div className="flex flex-wrap items-center justify-center gap-x-10 sm:gap-x-14 gap-y-4 mb-8">
                {[
                  { title: 'Discreet', desc: 'Plain packaging, private billing' },
                  { title: 'Curated', desc: 'Hand-selected premium products' },
                  { title: 'Exclusive', desc: 'Member-only collections & access' },
                ].map((trait) => (
                  <div key={trait.title}>
                    <p
                      className="text-sm font-syne font-bold tracking-[0.1em] uppercase mb-0.5"
                      style={{ color: 'var(--color-brass)' }}
                    >
                      {trait.title}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{trait.desc}</p>
                  </div>
                ))}
              </div>

              <div
                className="mx-auto h-[1px] max-w-xs mb-6"
                style={{ background: 'linear-gradient(90deg, transparent, var(--color-brass), transparent)' }}
              />

              <p className="text-sm max-w-lg mx-auto" style={{ color: 'var(--text-secondary)' }}>
                Room 23 is a private sanctuary. Every order is handled with absolute confidentiality.
                Your privacy is our priority.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Back to Top ── */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full flex items-center justify-center animate-fade-in-up transition-all duration-200 hover:scale-110"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--color-border-brass)',
            color: 'var(--color-brass)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          }}
          aria-label="Back to top"
        >
          <ChevronUp size={18} />
        </button>
      )}
    </div>
  )
}
