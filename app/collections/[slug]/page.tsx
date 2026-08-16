import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { COLLECTIONS, getProductsByCollection, productHref } from '@/lib/products'

type PageProps = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return Object.keys(COLLECTIONS).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const meta = COLLECTIONS[slug]
  if (!meta) return { title: 'Collection' }
  return { title: meta.title, description: meta.description }
}

export default async function CollectionPage({ params }: PageProps) {
  const { slug } = await params
  const meta = COLLECTIONS[slug]
  if (!meta) notFound()

  const products = getProductsByCollection(slug)

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <section className="border-b border-zinc-800 px-6 py-20 text-center">
        <h1 className="font-serif text-3xl tracking-tight md:text-4xl">{meta.title}</h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-zinc-400">{meta.subtitle}</p>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        {products.length === 0 ? (
          <p className="text-center text-sm text-zinc-500">
            Browse the{' '}
            <Link href="/shop" className="text-zinc-300 underline">
              full shop
            </Link>{' '}
            while this grouping updates.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <li key={product.id}>
                <Link href={productHref(product)} className="group block border border-zinc-800 bg-zinc-900">
                  <AspectRatio ratio={1}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                  </AspectRatio>
                  <div className="p-5">
                    <h2 className="font-serif text-base text-white">{product.name}</h2>
                    <p className="mt-2 text-sm text-zinc-500">${product.price.toFixed(2)}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
