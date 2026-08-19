import type { Metadata } from 'next'
import Link from 'next/link'
import { listStorefrontProductsByCollection } from '@/lib/admin-catalog'
import { COLLECTIONS } from '@/lib/products'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Shop Collections - Lubes, Toys & Strokers',
  description:
    'Explore Room 23 collections: lubes, toys, strokers, vibrators, and more. Tightly held groupings of body-safe adult wellness. 18+.',
  alternates: { canonical: '/collections' },
}

export default async function CollectionsPage() {
  const collections = await Promise.all(
    Object.entries(COLLECTIONS).map(async ([slug, collection]) => ({
      slug,
      href: `/collections/${slug}`,
      title: collection.title,
      subtitle: collection.subtitle,
      count: (await listStorefrontProductsByCollection(slug)).length,
    })),
  )

  const visibleCollections = collections.filter((collection) => collection.count > 0)

  return (
    <main className="min-h-screen bg-theme-bg px-5 py-16 text-theme-text sm:px-8 md:py-24 lg:py-32">
      <header className="mx-auto max-w-3xl text-center">
        <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-theme-muted">The edit</p>
        <h1 className="mt-4 font-serif text-3xl font-light tracking-tight text-theme-text sm:text-4xl">
          Collections
        </h1>
        <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-theme-muted">
          Browse by category. Nothing ornamental.
        </p>
      </header>

      <ul className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-4 sm:mt-16 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        {visibleCollections.map((collection) => (
          <li key={collection.slug}>
            <Link
              href={collection.href}
              className="surface-card group flex h-full min-h-[12.5rem] flex-col justify-between focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-theme-border"
            >
              <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-theme-muted">
                {String(collection.count).padStart(2, '0')}{' '}
                {collection.count === 1 ? 'piece' : 'pieces'}
              </span>
              <span className="mt-10 block">
                <span className="block font-serif text-2xl font-light tracking-tight text-theme-text">
                  {collection.title}
                </span>
                <span className="mt-3 block text-sm leading-relaxed text-theme-muted">
                  {collection.subtitle}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
