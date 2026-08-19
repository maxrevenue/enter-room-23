import Link from 'next/link'
import { NEW_ARRIVALS_COLLECTION, STORE_CATEGORIES } from '@/lib/categories'

const NAV_CATEGORIES = [
  ...STORE_CATEGORIES.filter((category) =>
    ['lubes', 'strokers', 'toys', 'vibrators'].includes(category.id),
  ),
  NEW_ARRIVALS_COLLECTION,
]

export default function CategoryNav() {
  return (
    <section
      aria-labelledby="categories-heading"
      className="border-t border-theme-border px-5 py-20 sm:px-8 sm:py-24 md:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <header className="mb-12 sm:mb-14">
          <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-theme-muted">Browse</p>
          <h2
            id="categories-heading"
            className="mt-5 font-serif text-3xl tracking-tight text-theme-text sm:text-4xl"
          >
            Categories
          </h2>
        </header>

        <nav aria-label="Product categories">
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 md:gap-4">
            {NAV_CATEGORIES.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/collections/${category.id}`}
                  className="group flex h-full flex-col justify-between border border-theme-border bg-theme-surface px-4 py-5 transition-colors duration-300 hover:border-theme-muted md:px-5 md:py-6"
                >
                  <span className="font-serif text-sm tracking-[0.08em] text-theme-text md:text-base">
                    {category.label}
                  </span>
                  <span className="mt-3 text-[10px] uppercase tracking-[0.18em] text-theme-muted transition-colors duration-300 group-hover:text-theme-text/80">
                    {category.subtitle.split('.')[0]}
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
