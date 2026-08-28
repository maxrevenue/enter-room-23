import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ProductCard from '@/components/product-card'
import { resolveCollectionSlug } from '@/lib/categories'
import { listStorefrontProducts, listStorefrontProductsByCollection } from '@/lib/admin-catalog'
import { buildNewBadgeAllowlist } from '@/lib/product-badge'
import {
  COLLECTIONS,
  getCollection,
  titleFromSlug,
} from '@/lib/products'

export const dynamic = 'force-dynamic'

type PageProps = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return Object.keys(COLLECTIONS).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const meta = getCollection(slug)
  if (!meta) return { title: 'Collection' }
  const description = [meta.description, meta.subtitle].filter(Boolean).join(' ')
  return {
    title: `${meta.title} - Adult Wellness Collection`,
    description: description.length > 155 ? `${description.slice(0, 154).replace(/\s+\S*$/, '')}…` : description,
    alternates: { canonical: `/collections/${slug}` },
  }
}

function formatCount(count: number) {
  const padded = String(count).padStart(2, '0')
  return `${padded} ${count === 1 ? 'piece' : 'pieces'}`
}

export default async function CollectionPage({ params }: PageProps) {
  const { slug } = await params
  const resolvedSlug = resolveCollectionSlug(slug)
  const [products, allProducts] = await Promise.all([
    listStorefrontProductsByCollection(slug),
    listStorefrontProducts(),
  ])
  const meta = getCollection(slug)
  const newBadgeAllowlist = buildNewBadgeAllowlist(allProducts)

  if (!meta || (!COLLECTIONS[resolvedSlug] && products.length === 0)) {
    notFound()
  }

  const title = meta.title || titleFromSlug(resolvedSlug)
  const countLabel = formatCount(products.length)

  return (
    <main className="min-h-screen bg-theme-bg text-theme-text">
      <section className="mx-auto max-w-6xl px-4 pt-8 pb-6 sm:px-8 md:pt-12 md:pb-10">
        <header className="flex items-end justify-between gap-6 border-b border-theme-border pb-6 md:pb-8">
          <div className="min-w-0 text-left">
            <h1 className="font-serif text-2xl font-light tracking-tight text-theme-text sm:text-4xl md:text-[2.75rem]">
              {title}
            </h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-theme-muted sm:mt-4 sm:text-[0.9375rem]">
              {meta.subtitle}
            </p>
          </div>
          <p className="shrink-0 text-[10px] font-medium uppercase tracking-[0.22em] text-theme-muted">
            {countLabel}
          </p>
        </header>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-8 md:pb-24 lg:pb-28">
        {products.length === 0 ? (
          <div className="mx-auto max-w-md text-center">
            <p className="text-sm leading-relaxed text-theme-muted">
              Browse the full shop for the current edit.
            </p>
            <Link
              href="/shop"
              className="storefront-cta-secondary mt-8"
            >
              Shop the collection
            </Link>
          </div>
        ) : (
          <ul className="grid grid-cols-2 gap-x-3 gap-y-7 sm:gap-x-5 sm:gap-y-9 md:gap-y-10 lg:grid-cols-3 lg:gap-x-8">
            {products.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} newBadgeAllowlist={newBadgeAllowlist} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
