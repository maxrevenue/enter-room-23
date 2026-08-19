import Link from 'next/link'
import { NEW_ARRIVALS_COLLECTION, STORE_CATEGORIES } from '@/lib/categories'
import { getProductsByCollection } from '@/lib/products'

function formatCount(count: number) {
  const padded = String(count).padStart(2, '0')
  return `${padded} ${count === 1 ? 'piece' : 'pieces'}`
}

const HOMEPAGE_CATEGORIES = [
  ...STORE_CATEGORIES.filter((category) =>
    ['lubes', 'strokers', 'toys'].includes(category.id),
  ),
  NEW_ARRIVALS_COLLECTION,
]

export default function CategorySection() {
  const categories = HOMEPAGE_CATEGORIES.map((category) => ({
    slug: category.id,
    label: category.label,
    description: category.subtitle,
    href: `/collections/${category.id}`,
    count: getProductsByCollection(category.id).length,
  })).filter((category) => category.count > 0)

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
            Shop the collection by category — lubes, strokers, toys, and more.
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
