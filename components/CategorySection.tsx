import Link from 'next/link'
import { getProductsByCollection } from '@/lib/products'

const CATEGORIES = [
  {
    slug: 'essentials',
    label: 'Essentials',
    description: 'Lubricants and everyday staples',
  },
  {
    slug: 'wellness',
    label: 'Wellness',
    description: 'Sprays, mists, and intimate care',
  },
  {
    slug: 'body',
    label: 'Body',
    description: 'Oils, gels, and sensorial rituals',
  },
  {
    slug: 'toys',
    label: 'Toys',
    description: 'Body-safe pieces for solo and shared play',
  },
  {
    slug: 'new-arrivals',
    label: 'New Arrivals',
    description: 'Latest additions to the edit',
  },
] as const

function formatCount(count: number) {
  const padded = String(count).padStart(2, '0')
  return `${padded} ${count === 1 ? 'piece' : 'pieces'}`
}

export default function CategorySection() {
  const categories = CATEGORIES.map((category) => ({
    ...category,
    href: `/collections/${category.slug}`,
    count: getProductsByCollection(category.slug).length,
  }))

  return (
    <section
      aria-labelledby="categories-heading"
      className="border-t border-theme-border px-5 py-20 sm:px-8 sm:py-24 md:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <header className="mb-12 sm:mb-16">
          <p className="label-meta">Browse by</p>
          <h2 id="categories-heading" className="heading-md mt-5">
            Categories
          </h2>
          <p className="body-sm mt-5 max-w-md text-muted">
            Five rooms of the edit. Each card opens a live collection.
          </p>
        </header>

        <nav aria-label="Product categories">
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link
                  href={category.href}
                  className="surface-card group flex h-full min-h-[12.5rem] flex-col justify-between"
                >
                  <span className="label-meta">{formatCount(category.count)}</span>
                  <span className="mt-10 block">
                    <span className="heading-sm block">{category.label}</span>
                    <span className="body-sm mt-3 block text-muted">{category.description}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-10 sm:mt-12">
          <Link href="/collections" className="btn-secondary">
            All collections
          </Link>
        </div>
      </div>
    </section>
  )
}
