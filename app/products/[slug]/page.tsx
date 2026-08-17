import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ProductAddToCart from '@/components/product-add-to-cart'
import ProductCard from '@/components/product-card'
import { SITE_CONFIG } from '@/config/site'
import { INVENTORY_STATUS } from '@/lib/inventory'
import { PRODUCTS, getProductBySlug, productHref } from '@/lib/products'

type PageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ image?: string }>
}

export async function generateStaticParams() {
  const slugs = new Set<string>()
  for (const p of PRODUCTS) {
    slugs.add(p.slug)
    slugs.add(p.id)
    if (Array.isArray(p.aliases)) p.aliases.forEach((a: string) => slugs.add(a))
  }
  return Array.from(slugs).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) return { title: 'Product' }
  return {
    title: product.name,
    description: product.shortEditorial || product.description,
  }
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)
}

function formatCategory(category?: string) {
  if (!category) return 'The collection'
  return String(category).replace(/-/g, ' ')
}

export default async function ProductPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const { image } = await searchParams
  const product = getProductBySlug(slug)
  if (!product) notFound()

  const gallery = product.images?.length
    ? product.images
    : [{ url: product.image, alt: product.name }]
  const activeIndex = Math.min(
    Math.max(Number.parseInt(image ?? '0', 10) || 0, 0),
    gallery.length - 1,
  )
  const hero = gallery[activeIndex]
  const soldOut = product.inventoryStatus === INVENTORY_STATUS.OUT_OF_STOCK

  const specSections = [
    { title: 'Ingredients', body: product.ingredients },
    { title: 'Directions', body: product.directions },
    { title: 'Compatibility', body: product.compatibility },
    { title: 'Care', body: product.care },
  ].filter((section) => section.body)

  const relatedIds = new Set<string>([product.id])
  const related = []
  for (const relatedSlug of product.relatedSlugs || []) {
    const item = getProductBySlug(relatedSlug)
    if (item && !relatedIds.has(item.id)) {
      related.push(item)
      relatedIds.add(item.id)
    }
  }
  for (const item of PRODUCTS) {
    if (related.length >= 3) break
    if (!relatedIds.has(item.id)) {
      related.push(item)
      relatedIds.add(item.id)
    }
  }

  return (
    <div className="bg-zinc-950 text-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:py-20">
        <nav className="mb-8 text-[10px] uppercase tracking-[0.2em] text-zinc-500 sm:mb-10">
          <Link href="/shop" className="transition-colors hover:text-zinc-300">
            Shop
          </Link>
          <span className="mx-2 text-zinc-700">/</span>
          <span className="text-zinc-400">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          <div>
            <div className="aspect-[4/5] overflow-hidden border border-zinc-800 bg-zinc-950">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={hero.url}
                alt={hero.alt || product.name}
                className="h-full w-full object-cover"
              />
            </div>

            {gallery.length > 1 ? (
              <ul className="mt-3 flex gap-2 sm:mt-4 sm:gap-3">
                {gallery.map((thumb: { url: string; alt: string }, index: number) => {
                  const isActive = index === activeIndex
                  return (
                    <li key={`${thumb.url}-${index}`} className="w-16 flex-shrink-0 sm:w-20">
                      <Link
                        href={`${productHref(product)}?image=${index}`}
                        scroll={false}
                        aria-label={`View image ${index + 1}`}
                        aria-current={isActive ? 'true' : undefined}
                        className={`block aspect-[4/5] overflow-hidden border bg-zinc-950 ${
                          isActive ? 'border-zinc-400' : 'border-zinc-800'
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={thumb.url}
                          alt={thumb.alt || product.name}
                          className="h-full w-full object-cover"
                        />
                      </Link>
                    </li>
                  )
                })}
              </ul>
            ) : null}
          </div>

          <div className="flex flex-col lg:pt-2">
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-500">
              {formatCategory(product.category)}
            </p>
            <h1 className="mt-3 font-serif text-3xl font-normal tracking-tight text-white sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-4 text-base tracking-wide text-zinc-300">
              {formatPrice(product.price)}
            </p>

            <p className="mt-8 max-w-md text-sm leading-7 text-zinc-400">
              {product.shortEditorial || product.description}
            </p>

            {product.attributes?.length ? (
              <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
                {product.attributes.map((attribute: string) => (
                  <li
                    key={attribute}
                    className="text-[10px] uppercase tracking-[0.18em] text-zinc-500"
                  >
                    {attribute}
                  </li>
                ))}
              </ul>
            ) : null}

            <div className="mt-10 max-w-md">
              {soldOut ? (
                <p className="border border-zinc-800 px-6 py-3.5 text-center text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                  Currently unavailable
                </p>
              ) : (
                <ProductAddToCart product={product} />
              )}
            </div>

            <p className="mt-6 max-w-md text-xs leading-relaxed text-zinc-500">
              Complimentary standard shipping on orders over $
              {SITE_CONFIG.freeShippingThreshold.toFixed(0)}. Unopened items may be returned
              within 14 days.{' '}
              <Link
                href="/shipping"
                className="text-zinc-400 underline underline-offset-4 transition-colors hover:text-zinc-200"
              >
                Shipping &amp; returns
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-12 border-t border-zinc-800 pt-12 sm:mt-20 sm:gap-14 sm:pt-16 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="font-serif text-xl tracking-tight text-white sm:text-2xl">
              Details
            </h2>
          </div>

          <div className="space-y-12 lg:col-span-8">
            <section>
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-500">
                  Materials / Formula
                </h3>
                <Link
                  href="/standards"
                  className="text-[10px] uppercase tracking-[0.18em] text-zinc-600 transition-colors hover:text-zinc-400"
                >
                  Our standards
                </Link>
              </div>
              {product.materialsSpec?.length ? (
                <dl className="mt-5 space-y-4">
                  {product.materialsSpec.map((row: { label: string; value: string }) => (
                    <div
                      key={row.label}
                      className="grid grid-cols-1 gap-1 sm:grid-cols-3 sm:gap-4"
                    >
                      <dt className="text-sm text-zinc-500">{row.label}</dt>
                      <dd className="text-sm leading-relaxed text-zinc-300 sm:col-span-2">
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="mt-5 text-sm leading-7 text-zinc-400">
                  {product.materials || product.specifications}
                </p>
              )}
            </section>

            {specSections.map((section) => (
              <section key={section.title}>
                <h3 className="text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-500">
                  {section.title}
                </h3>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-400">{section.body}</p>
              </section>
            ))}

            <aside className="border-t border-zinc-800 pt-10">
              <h3 className="text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-500">
                Discretion
              </h3>
              <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-400">
                Orders leave in plain, unmarked packaging. Charges appear as{' '}
                {SITE_CONFIG.billingDescriptor}.
              </p>
            </aside>
          </div>
        </div>

        {related.length > 0 ? (
          <section className="mt-16 border-t border-zinc-800 pt-12 sm:mt-20 sm:pt-16">
            <h2 className="mb-10 font-serif text-xl tracking-tight text-white sm:mb-12 sm:text-2xl">
              You may also like
            </h2>
            <ul className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
              {related.slice(0, 3).map((item) => (
                <li key={item.id}>
                  <ProductCard product={item} />
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </div>
  )
}
