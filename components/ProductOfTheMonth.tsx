import Image from 'next/image'
import Link from 'next/link'
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

function formatCategory(category?: string) {
  if (!category) return 'The collection'
  return String(category).replace(/-/g, ' ')
}

export default function ProductOfTheMonth({ product = null, offer = null }: ProductOfTheMonthProps) {
  if (!product) return null

  const href = productHref(product)
  const dossierHref = `${href}#dossier`
  const imageSrc = product.image || product.images?.[0]?.url
  const imageAlt = product.images?.[0]?.alt || product.name
  const editorial = product.shortEditorial || product.description
  const compareAt =
    offer?.compareAtPrice != null ? `$${offer.compareAtPrice.toFixed(2)}` : null

  return (
    <section
      aria-labelledby="product-of-month-heading"
      className="border-t border-theme-border px-5 py-24 sm:px-8 sm:py-32 md:py-40"
    >
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 max-w-md sm:mb-14 lg:mb-20">
          <p className="label-meta">This month&apos;s focus</p>
          {offer?.label ? <p className="label-meta mt-3">{offer.label}</p> : null}
        </header>

        <div className="grid grid-cols-1 gap-10 sm:gap-12 lg:grid-cols-12 lg:items-end lg:gap-x-8 lg:gap-y-0">
          <div className="lg:col-span-7">
            {imageSrc ? (
              <Link href={href} className="group block" aria-label={product.name}>
                <div className="product-frame">
                  <Image
                    src={imageSrc}
                    alt={imageAlt}
                    width={800}
                    height={1000}
                    unoptimized
                    className="absolute inset-0 object-contain"
                  />
                </div>
              </Link>
            ) : null}
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <p className="label-meta">{formatCategory(product.category)}</p>
            <h2 id="product-of-month-heading" className="heading-lg mt-5">
              {product.name}
            </h2>

            {product.tagline ? (
              <p className="caption mt-4">{product.tagline}</p>
            ) : null}

            <p className="body-sm mt-6 max-w-sm text-muted">{editorial}</p>

            {product.attributes?.length ? (
              <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
                {product.attributes.map((attribute: string) => (
                  <li key={attribute} className="caption">
                    {attribute}
                  </li>
                ))}
              </ul>
            ) : null}

            <div className="mt-10 flex flex-wrap items-baseline gap-x-5 gap-y-2">
              {compareAt ? (
                <p className="caption line-through">{compareAt}</p>
              ) : null}
              <p className="body-sm">${product.price.toFixed(2)}</p>
            </div>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href={href} className="btn-primary">
                Acquire Object
              </Link>
              <Link href={dossierHref} className="btn-secondary">
                Read Dossier
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
