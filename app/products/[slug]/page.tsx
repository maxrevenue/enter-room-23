import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import ProductAddToCart from '@/components/product-add-to-cart'
import { SITE_CONFIG } from '@/config/site'
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

  const related = (product.relatedSlugs || [])
    .map((s: string) => getProductBySlug(s))
    .filter(Boolean)

  const sections = [
    { title: 'Ingredients', body: product.ingredients },
    { title: 'Directions', body: product.directions },
    { title: 'Compatibility', body: product.compatibility },
    { title: 'Care', body: product.care },
    { title: 'Discretion', body: product.discretionNotes },
  ].filter((s) => s.body)

  return (
    <main className="min-h-screen bg-theme-bg text-theme-text">
      <div className="mx-auto max-w-6xl px-6 py-12 lg:py-20">
        <nav className="mb-8 text-[10px] uppercase tracking-[0.2em] text-theme-muted">
          <Link href="/shop" className="hover:text-theme-text/80">
            Shop
          </Link>
          <span className="mx-2">/</span>
          <span className="text-theme-muted">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          <div>
            <AspectRatio ratio={4 / 5} className="overflow-hidden border border-theme-border bg-theme-surface">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={hero.url} alt={hero.alt} className="h-full w-full object-cover" />
            </AspectRatio>

            <div className="mt-4 grid grid-cols-4 gap-3">
              {gallery.map((thumb: { url: string; alt: string }, index: number) => {
                const isActive = index === activeIndex
                return (
                  <Link
                    key={`${thumb.url}-${index}`}
                    href={`${productHref(product)}?image=${index}`}
                    scroll={false}
                    aria-label={`View image ${index + 1}`}
                    aria-current={isActive ? 'true' : undefined}
                    className={`block overflow-hidden border bg-theme-surface ${
                      isActive ? 'border-theme-text/50' : 'border-theme-border'
                    }`}
                  >
                    <AspectRatio ratio={4 / 5}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={thumb.url} alt={thumb.alt} className="h-full w-full object-cover" />
                    </AspectRatio>
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="flex flex-col">
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-theme-muted">
              {product.category === 'essentials' ? 'Intimate Essentials' : product.category}
            </p>
            <h1 className="mt-4 font-serif text-3xl font-normal tracking-tight text-theme-text lg:text-4xl">
              {product.name}
            </h1>
            <p className="mt-5 text-sm tracking-[0.12em] text-theme-muted">{formatPrice(product.price)}</p>
            <p className="mt-8 max-w-md text-sm leading-7 tracking-wide text-theme-muted">
              {product.shortEditorial || product.description}
            </p>

            {product.attributes?.length ? (
              <ul className="mt-8 flex flex-wrap gap-2">
                {product.attributes.map((attribute: string) => (
                  <li
                    key={attribute}
                    className="border border-theme-border px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-theme-muted"
                  >
                    {attribute}
                  </li>
                ))}
              </ul>
            ) : null}

            <div className="mt-10">
              <ProductAddToCart product={product} />
            </div>

            <div className="mt-6 space-y-2 border border-theme-border bg-theme-surface/50 p-4 text-xs leading-relaxed text-theme-muted">
              <p>
                Free standard shipping on orders over ${SITE_CONFIG.freeShippingThreshold.toFixed(0)}. See{' '}
                <Link href="/shipping" className="text-theme-text/90 underline underline-offset-2">
                  Shipping &amp; Returns
                </Link>
                .
              </p>
              <p>
                Unopened items: 14-day return window. Opened intimate goods and liquids are final sale.
                Adults 18+ only. Charges appear as{' '}
                <span className="font-mono text-theme-text/90">{SITE_CONFIG.billingDescriptor}</span>.
              </p>
            </div>

            {product.materialsSpec?.length ? (
              <div className="mt-10 border-t border-theme-border pt-8">
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="text-[10px] font-medium uppercase tracking-[0.28em] text-theme-muted">
                    Materials
                  </h2>
                  <Link
                    href="/standards"
                    className="text-[10px] uppercase tracking-[0.2em] text-theme-muted hover:text-theme-text/80"
                  >
                    Our standards
                  </Link>
                </div>
                <dl className="mt-4 space-y-3">
                  {product.materialsSpec.map((row: { label: string; value: string }) => (
                    <div key={row.label} className="grid grid-cols-3 gap-3 text-sm">
                      <dt className="text-theme-muted">{row.label}</dt>
                      <dd className="col-span-2 text-theme-text/80">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}

            <div className="mt-10 space-y-8 border-t border-theme-border pt-8">
              {sections.map((section) => (
                <section key={section.title}>
                  <h2 className="text-[10px] font-medium uppercase tracking-[0.28em] text-theme-muted">
                    {section.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 tracking-wide text-theme-muted">{section.body}</p>
                </section>
              ))}
            </div>
          </div>
        </div>

        {related.length > 0 ? (
          <section className="mt-20 border-t border-theme-border pt-12">
            <h2 className="mb-8 text-center text-[10px] uppercase tracking-[0.28em] text-theme-muted">
              You may also like
            </h2>
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {related.map((item: any) => (
                <li key={item.id}>
                  <Link href={productHref(item)} className="group block border border-theme-border bg-theme-surface">
                    <AspectRatio ratio={4 / 5}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    </AspectRatio>
                    <div className="p-4">
                      <p className="font-serif text-sm text-theme-text">{item.name}</p>
                      <p className="mt-1 text-xs text-theme-muted">{formatPrice(item.price)}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </main>
  )
}
