import Link from 'next/link'

const JOURNAL_NOTES = [
  {
    href: '/journal/lubricant-formulations',
    tag: 'Materials',
    title: 'Understanding Lubricant Formulations',
    excerpt:
      'Water, silicone, hybrid — a clear reading of ingredient decks and material compatibility, so you choose with confidence.',
  },
  {
    href: '/journal/wellness-maintenance',
    tag: 'Wellness',
    title: 'The Art of Intimate Wellness Maintenance',
    excerpt:
      'pH-conscious care, barrier-friendly routines, and why the most sensitive skin deserves formulations as considered as the rest of your regimen.',
  },
  {
    href: '/journal/discreet-luxury',
    tag: 'Lifestyle',
    title: 'Why Discretion Is the Ultimate Luxury',
    excerpt:
      'Unbranded cartons, quiet packing slips, and the composure of keeping a private life private.',
  },
] as const

export default function HomeJournal() {
  return (
    <section
      aria-labelledby="journal-heading"
      className="border-t border-zinc-800 px-5 py-24 sm:px-8 sm:py-32 md:py-40"
    >
      <div className="mx-auto max-w-6xl">
        <header className="mb-16 sm:mb-20 md:mb-24">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between md:gap-12">
            <div className="max-w-xl">
              <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-zinc-500">
                Editorial
              </p>
              <h2
                id="journal-heading"
                className="mt-5 font-serif text-3xl tracking-tight text-zinc-50 sm:text-4xl md:text-[2.75rem]"
              >
                From the Journal
              </h2>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-zinc-500 sm:text-[0.9375rem]">
                Notes on materials, maintenance, and the quieter side of adult wellness.
              </p>
            </div>
            <Link
              href="/journal"
              className="inline-flex min-h-12 shrink-0 items-center text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-400 transition-colors duration-300 hover:text-zinc-50"
            >
              Read the Journal
            </Link>
          </div>
        </header>

        <ul className="grid grid-cols-1 gap-14 sm:grid-cols-3 sm:gap-10 lg:gap-16">
          {JOURNAL_NOTES.map((note) => (
            <li key={note.href} className="border-t border-zinc-800 pt-9 sm:pt-10">
              <Link href={note.href} className="group block">
                <p className="text-[10px] uppercase tracking-[0.24em] text-zinc-500">
                  {note.tag}
                </p>
                <h3 className="mt-6 font-serif text-xl leading-snug tracking-wide text-zinc-50 transition-colors duration-300 group-hover:text-white sm:text-[1.4rem]">
                  {note.title}
                </h3>
                <p className="mt-5 text-sm leading-relaxed text-zinc-400">{note.excerpt}</p>
                <p className="mt-10 inline-flex min-h-12 items-center text-[10px] uppercase tracking-[0.2em] text-zinc-500 transition-colors duration-300 group-hover:text-zinc-300">
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
