import Link from 'next/link'

const CATEGORIES = [
  {
    label: 'Essentials',
    href: '/collections/essentials',
    description: 'Lubricants and everyday staples',
  },
  {
    label: 'Wellness',
    href: '/shop?category=wellness',
    description: 'Sprays, mists, and intimate care',
  },
  {
    label: 'Body',
    href: '/shop?category=wellness',
    description: 'Oils, gels, and sensorial rituals',
  },
  {
    label: 'Toys',
    href: '/shop?category=toys',
    description: 'Body-safe pieces for solo and shared play',
  },
  {
    label: 'New',
    href: '/collections/new-arrivals',
    description: 'Latest additions to the edit',
  },
] as const

export default function CategorySection() {
  return (
    <section
      aria-labelledby="categories-heading"
      className="border-t border-theme-border px-5 py-20 sm:px-8 sm:py-24 md:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <header className="mb-12 sm:mb-14">
          <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-theme-muted">Browse by</p>
          <h2
            id="categories-heading"
            className="mt-5 font-serif text-3xl tracking-tight text-theme-text sm:text-4xl"
          >
            Categories
          </h2>
        </header>

        <nav aria-label="Product categories">
          <ul className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 md:grid-cols-5 md:gap-4">
            {CATEGORIES.map((category) => (
              <li key={category.label} className="shrink-0 sm:shrink">
                <Link
                  href={category.href}
                  className="group flex h-full min-w-[9.5rem] flex-col justify-between border border-theme-border bg-theme-surface px-4 py-5 transition-colors duration-300 hover:border-theme-muted sm:min-w-0 md:px-5 md:py-6"
                >
                  <span className="font-serif text-sm tracking-[0.08em] text-theme-text md:text-base">
                    {category.label}
                  </span>
                  <span className="mt-3 text-[10px] uppercase tracking-[0.18em] text-theme-muted transition-colors duration-300 group-hover:text-theme-text/80">
                    {category.description}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  )
}
