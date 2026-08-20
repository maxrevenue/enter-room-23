import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ProductCard from '@/components/product-card'
import ShopCategoryBar from '@/components/ShopCategoryBar'
import { resolveCollectionSlug } from '@/lib/categories'
import { listStorefrontProductsByCollection } from '@/lib/admin-catalog'
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
  const products = await listStorefrontProductsByCollection(slug)
  const meta = getCollection(slug)

  if (!meta || (!COLLECTIONS[resolvedSlug] && products.length === 0)) {
    notFound()
  }

  const title = meta.title || titleFromSlug(resolvedSlug)
  const countLabel = formatCount(products.length)
  const barSlug = COLLECTIONS[resolvedSlug] ? resolvedSlug : slug

  return (
    <main className="min-h-screen bg-theme-bg text-theme-text">
      <section className="px-4 py-12 text-center sm:px-8 md:py-24 lg:py-32">
        <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-theme-muted sm:tracking-[0.28em]">
          {countLabel}
        </p>
        <h1 className="mt-5 font-serif text-3xl font-light tracking-tight text-theme-text sm:text-4xl md:text-[2.75rem]">
          {title}
        </h1>
        <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-theme-muted sm:text-[0.9375rem]">
          {meta.subtitle}
        </p>
      </section>

      <ShopCategoryBar active={barSlug} />

      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-8 md:pb-24 lg:pb-32">
        {products.length === 0 ? (
          <div className="mx-auto mt-16 max-w-md text-center">
            <p className="text-sm leading-relaxed text-theme-muted">
              Browse the full shop for the current edit.
            </p>
            <Link
              href="/shop"
              className="mt-8 inline-flex min-h-12 items-center justify-center rounded-none border border-theme-border px-10 py-3.5 text-[11px] font-medium uppercase tracking-[0.24em] text-theme-text transition-colors duration-300 hover:border-theme-muted hover:bg-theme-surface focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-theme-border"
            >
              Shop the collection
            </Link>
          </div>
        ) : (
          <ul className="mt-12 grid grid-cols-2 gap-x-3 gap-y-8 sm:mt-16 sm:gap-x-6 sm:gap-y-10 md:gap-y-12 lg:grid-cols-3 lg:gap-x-8">
            {products.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
