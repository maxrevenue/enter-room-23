import Link from 'next/link'
import { JOURNAL_ARTICLES } from '@/lib/journal'

export default function JournalSection() {
  const [featured, ...rest] = JOURNAL_ARTICLES

  return (
    <section
      aria-labelledby="journal-heading"
      className="border-t border-theme-border px-4 py-20 sm:px-8 md:py-28 lg:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <header className="mb-16 sm:mb-20 md:mb-24">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between md:gap-12">
            <div className="max-w-xl">
              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-theme-muted sm:tracking-[0.28em]">
                Editorial
              </p>
              <h2
                id="journal-heading"
                className="mt-5 font-serif text-3xl font-light tracking-tight text-theme-text sm:text-4xl md:text-[2.75rem]"
              >
                From the Journal
              </h2>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-theme-muted sm:text-[0.9375rem]">
                Materials, care, and discretion — written with the same restraint as the collection.
              </p>
            </div>
            <Link
              href="/journal"
              className="inline-flex min-h-12 shrink-0 items-center rounded-none text-[10px] font-medium uppercase tracking-[0.22em] text-theme-muted transition-colors duration-300 hover:text-theme-text focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-theme-border"
            >
              Read the Journal
            </Link>
          </div>
        </header>

        {featured ? (
          <article className="mb-14 border border-theme-border bg-theme-surface sm:mb-16">
            <Link href={`/journal/${featured.id}`} className="group block p-6 sm:p-10">
              <p className="text-[10px] uppercase tracking-[0.24em] text-theme-muted">{featured.category}</p>
              <h3 className="mt-5 max-w-2xl font-serif text-2xl font-light leading-snug tracking-wide text-theme-text sm:text-3xl md:text-4xl">
                {featured.title}
              </h3>
              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-theme-muted sm:text-[0.9375rem]">
                {featured.excerpt}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4 text-[10px] uppercase tracking-[0.16em] text-theme-muted">
                <span>{featured.readTime}</span>
                <span aria-hidden="true">·</span>
                <span>{featured.date}</span>
              </div>
              <p className="mt-10 inline-flex min-h-12 items-center text-[10px] uppercase tracking-[0.2em] text-theme-muted transition-colors duration-300 group-hover:text-theme-text/80">
                Continue reading
              </p>
            </Link>
          </article>
        ) : null}

        <ul className="grid grid-cols-1 gap-14 sm:grid-cols-2 sm:gap-10 lg:gap-16">
          {rest.map((note) => (
            <li key={note.id} className="border-t border-theme-border pt-9 sm:pt-10">
              <Link href={`/journal/${note.id}`} className="group block">
                <p className="text-[10px] uppercase tracking-[0.24em] text-theme-muted">{note.category}</p>
                <h3 className="mt-6 font-serif text-xl font-light leading-snug tracking-wide text-theme-text transition-colors duration-300 group-hover:text-theme-text/90 sm:text-[1.4rem]">
                  {note.title}
                </h3>
                <p className="mt-5 text-sm leading-relaxed text-theme-muted">{note.excerpt}</p>
                <p className="mt-10 inline-flex min-h-12 items-center text-[10px] uppercase tracking-[0.2em] text-theme-muted transition-colors duration-300 group-hover:text-theme-text/80">
                  Continue reading
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
