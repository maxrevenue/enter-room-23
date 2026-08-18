import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ProductCard from '@/components/product-card'
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

export default async function CollectionPage({ params }: PageProps) {
  const { slug } = await params
  const products = getProductsByCollection(slug)
  const meta = getCollection(slug)

  if (!meta || (!COLLECTIONS[slug] && products.length === 0)) {
    notFound()
  }

  const title = meta.title || titleFromSlug(slug)
  const countLabel = `${String(products.length).padStart(2, '0')} ${
    products.length === 1 ? 'piece' : 'pieces'
  }`

  return (
    <main className="min-h-screen bg-theme-bg text-theme-text">
      <section className="border-b border-theme-border px-5 py-16 text-center sm:px-8 sm:py-20 md:py-24">
        <p className="label-meta">{countLabel}</p>
        <h1 className="heading-md mt-5">{title}</h1>
        <p className="body-sm mx-auto mt-5 max-w-xl text-muted">{meta.subtitle}</p>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        {products.length === 0 ? (
          <div className="mx-auto max-w-md text-center">
            <p className="body-sm text-muted">Browse the full shop for the current edit.</p>
            <Link href="/shop" className="btn-secondary mt-8">
              Shop the collection
            </Link>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 sm:gap-y-20 lg:grid-cols-3">
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
