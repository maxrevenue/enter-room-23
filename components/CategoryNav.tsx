import Link from 'next/link'

const CATEGORIES = [
  {
    label: 'Essentials',
    description: 'Core formulations',
    href: '/collections/essentials',
  },
  {
    label: 'Wellness',
    description: 'Botanical & sensorial',
    href: '/shop',
  },
  {
    label: 'Body',
    description: 'Performance & texture',
    href: '/shop',
  },
  {
    label: 'New',
    description: 'Recent additions',
    href: '/collections/new-arrivals',
  },
  {
    label: 'Accessories',
    description: 'Care & detail',
    href: '/shop',
  },
] as const

export default function CategoryNav() {
  return (
    <section
      aria-labelledby="categories-heading"
      className="border-t border-zinc-800 px-5 py-20 sm:px-8 sm:py-24 md:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <header className="mb-12 sm:mb-14">
          <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-zinc-500">Browse</p>
          <h2
            id="categories-heading"
            className="mt-5 font-serif text-3xl tracking-tight text-zinc-50 sm:text-4xl"
          >
            Categories
          </h2>
        </header>

        <nav aria-label="Product categories">
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 md:gap-4">
            {CATEGORIES.map((category) => (
              <li key={category.label}>
                <Link
                  href={category.href}
                  className="group flex h-full flex-col justify-between border border-zinc-800 bg-zinc-900 px-4 py-5 transition-colors duration-300 hover:border-zinc-700 md:px-5 md:py-6"
                >
                  <span className="font-serif text-sm tracking-[0.08em] text-zinc-50 md:text-base">
                    {category.label}
                  </span>
                  <span className="mt-3 text-[10px] uppercase tracking-[0.18em] text-zinc-500 transition-colors duration-300 group-hover:text-zinc-400">
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
