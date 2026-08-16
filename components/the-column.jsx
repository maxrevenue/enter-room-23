import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const ARTICLES = [
  {
    tag: 'Essentials',
    title: 'Building a Considered Collection',
    excerpt:
      'Where to begin — and why fewer, better pieces make a more meaningful private ritual.',
    href: '/journal/wellness-maintenance',
    accentColor: 'var(--bne-brass, var(--accent))',
  },
  {
    tag: 'Wellness',
    title: 'The Ritual of Self-Care',
    excerpt:
      'How intentional routines transform ordinary moments into acts of self-regard.',
    href: '/journal/lubricant-formulations',
    accentColor: 'var(--bne-brass, var(--accent))',
  },
  {
    tag: 'Intimacy',
    title: 'Designing for Desire',
    excerpt:
      'When objects are made with care, they invite a different kind of attention.',
    href: '/journal/discreet-luxury',
    accentColor: 'var(--bne-brass, var(--accent))',
  },
]

export default function TheColumn() {
  return (
    <section
      className="px-4 py-12 sm:py-16"
      style={{ backgroundColor: 'var(--bg-elevated, var(--bg-surface))' }}
      aria-labelledby="journal-heading"
    >
      <div className="mx-auto max-w-5xl">
        {/* ── Header ── */}
        <div className="text-center mb-8 sm:mb-10">
          <p
            className="text-xs font-semibold tracking-[0.2em] uppercase mb-3"
            style={{ color: 'var(--bne-brass, var(--accent))' }}
            aria-hidden="true"
          >
            Words
          </p>
          <h2
            id="journal-heading"
            className="font-syne text-2xl sm:text-3xl font-bold tracking-[0.08em] uppercase"
            style={{ color: 'var(--text-primary)' }}
          >
            From the Journal
          </h2>
          <div
            className="mx-auto mt-4 h-[1px] w-16"
            style={{ backgroundColor: 'var(--bne-brass, var(--accent))', opacity: 0.5 }}
          />
        </div>

        {/* ── Article Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {ARTICLES.map((article, i) => (
            <article
              key={article.title}
              className="group relative flex flex-col transition-transform duration-300"
              style={{
                backgroundColor: 'var(--bg-surface, var(--bg-base))',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)',
                overflow: 'hidden',
              }}
              aria-labelledby={`article-heading-${i}`}
            >
              {/* Top color bar */}
              <div
                className="h-[3px] w-full"
                style={{ backgroundColor: article.accentColor, opacity: 0.55 }}
                aria-hidden="true"
              />

              <div className="flex flex-col flex-1 p-5 sm:p-6">
                {/* Tag */}
                <span
                  className="self-start inline-block px-2.5 py-0.5 text-[10px] font-semibold tracking-[0.15em] uppercase rounded-sm mb-3"
                  style={{
                    backgroundColor: 'var(--bne-brass-glow, rgba(200,163,78,0.12))',
                    color: 'var(--bne-brass, var(--accent))',
                  }}
                >
                  {article.tag}
                </span>

                {/* Title */}
                <h3
                  id={`article-heading-${i}`}
                  className="font-syne text-base sm:text-lg font-bold tracking-[0.05em] uppercase mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {article.title}
                </h3>

                {/* Excerpt */}
                <p
                  className="text-sm leading-relaxed mb-5 flex-1"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {article.excerpt}
                </p>

                {/* CTA */}
                <Link
                  href={article.href}
                  className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.1em] uppercase transition-all duration-300 group-hover:gap-3 mt-auto"
                  style={{ color: 'var(--bne-brass, var(--accent))' }}
                  aria-label={`Read more about ${article.title}`}
                >
                  Read <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
