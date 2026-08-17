import Link from 'next/link'
import { JOURNAL_ARTICLES } from '@/lib/journal'

const FEATURED_ARTICLES = JOURNAL_ARTICLES.slice(0, 3)

export default function HomeJournal() {
  return (
    <section aria-labelledby="journal-heading" className="border-t border-zinc-800 px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <header className="mb-12 flex flex-col items-start justify-between gap-6 md:mb-16 md:flex-row md:items-end">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-500">Editorial</p>
            <h2
              id="journal-heading"
              className="mt-4 font-serif text-xl uppercase tracking-[0.28em] text-white md:text-2xl"
            >
              Journal
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-zinc-500">
              Materials, care, and discretion — written for the same considered edit on the shop floor.
            </p>
          </div>

          <Link
            href="/journal"
            className="inline-flex shrink-0 items-center justify-center border border-zinc-800 px-6 py-2.5 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-300"
          >
            View All
          </Link>
        </header>

        <ul className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {FEATURED_ARTICLES.map((article, index) => (
            <li key={article.id}>
              <Link
                href={`/journal/${article.id}`}
                className="group flex h-full flex-col border border-zinc-800 bg-zinc-900 p-6 md:p-8"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">{article.category}</p>
                  {index === 0 ? (
                    <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-600">Latest</p>
                  ) : null}
                </div>

                <h3 className="mt-5 font-serif text-lg leading-snug tracking-wide text-white md:text-xl">
                  {article.title}
                </h3>

                <p className="mt-4 flex-1 text-sm leading-relaxed text-zinc-400">{article.excerpt}</p>

                <div className="mt-6 flex items-center justify-between gap-4 border-t border-zinc-800 pt-5">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-600">{article.readTime}</p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 group-hover:text-zinc-400">
                    Read
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
