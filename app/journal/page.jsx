import { SITE_CONFIG } from '@/config/site'
import VipWaitlist from '@/components/vip-waitlist'
import Link from 'next/link'
import { Clock, BookOpen } from 'lucide-react'

export const metadata = {
  title: 'Journal | Room 23',
  description: 'Wellness education, intimacy guides, and editorial from Room 23.',
}

const ARTICLES = [
  {
    id: 'wellness-maintenance',
    title: 'The Art of Intimate Wellness Maintenance',
    date: 'August 1, 2026',
    readTime: '6 min read',
    author: 'Room 23 Editorial',
    excerpt:
      'Beyond soap and water \u2014 a modern guide to pH-conscious care, barrier-friendly routines, and why the most sensitive skin on your body deserves formulations as considered as the rest of your regimen.',
    category: 'Wellness',
  },
  {
    id: 'lubricant-formulations',
    title: 'Understanding Personal Lubricant Formulations',
    date: 'July 22, 2026',
    readTime: '8 min read',
    author: 'Room 23 Editorial',
    excerpt:
      'Water-based. Silicone. Hybrid. Aloe. A clear-eyed breakdown of ingredient decks, osmolality science, and material compatibility \u2014 so you can choose with confidence.',
    category: 'Education',
  },
  {
    id: 'discreet-luxury',
    title: 'Why Discretion Is the Ultimate Luxury',
    date: 'July 10, 2026',
    readTime: '4 min read',
    author: 'Room 23 Editorial',
    excerpt:
      'In a world of performative transparency and digital oversharing, deliberate privacy has become the most refined statement of all. A meditation on how unbranded packaging and private billing reclaim intimacy.',
    category: 'Lifestyle',
  },
]

export default function JournalPage() {
  return (
    <div className="py-12 sm:py-16">
      {/* ── Hero ── */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 text-center mb-14">
        <p
          className="text-xs uppercase tracking-[0.2em] mb-4"
          style={{ color: 'var(--accent)' }}
        >
          Editorial
        </p>
        <h1
          className="text-4xl sm:text-5xl font-bold tracking-tight mb-4"
          style={{
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-syne)',
          }}
        >
          Journal
        </h1>
        <p
          className="text-base sm:text-lg max-w-2xl mx-auto"
          style={{ color: 'var(--text-secondary)' }}
        >
          Wellness education, intimacy guides, and curated editorial from{' '}
          {SITE_CONFIG.name}. Read the latest on intimate wellness, personal care,
          and modern relationships.
        </p>
      </section>

      {/* ── Article Grid ── */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 space-y-8 mb-16">
        {ARTICLES.map((article, idx) => (
          <article
            key={article.id}
            className="group rounded-2xl border p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border)',
            }}
          >
            {/* Category badge */}
            <span
              className="inline-block px-3 py-1 mb-4 rounded-full text-xs font-semibold tracking-wider uppercase"
              style={{
                backgroundColor: idx === 0 ? 'var(--accent)' : 'transparent',
                color: idx === 0 ? '#fff' : 'var(--accent)',
                border: idx === 0 ? 'none' : '1px solid var(--accent)',
              }}
            >
              {article.category}
            </span>

            <Link href={`/journal/${article.id}`} className="block">
              <h2
                className="text-xl sm:text-2xl font-bold mb-3 group-hover:text-[var(--accent)] transition-colors"
                style={{
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-syne)',
                }}
              >
                {article.title}
              </h2>
            </Link>

            <p className="text-sm sm:text-base leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
              {article.excerpt}
            </p>

            <div
              className="flex items-center gap-4 text-xs"
              style={{ color: 'var(--text-muted)' }}
            >
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {article.readTime}
              </span>
              <span>{article.date}</span>
              <span className="text-[var(--accent)]">— {article.author}</span>
            </div>

            <div className="mt-4">
              <Link
                href={`/journal/${article.id}`}
                className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors duration-200 hover:gap-2.5"
                style={{ color: 'var(--accent)' }}
              >
                <BookOpen className="w-4 h-4" />
                Read Article
                <span className="transition-all duration-200 group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </article>
        ))}
      </section>

      <VipWaitlist />
    </div>
  )
}
