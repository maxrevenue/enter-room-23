'use client'

import { useTheme } from '../lib/theme-context'
import { PRODUCTS } from '../lib/products'

export default function HomePage() {
  const { theme, toggleTheme } = useTheme()

  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-fg)] font-[family-name:var(--font-sans)] transition-colors duration-300">
      {/* ─── Theme Toggle ─────────────────────────────── */}
      <button
        onClick={toggleTheme}
        aria-label="Toggle dark mode"
        className="fixed top-6 right-6 z-50 p-2.5 rounded-full border border-[var(--color-card-border)] bg-[var(--color-card)] text-[var(--color-fg)] transition-all duration-300 hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
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

      {/* ─── BRAND PHILOSOPHY ─────────────────────────── */}
      <BrandPhilosophy />

      {/* ─── PRODUCT CATALOG ──────────────────────────── */}
      <ProductCatalog />

      {/* ─── ITEM OF THE MONTH ────────────────────────── */}
      <ItemOfTheMonth />

      {/* ─── THE COLUMN (BLOG) ────────────────────────── */}
      <TheColumn />

      {/* ─── VIP WAITLIST ─────────────────────────────── */}
      <VipWaitlist />

      {/* ─── COMPLIANCE ───────────────────────────────── */}
      <ComplianceStrip />

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
      <div className="absolute inset-0 dark:hidden"
        style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(201,168,76,0.10) 0%, #FBF8F2 70%)' }}
      />
      <div className="absolute inset-0 hidden dark:block"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(139,0,0,0.18) 0%, rgba(10,10,10,1) 70%)' }}
      />
      <div className="pointer-events-none absolute left-0 top-0 hidden h-[40vh] w-[40vh] rounded-full opacity-20 blur-[120px] dark:block"
        style={{ background: 'radial-gradient(circle, #FF2020, transparent)' }}
      />
      <div className="pointer-events-none absolute right-0 top-20 h-[40vh] w-[40vh] rounded-full opacity-15 blur-[100px] dark:hidden"
        style={{ background: 'radial-gradient(circle, #C9A84C, transparent)' }}
      />
      <div className="relative z-10 flex flex-col items-center gap-8">
        <h1
          className="font-[family-name:var(--font-serif)] text-7xl font-bold tracking-[0.15em] sm:text-8xl md:text-9xl dark:neon-glow-text dark:animate-pulse"
          style={{ animationDuration: '4s', color: 'var(--color-primary)' }}
        >
          ROOM<br />
          <span className="block text-6xl sm:text-7xl md:text-8xl">23</span>
        </h1>
        <p className="max-w-md text-lg font-semibold tracking-[0.25em] sm:text-xl" style={{ color: 'var(--color-muted)' }}>
          ENTER YOUR PRIVATE SIDE
        </p>
        <button
          onClick={() => { const el = document.getElementById('enter-target'); if (el) el.scrollIntoView({ behavior: 'smooth' }) }}
          className="mt-4 group inline-flex items-center gap-3 border-2 border-[var(--color-primary)] px-10 py-4 text-sm font-semibold uppercase tracking-[0.3em] transition-all duration-300 ease-in-out hover:scale-105 hover:-translate-y-0.5 hover:shadow-lg active:scale-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
          style={{ backgroundColor: 'var(--color-cta-bg)', color: 'var(--color-cta-text)' }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-cta-hover-bg)'; e.currentTarget.style.borderWidth = '3px' }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-cta-bg)'; e.currentTarget.style.borderWidth = '2px' }}
        >
          ENTER ROOM23 <span aria-hidden className="text-lg leading-none">&rarr;</span>
        </button>
      </div>
      <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-full"
        style={{ background: 'linear-gradient(to bottom, transparent, var(--color-bg))' }}
      />
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Three Column Section                                               */
/* ------------------------------------------------------------------ */
const cards = [
  { title: 'SHOP', description: 'Curated garments and artifacts for the discerning few. Limited drops, no compromises.',
    icon: (<svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>),
  },
  { title: 'THE ARCHIVE', description: 'Past seasons, rare finds, and one-of-one pieces. What was, returns.',
    icon: (<svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /><circle cx="9" cy="15.75" r="1.5" fill="currentColor" stroke="none" /></svg>),
  },
  { title: 'THE VAULT', description: "Members-only access. Private sales, insider previews, and the key to what's next.",
    icon: (<svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" /></svg>),
  },
]

function ThreeColumnSection() {
  return (
    <section className="px-6 py-24 md:px-12">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
        {cards.map((card) => (
          <div key={card.title} className="group flex flex-col items-center gap-6 border p-10 text-center backdrop-blur-sm transition-all duration-500 hover:scale-[1.02]"
            style={{ borderColor: 'var(--color-card-border)', backgroundColor: 'var(--color-card)' }}>
            <div className="transition-transform duration-500 group-hover:scale-110" style={{ color: 'var(--color-primary)' }}>{card.icon}</div>
            <h3 className="font-[family-name:var(--font-serif)] text-2xl tracking-[0.15em]" style={{ color: 'var(--color-fg)' }}>{card.title}</h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-muted)' }}>{card.description}</p>
            <button className="mt-2 border px-8 py-3 text-xs font-semibold uppercase tracking-[0.25em] transition-all duration-300 hover:scale-105 hover:underline hover:-translate-y-[1px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
              style={{ borderColor: 'var(--color-muted)', color: 'var(--color-muted)' }}>Explore</button>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Trust Strip                                                        */
/* ------------------------------------------------------------------ */
function TrustStrip() {
  const items = ['DISCREET PACKAGING', 'PRIVATE BILLING', 'SECURE CHECKOUT']
  return (
    <div className="border-y" style={{ borderColor: 'var(--color-card-border)', backgroundColor: 'var(--color-card)' }}>
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-3 px-6 py-8 text-xs tracking-[0.2em] sm:flex-row sm:gap-0" style={{ color: 'var(--color-muted)' }}>
        {items.map((text, i) => (
          <span key={text} className="flex items-center">
            {text}
            {i < items.length - 1 && <span className="mx-4 opacity-60 sm:mx-6" aria-hidden style={{ color: 'var(--color-primary)' }}>&middot;</span>}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Brand Philosophy                                                    */
/* ------------------------------------------------------------------ */
function BrandPhilosophy() {
  return (
    <section id="philosophy" className="py-24 sm:py-32" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="mx-auto max-w-2xl px-6 text-center space-y-8">
        <div className="inline-block text-[10px] tracking-[0.3em] uppercase px-4 py-1.5 rounded-full"
          style={{ color: 'var(--color-muted)', backgroundColor: 'var(--color-card)' }}>
          Our Philosophy
        </div>
        <p className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-tight leading-[1.4]">
          We believe intimacy deserves the same intention we bring to every other ritual —{' '}
          <span className="font-[family-name:var(--font-serif)] italic" style={{ color: 'var(--color-primary)' }}>
            unhurried, considered, clean.
          </span>
        </p>
        <div className="h-px w-16 mx-auto" style={{ backgroundColor: 'var(--color-accent)' }} />
        <p className="text-sm sm:text-base leading-relaxed max-w-lg mx-auto" style={{ color: 'var(--color-muted)' }}>
          Every formula is chosen for its integrity, every object for its silence. Nothing here is impulse.
        </p>
        <div className="pt-4 text-[11px] tracking-[0.3em] uppercase" style={{ color: 'var(--color-subtle)' }}>
          — Room 23 Editors
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Product Catalog                                                    */
/* ------------------------------------------------------------------ */
function ProductCatalog() {
  return (
    <section id="shop" className="py-24 sm:py-32" style={{ backgroundColor: 'var(--color-card)' }}>
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 sm:mb-20 gap-4">
          <div className="space-y-3">
            <div className="text-[10px] tracking-[0.25em] uppercase" style={{ color: 'var(--color-muted)' }}>The Collection</div>
            <h2 className="text-4xl sm:text-5xl font-light tracking-[-0.02em] font-[family-name:var(--font-serif)]">Essentials</h2>
          </div>
          <div className="text-xs max-w-[20ch] leading-relaxed text-left sm:text-right" style={{ color: 'var(--color-subtle)' }}>
            Complimentary discreet shipping on orders over $50
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 sm:gap-y-24">
          {PRODUCTS.map((p, i) => (
            <ProductTile key={p.id} product={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProductTile({ product, index }) {
  return (
    <div className="group flex flex-col" style={{ animationDelay: `${index * 100}ms` }}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-sm" style={{ backgroundColor: 'var(--color-bg)' }}>
        {product.image ? (
          <img src={product.image} alt={product.name} width="400" height="500" loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.04]" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-xs tracking-[0.15em] uppercase" style={{ color: 'var(--color-subtle)' }}>
            <span>Product Image</span><span>Coming Soon</span>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t pointer-events-none"
          style={{ background: 'linear-gradient(to top, var(--color-card), transparent)' }} />
      </div>
      <div className="pt-6 sm:pt-8 space-y-3">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="text-lg sm:text-xl font-light tracking-tight leading-snug">{product.name}</h3>
          <div className="text-base font-light tabular-nums whitespace-nowrap" style={{ color: 'var(--color-muted)' }}>${product.price}</div>
        </div>
        <p className="text-[10px] tracking-[0.2em] uppercase" style={{ color: 'var(--color-subtle)' }}>{product.tagline}</p>
        <p className="text-sm leading-relaxed max-w-md" style={{ color: 'var(--color-muted)' }}>{product.description}</p>
        <button className="mt-3 inline-block border px-8 py-3 text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-300 hover:scale-105 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
          style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)', backgroundColor: 'var(--color-cta-bg)' }}>
          Add to Bag
        </button>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Item of the Month                                                  */
/* ------------------------------------------------------------------ */
function ItemOfTheMonth() {
  const featured = PRODUCTS[4] // Premium Silicone Wand
  return (
    <section className="py-24 sm:py-32" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
          <div className="flex-1 space-y-6">
            <div className="text-[10px] tracking-[0.3em] uppercase" style={{ color: 'var(--color-primary)' }}>Item of the Month</div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-[-0.02em] font-[family-name:var(--font-serif)]">{featured.name}</h2>
            <p className="text-lg leading-relaxed" style={{ color: 'var(--color-muted)' }}>{featured.description}</p>
            <p className="text-[10px] tracking-[0.2em] uppercase" style={{ color: 'var(--color-subtle)' }}>{featured.tagline}</p>
            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-light tabular-nums" style={{ color: 'var(--color-primary)' }}>${featured.price}</span>
            </div>
            <button className="inline-block border-2 px-10 py-4 text-sm font-semibold uppercase tracking-[0.3em] transition-all duration-300 ease-in-out hover:scale-105 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
              style={{ borderColor: 'var(--color-primary)', color: 'var(--color-cta-text)', backgroundColor: 'var(--color-cta-bg)' }}>
              Shop Now &rarr;
            </button>
          </div>
          <div className="flex-1 w-full aspect-[4/5] max-w-md rounded-sm overflow-hidden" style={{ backgroundColor: 'var(--color-card)' }}>
            <div className="w-full h-full flex items-center justify-center text-xs tracking-[0.15em] uppercase" style={{ color: 'var(--color-subtle)' }}>
              Product Image · Coming Soon
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  The Column (Blog)                                                  */
/* ------------------------------------------------------------------ */
const blogPosts = [
  { title: 'The Ritual of Restraint', date: 'June 2026', excerpt: 'Why the best collections are built by subtraction, not addition. A manifesto on curation.' },
  { title: 'Behind the Velvet Rope', date: 'May 2026', excerpt: 'Inside the private previews, archive access, and members-only drops that define Room 23.' },
  { title: 'Materials That Matter', date: 'April 2026', excerpt: 'From OEKO-TEX textiles to medical-grade silicone — the standards behind every product.' },
]

function TheColumn() {
  return (
    <section className="py-24 sm:py-32" style={{ backgroundColor: 'var(--color-card)' }}>
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 space-y-3">
          <div className="text-[10px] tracking-[0.3em] uppercase" style={{ color: 'var(--color-primary)' }}>The Column</div>
          <h2 className="text-4xl sm:text-5xl font-light tracking-[-0.02em] font-[family-name:var(--font-serif)]">Stories & Editorials</h2>
        </div>
        <div className="grid gap-10 md:grid-cols-3">
          {blogPosts.map((post) => (
            <div key={post.title} className="group cursor-pointer border p-8 transition-all duration-500 hover:scale-[1.02]"
              style={{ borderColor: 'var(--color-card-border)', backgroundColor: 'var(--color-bg)' }}>
              <div className="text-xs tracking-[0.2em] uppercase mb-4" style={{ color: 'var(--color-subtle)' }}>{post.date}</div>
              <h3 className="text-xl font-semibold font-[family-name:var(--font-serif)] tracking-tight mb-3 group-hover:underline">{post.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-muted)' }}>{post.excerpt}</p>
              <span className="inline-block mt-5 text-xs font-semibold uppercase tracking-[0.2em] transition-all group-hover:translate-x-1" style={{ color: 'var(--color-primary)' }}>
                Read More &rarr;
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  VIP Waitlist                                                       */
/* ------------------------------------------------------------------ */
function VipWaitlist() {
  return (
    <section className="py-24 sm:py-32" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="mx-auto max-w-xl px-6 text-center space-y-6">
        <div className="text-[10px] tracking-[0.3em] uppercase" style={{ color: 'var(--color-primary)' }}>Join the Inner Circle</div>
        <h2 className="text-3xl sm:text-4xl font-light tracking-[-0.02em] font-[family-name:var(--font-serif)]">VIP Waitlist</h2>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--color-muted)' }}>
          Be the first to access limited drops, private sales, and insider previews. No spam. No noise.
        </p>
        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
          <input type="email" placeholder="Your email address" required
            className="px-5 py-4 text-sm border bg-transparent flex-1 max-w-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
            style={{ borderColor: 'var(--color-card-border)', color: 'var(--color-fg)' }} />
          <button type="submit"
            className="border-2 px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
            style={{ borderColor: 'var(--color-primary)', color: 'var(--color-cta-text)', backgroundColor: 'var(--color-cta-bg)' }}>
            Join
          </button>
        </form>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Compliance Strip                                                   */
/* ------------------------------------------------------------------ */
function ComplianceStrip() {
  return (
    <section className="border-t py-16 text-center space-y-2"
      style={{ borderColor: 'var(--color-card-border)', backgroundColor: 'var(--color-card)' }}>
      <div className="flex items-center justify-center gap-2 text-[10px] tracking-[0.25em] uppercase" style={{ color: 'var(--color-subtle)' }}>
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        18+ Only — Adult Content
      </div>
      <p className="text-xs" style={{ color: 'var(--color-subtle)' }}>Room23 LLC · Los Angeles, CA</p>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Minimal Footer                                                     */
/* ------------------------------------------------------------------ */
const footerLinks = ['Privacy Policy', 'Terms of Service', 'Contact', 'FAQ']

function MinimalFooter() {
  return (
    <footer className="border-t px-6 py-12" style={{ borderColor: 'var(--color-card-border)' }}>
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 md:flex-row md:justify-between">
        <p className="font-[family-name:var(--font-serif)] text-lg tracking-[0.15em] opacity-80" style={{ color: 'var(--color-primary)' }}>ROOM 23</p>
        <nav className="flex flex-wrap justify-center gap-6">
          {footerLinks.map((link) => (
            <a key={link} href="#" className="text-xs uppercase tracking-[0.2em] transition-all duration-300 hover:underline hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
              style={{ color: 'var(--color-subtle)' }}>{link}</a>
          ))}
        </nav>
        <p className="text-xs" style={{ color: 'var(--color-subtle)' }}>&copy; {new Date().getFullYear()} ROOM 23. All rights reserved.</p>
      </div>
    </footer>
  )
}