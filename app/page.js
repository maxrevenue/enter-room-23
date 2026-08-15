'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, Truck, Archive, Key, ArrowRight } from 'lucide-react'
import ComplianceStrip from '@/components/compliance-strip'

const DESTINATION_CARDS = [
  {
    href: '/shop',
    icon: ShoppingBag,
    title: 'SHOP',
    subtitle: 'The Collection',
    description: 'Premium adult wellness, curated and ready to ship.',
  },
  {
    href: '/shipping',
    icon: Truck,
    title: 'SHIPPING',
    subtitle: 'Plain Packaging',
    description: 'Unmarked boxes, private billing, US delivery.',
  },
  {
    href: '/faq',
    icon: Archive,
    title: 'FAQ',
    subtitle: 'Get Answers',
    description: 'Billing, age verification, and order questions.',
  },
  {
    href: '/contact',
    icon: Key,
    title: 'CONTACT',
    subtitle: "We're Here",
    description: 'Discreet support at support@room23.net.',
  },
]

export default function HomePage() {
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className={`flex-1 transition-opacity duration-700 ${showContent ? 'opacity-100' : 'opacity-0'}`}
      style={{ backgroundColor: 'var(--bg-base)' }}
    >
      <section
        className="relative min-h-[70vh] flex flex-col items-center justify-center px-4 py-20 sm:py-28 text-center overflow-hidden"
        aria-label="Welcome to Room 23"
        style={{ backgroundColor: 'var(--bg-base)' }}
      >
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute inset-0" style={{ backgroundColor: '#0B0B0C' }} />
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px]"
            style={{
              background: 'radial-gradient(ellipse at 50% 0%, rgba(200,16,46,0.08) 0%, transparent 70%)',
            }}
          />
        </div>

        <div className="relative z-10 flex justify-center mb-6 animate-fade-in-up">
          <span
            className="font-syne font-bold tracking-widest uppercase inline-block"
            style={{
              fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
              color: '#C8102E',
              letterSpacing: '0.4em',
              textShadow: '0 12px 40px rgba(200,16,46,0.25)',
            }}
          >
            ROOM 23
          </span>
        </div>

        <div
          className="relative z-10 inline-flex items-center gap-2 mb-6 animate-fade-in-up"
          style={{
            padding: '0.4rem 1.4rem',
            borderRadius: '9999px',
            border: '1px solid rgba(200,16,46,0.3)',
            backgroundColor: 'rgba(200,16,46,0.06)',
          }}
        >
          <span
            style={{
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: '#C8102E',
            }}
          >
            Private · Curated · Discreet
          </span>
        </div>

        <p
          className="relative z-10 max-w-lg mx-auto animate-fade-in-up"
          style={{
            fontSize: 'clamp(1.05rem, 2.5vw, 1.2rem)',
            color: 'var(--text-secondary)',
            lineHeight: 1.8,
            marginBottom: '2.5rem',
            fontStyle: 'italic',
          }}
        >
          Considered pleasure. Discreet delivery.
        </p>

        <Link
          href="/shop"
          className="relative z-10 inline-flex items-center gap-2 group rounded-lg font-semibold uppercase tracking-widest text-sm transition-all duration-200"
          style={{ padding: '0.875rem 2rem', backgroundColor: '#C8102E', color: '#FFFFFF', boxShadow: '0 4px 24px rgba(200,16,46,0.3)' }}
          onMouseOver={e => { e.currentTarget.style.backgroundColor = '#A30D25' }}
          onMouseOut={e => { e.currentTarget.style.backgroundColor = '#C8102E' }}
        >
          SHOP NOW
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
        </Link>

        <div
          className="relative z-10 mx-auto mt-16 h-[1px] max-w-xs"
          style={{ background: 'linear-gradient(90deg, transparent, #C8102E, transparent)' }}
        />
      </section>

      <section className="px-4 sm:px-6 pb-16 sm:pb-20" aria-label="Explore">
        <div className="mx-auto max-w-5xl grid grid-cols-1 sm:grid-cols-2 gap-5">
          {DESTINATION_CARDS.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group relative flex flex-col p-7 sm:p-8 transition-all duration-300 hover:-translate-y-1"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)',
              }}
            >
              <card.icon className="w-5 h-5 mb-4" style={{ color: '#C8102E' }} />
              <h3
                className="font-syne text-lg font-bold tracking-[0.1em] uppercase mb-1"
                style={{ color: 'var(--text-primary)' }}
              >
                {card.title}
              </h3>
              <p className="text-xs font-semibold tracking-[0.15em] uppercase mb-3" style={{ color: '#C8102E' }}>
                {card.subtitle}
              </p>
              <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-muted)' }}>
                {card.description}
              </p>
              <span
                className="mt-auto flex items-center gap-2 text-xs font-semibold tracking-[0.12em] uppercase"
                style={{ color: '#C8102E' }}
              >
                OPEN <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <ComplianceStrip />
    </div>
  )
}
