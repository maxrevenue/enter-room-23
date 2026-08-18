import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ProductCard from '@/components/product-card'
import ShopCategoryBar from '@/components/ShopCategoryBar'
import {
  COLLECTIONS,
  getCollection,
  getProductsByCollection,
  titleFromSlug,
} from '@/lib/products'

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
  const products = getProductsByCollection(slug)
  const meta = getCollection(slug)

  if (!meta || (!COLLECTIONS[slug] && products.length === 0)) {
    notFound()
  }

  const title = meta.title || titleFromSlug(slug)
  const countLabel = formatCount(products.length)

  return (
    <main className="min-h-screen bg-theme-bg text-theme-text">
      <section className="px-5 py-16 text-center sm:px-8 sm:py-20 md:py-24">
        <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-theme-muted">
          {countLabel}
        </p>
        <h1 className="mt-5 font-serif text-3xl tracking-tight text-theme-text sm:text-4xl md:text-[2.75rem]">
          {title}
        </h1>
        <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-theme-muted sm:text-[0.9375rem]">
          {meta.subtitle}
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-8 sm:pb-20 md:pb-24">
        <ShopCategoryBar active={slug} />

        {products.length === 0 ? (
          <div className="mx-auto mt-16 max-w-md text-center">
            <p className="text-sm leading-relaxed text-theme-muted">
              Browse the full shop for the current edit.
            </p>
            <Link
              href="/shop"
              className="mt-8 inline-flex min-h-12 items-center justify-center border border-theme-border px-10 py-3.5 text-[11px] font-medium uppercase tracking-[0.24em] text-theme-text transition-colors duration-300 hover:border-theme-muted hover:bg-theme-surface"
            >
              Shop the collection
            </Link>
          </div>
        ) : (
          <ul className="mt-12 grid grid-cols-1 gap-x-8 gap-y-16 sm:mt-16 sm:grid-cols-2 sm:gap-y-20 lg:grid-cols-3">
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
