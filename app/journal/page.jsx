import { JOURNAL_ARTICLES } from '@/lib/journal'
import Link from 'next/link'
import { Clock, BookOpen } from 'lucide-react'

export const metadata = {
  title: 'Journal',
  description: 'Wellness education and editorial from Room 23.',
}

export default function JournalPage() {
  return (
    <div className="py-12 sm:py-16">
      <section className="mx-auto max-w-4xl px-4 sm:px-6 text-center mb-14">
        <p className="text-xs uppercase tracking-[0.2em] mb-4" style={{ color: 'var(--accent)' }}>
          Editorial
        </p>
        <h1
          className="text-4xl sm:text-5xl font-bold tracking-tight mb-4"
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-syne)' }}
        >
          Journal
        </h1>
        <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
          Materials, care, and discretion — written for the same six objects on the shop floor.
        </p>
      </section>

      <section className="mx-auto max-w-4xl px-4 sm:px-6 space-y-8 mb-16">
        {JOURNAL_ARTICLES.map((article, idx) => (
          <article
            key={article.id}
            className="group rounded-2xl border p-6 sm:p-8"
            style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
          >
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
                className="text-xl sm:text-2xl font-bold mb-3"
                style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-syne)' }}
              >
                {article.title}
              </h2>
            </Link>

            <p className="text-sm sm:text-base leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
              {article.excerpt}
            </p>

            <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {article.readTime}
              </span>
              <span>{article.date}</span>
            </div>

            <div className="mt-4">
              <Link
                href={`/journal/${article.id}`}
                className="inline-flex items-center gap-1.5 text-sm font-semibold"
                style={{ color: 'var(--accent)' }}
              >
                <BookOpen className="w-4 h-4" />
                Read Article
              </Link>
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}
