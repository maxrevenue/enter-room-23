'use client'

import { useTheme } from '../lib/theme-context'

export default function HomePage() {
  const { theme, toggleTheme } = useTheme()

  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-fg)] font-[family-name:var(--font-sans)] transition-colors duration-300">
      {/* ─── Theme Toggle ─────────────────────────────── */}
      <button
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className="fixed top-6 right-6 z-50 p-2.5 rounded-full border border-[var(--color-card-border)] bg-[var(--color-card)] text-[var(--color-fg)] transition-all duration-300 hover:scale-110"
      >
        {theme === 'dark' ? (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
          </svg>
        ) : (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
          </svg>
        )}
      </button>

      {/* ─── HERO ─────────────────────────────────────── */}
      <HeroSection theme={theme} />

      {/* ─── SHOP / ARCHIVE / VAULT ───────────────────── */}
      <div id="enter-target" />
      <ThreeColumnSection />

      {/* ─── TRUST STRIP ──────────────────────────────── */}
      <TrustStrip />

      {/* ─── FOOTER ───────────────────────────────────── */}
      <MinimalFooter />
    </main>
  )
}

/* ------------------------------------------------------------------ */
/*  Hero Section                                                       */
/* ------------------------------------------------------------------ */
function HeroSection({ theme }) {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
      {/* Light background — champagne radial glow with subtle noise texture */}
      <div className="absolute inset-0 dark:hidden"
        style={{
          background:
            'radial-gradient(ellipse at 50% 30%, rgba(201,168,76,0.10) 0%, #FBF8F2 70%)',
        }}
      />
      {/* Dark background — cinematic near-black with red halo */}
      <div className="absolute inset-0 hidden dark:block"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(139,0,0,0.18) 0%, rgba(10,10,10,1) 70%)',
        }}
      />

      {/* Dark-only top-left accent glow */}
      <div className="pointer-events-none absolute left-0 top-0 hidden h-[40vh] w-[40vh] rounded-full opacity-20 blur-[120px] dark:block"
        style={{ background: 'radial-gradient(circle, #FF2020, transparent)' }}
      />
      {/* Light-only subtle champagne glow */}
      <div className="pointer-events-none absolute right-0 top-20 h-[40vh] w-[40vh] rounded-full opacity-15 blur-[100px] dark:hidden"
        style={{ background: 'radial-gradient(circle, #C9A84C, transparent)' }}
      />

      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Wordmark — clean oxblood in light, neon glow in dark */}
        <h1
          className="font-[family-name:var(--font-serif)] text-7xl font-bold tracking-[0.15em] sm:text-8xl md:text-9xl dark:neon-glow-text dark:animate-pulse"
          style={{
            animationDuration: '4s',
            color: 'var(--color-primary)',
          }}
        >
          ROOM
          <br />
          <span className="block text-6xl sm:text-7xl md:text-8xl">23</span>
        </h1>

        {/* Tagline — warm taupe in light, muted ivory in dark */}
        <p className="max-w-md text-lg tracking-[0.25em] sm:text-xl"
          style={{ color: 'var(--color-muted)' }}
        >
          ENTER YOUR PRIVATE SIDE
        </p>

        {/* CTA button — solid burgundy border in light, neon red in dark */}
        <button
          onClick={() => {
            const el = document.getElementById('enter-target')
            if (el) el.scrollIntoView({ behavior: 'smooth' })
          }}
          className="mt-4 inline-flex items-center gap-3 border border-[var(--color-primary)] px-10 py-4 text-sm font-semibold uppercase tracking-[0.3em] text-[var(--color-primary)] transition-all duration-500"
          style={{
            backgroundColor: 'var(--color-cta-bg)',
          }}
        >
          ENTER ROOM23
          <span aria-hidden className="text-lg leading-none">
            &rarr;
          </span>
        </button>
      </div>

      {/* Bottom gradient fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-full"
        style={{
          background:
            'linear-gradient(to bottom, transparent, var(--color-bg))',
        }}
      />
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Three Column Section                                               */
/* ------------------------------------------------------------------ */
const cards = [
  {
    title: 'SHOP',
    description:
      'Curated garments and artifacts for the discerning few. Limited drops, no compromises.',
    icon: (
      <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
  },
  {
    title: 'THE ARCHIVE',
    description:
      'Past seasons, rare finds, and one-of-one pieces. What was, returns.',
    icon: (
      <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        <circle cx="9" cy="15.75" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    title: 'THE VAULT',
    description:
      "Members-only access. Private sales, insider previews, and the key to what's next.",
    icon: (
      <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
      </svg>
    ),
  },
]

function ThreeColumnSection() {
  return (
    <section className="px-6 py-24 md:px-12">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.title} {...card} />
        ))}
      </div>
    </section>
  )
}

function Card({ title, description, icon }) {
  return (
    <div className="group flex flex-col items-center gap-6 border p-10 text-center backdrop-blur-sm transition-all duration-500 hover:scale-[1.02]"
      style={{
        borderColor: 'var(--color-card-border)',
        backgroundColor: 'var(--color-card)',
      }}
    >
      {/* Icon */}
      <div className="transition-transform duration-500 group-hover:scale-110"
        style={{ color: 'var(--color-primary)' }}
      >
        {icon}
      </div>

      {/* Title */}
      <h3 className="font-[family-name:var(--font-serif)] text-2xl tracking-[0.15em]"
        style={{ color: 'var(--color-fg)' }}
      >
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm leading-relaxed"
        style={{ color: 'var(--color-muted)' }}
      >
        {description}
      </p>

      {/* CTA */}
      <button className="mt-2 border px-8 py-3 text-xs font-semibold uppercase tracking-[0.25em] transition-all duration-500"
        style={{
          borderColor: 'var(--color-muted)',
          color: 'var(--color-muted)',
        }}
      >
        Explore
      </button>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Trust Strip                                                        */
/* ------------------------------------------------------------------ */
function TrustStrip() {
  const items = ['DISCREET PACKAGING', 'PRIVATE BILLING', 'SECURE CHECKOUT']

  return (
    <div className="border-y"
      style={{
        borderColor: 'var(--color-card-border)',
        backgroundColor: 'var(--color-card)',
      }}
    >
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-3 px-6 py-8 text-xs tracking-[0.2em] sm:flex-row sm:gap-0"
        style={{ color: 'var(--color-muted)' }}
      >
        {items.map((text, i) => (
          <span key={text} className="flex items-center">
            {text}
            {i < items.length - 1 && (
              <span className="mx-4 opacity-60 sm:mx-6" aria-hidden style={{ color: 'var(--color-primary)' }}>
                &middot;
              </span>
            )}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Minimal Footer                                                     */
/* ------------------------------------------------------------------ */
const footerLinks = ['Privacy Policy', 'Terms of Service', 'Contact', 'FAQ']

function MinimalFooter() {
  return (
    <footer className="border-t px-6 py-12"
      style={{ borderColor: 'var(--color-card-border)' }}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 md:flex-row md:justify-between">
        {/* Wordmark */}
        <p className="font-[family-name:var(--font-serif)] text-lg tracking-[0.15em] opacity-80"
          style={{ color: 'var(--color-primary)' }}
        >
          ROOM 23
        </p>

        {/* Nav links */}
        <nav className="flex flex-wrap justify-center gap-6">
          {footerLinks.map((link) => (
            <a
              key={link}
              href="#"
              className="text-xs uppercase tracking-[0.2em] transition-colors duration-300"
              style={{ color: 'var(--color-subtle)' }}
            >
              {link}
            </a>
          ))}
        </nav>

        {/* Copyright */}
        <p className="text-xs" style={{ color: 'var(--color-subtle)' }}>
          &copy; {new Date().getFullYear()} ROOM 23. All rights reserved.
        </p>
      </div>
    </footer>
  )
}