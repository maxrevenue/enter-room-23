import type { Metadata } from 'next'
import Link from 'next/link'
import { COLLECTIONS, getProductsByCollection } from '@/lib/products'

export const metadata: Metadata = {
  title: 'Shop Collections - Essentials, Wellness & Toys',
  description:
    'Explore Room 23 collections: essentials, wellness, body care, toys, and new arrivals. Tightly held groupings of body-safe adult wellness. 18+.',
  alternates: { canonical: '/collections' },
}

export default function CollectionsPage() {
  const collections = Object.entries(COLLECTIONS).map(([slug, collection]) => ({
    slug,
    href: `/collections/${slug}`,
    title: collection.title,
    subtitle: collection.subtitle,
    count: getProductsByCollection(slug).length,
  }))

  return (
    <main className="min-h-screen bg-theme-bg px-5 py-16 text-theme-text sm:px-8 sm:py-20">
      <header className="mx-auto max-w-3xl text-center">
        <p className="label-meta">The edit</p>
        <h1 className="heading-md mt-4">Collections</h1>
        <p className="body-sm mx-auto mt-6 max-w-md text-muted">
          Tightly held groupings. Nothing ornamental.
        </p>
      </header>

      <ul className="mx-auto mt-14 grid max-w-6xl grid-cols-1 gap-4 sm:mt-16 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        {collections.map((collection) => (
          <li key={collection.slug}>
            <Link
              href={collection.href}
              className="surface-card group flex h-full min-h-[12.5rem] flex-col justify-between"
            >
              <span className="label-meta">
                {String(collection.count).padStart(2, '0')}{' '}
                {collection.count === 1 ? 'piece' : 'pieces'}
              </span>
              <span className="mt-10 block">
                <span className="heading-sm block">{collection.title}</span>
                <span className="body-sm mt-3 block text-muted">{collection.subtitle}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
