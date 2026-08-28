import Image from 'next/image'
import Link from 'next/link'
import { categoryLabel } from '@/lib/categories'
import { formatPrice } from '@/lib/format-price'
import { productHref } from '@/lib/products'

export type MonthOffer = {
  label: string
  compareAtPrice?: number
}

type ProductOfTheMonthProps = {
  productId?: string
  product?: {
    id: string
    slug?: string
    name: string
    price: number
    category?: string
    tagline?: string
    shortEditorial?: string
    description?: string
    image?: string
    images?: Array<{ url?: string; alt?: string }>
    attributes?: string[]
  } | null
  offer?: MonthOffer | null
}

const storefrontCtaPrimary =
  'inline-flex min-h-11 w-full items-center justify-center rounded-none bg-primary px-7 py-3 text-[11px] font-medium uppercase tracking-[0.16em] text-primary-foreground transition-colors duration-300 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-theme-border sm:w-auto sm:tracking-[0.2em]'

const storefrontCtaSecondary =
  'inline-flex min-h-11 w-full items-center justify-center rounded-none border border-theme-border px-7 py-3 text-[11px] font-medium uppercase tracking-[0.16em] text-theme-text transition-colors duration-300 hover:border-theme-muted hover:bg-theme-surface focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-theme-border sm:w-auto sm:tracking-[0.2em]'

export default function ProductOfTheMonth({ product = null, offer = null }: ProductOfTheMonthProps) {
  if (!product) return null

  const href = productHref(product)
  const dossierHref = `${href}#dossier`
  const imageSrc = product.image || product.images?.[0]?.url
  const imageAlt = product.images?.[0]?.alt || product.name
  const editorial = product.shortEditorial || product.description
  const compareAt =
    offer?.compareAtPrice != null ? formatPrice(offer.compareAtPrice) : null

  return (
    <section
      aria-labelledby="product-of-month-heading"
      className="border-t border-theme-border px-4 py-20 sm:px-8 md:py-28 lg:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 max-w-md sm:mb-14 lg:mb-16">
          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-theme-muted sm:tracking-[0.28em]">
            Product of the Month
          </p>
        </header>

        <div className="grid grid-cols-1 gap-10 sm:gap-12 lg:grid-cols-12 lg:items-end lg:gap-x-8 lg:gap-y-0">
          <div className="lg:col-span-7">
            {imageSrc ? (
              <Link
                href={href}
                className="group block focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-theme-border"
                aria-label={product.name}
              >
                <div className="product-frame rounded-none">
                  <Image
                    src={imageSrc}
                    alt={imageAlt}
                    width={800}
                    height={1000}
                    unoptimized
                    className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-95"
                  />
                </div>
              </Link>
            ) : null}
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-theme-muted">
              {categoryLabel(product.category)}
            </p>
            <h2
              id="product-of-month-heading"
              className="mt-5 font-serif text-3xl font-light tracking-tight text-theme-text sm:text-4xl"
            >
              {product.name}
            </h2>

            {product.tagline ? (
              <p className="mt-4 text-xs uppercase tracking-[0.18em] text-theme-muted">{product.tagline}</p>
            ) : null}

            <p className="mt-6 max-w-sm text-sm leading-relaxed text-theme-muted">{editorial}</p>

            {product.attributes?.length ? (
              <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
                {product.attributes.map((attribute: string) => (
                  <li key={attribute} className="text-[10px] uppercase tracking-[0.18em] text-theme-muted">
                    {attribute}
                  </li>
                ))}
              </ul>
            ) : null}

            <div className="mt-10 flex flex-wrap items-baseline gap-x-5 gap-y-2">
              {compareAt ? (
                <p className="text-xs uppercase tracking-[0.16em] text-theme-muted line-through">{compareAt}</p>
              ) : null}
              <p className="text-sm tabular-nums text-theme-text/90">{formatPrice(product.price)}</p>
            </div>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href={href} className={storefrontCtaPrimary}>
                Acquire Object
              </Link>
              <Link href={dossierHref} className={storefrontCtaSecondary}>
                Read Dossier
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
