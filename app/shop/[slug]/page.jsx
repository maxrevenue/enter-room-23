import { PRODUCTS as products } from '@/lib/products'
import { SITE_CONFIG } from '@/config/site'
import { AddToCartButton, RelatedProductButton } from '@/components/add-to-cart-button'
import { Shield, Truck } from 'lucide-react'
import Link from 'next/link'
import ProductArtwork from '@/components/product-artwork'

export const dynamic = 'force-dynamic'

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

const CROSS_SELLS = [
  { name: 'Cleansing Spray', price: 14, size: '4 oz', id: 'addon-cleaner-01' },
  { name: 'Storage Pouch', price: 12, size: 'One Size', id: 'addon-pouch-01' },
]

const RELATED_MAP = {
  'signature-water-based-lubricant': CROSS_SELLS,
  'platinum-silicone-lubricant': CROSS_SELLS,
  'hybrid-lubricant': CROSS_SELLS,
}

const TRUST_BADGES = [
  { icon: Shield, label: 'Body-Safe Formula' },
  { icon: Truck, label: `Free Shipping $${SITE_CONFIG.freeShippingThreshold}+` },
]

export default async function PDP({ params }) {
  const resolvedParams = typeof params?.then === 'function' ? await params : params
  const slug = resolvedParams?.slug || params?.slug
  const product = products.find(
    (p) => slugify(p.name) === slug || p.id === slug
  )

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-neutral-500 mb-6">
          We couldn&apos;t find the product you&apos;re looking for.
        </p>
        <Link
          href="/shop"
          className="px-6 py-2 bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 rounded-lg text-sm uppercase tracking-widest hover:opacity-80 transition-opacity"
        >
          Back to Shop
        </Link>
      </div>
    )
  }

  const related = RELATED_MAP[slug] || []

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || `${product.name} by ${SITE_CONFIG.name} — premium personal care.`,
    image: undefined,
    sku: product.name.replace(/\s+/g, '-').toLowerCase(),
    brand: { '@type': 'Brand', name: SITE_CONFIG.name },
    offers: {
      '@type': 'Offer',
      price: product.price.toFixed(2),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: `${SITE_CONFIG.domain}/shop/${slug}`,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
        {/* Breadcrumb */}
        <nav className="mb-8 text-xs uppercase tracking-widest text-neutral-400">
          <Link href="/shop" className="hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">
            Shop
          </Link>
          <span className="mx-2">/</span>
          <span className="text-neutral-800 dark:text-neutral-200">{product.name}</span>
        </nav>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          {/* Product Image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
            <ProductArtwork productId={product.id} category={product.category} className="w-full h-full" />
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center">
            <h1 className="text-2xl md:text-3xl font-bold mb-2 tracking-tight">
              {product.name}
            </h1>
            {product.size && (
              <span className="text-xs uppercase tracking-widest text-neutral-500 mb-4 block">
                {product.size}
              </span>
            )}

            <p className="text-3xl font-semibold mb-6 tabular-nums">
              ${product.price.toFixed(2)}
            </p>

            {product.description && (
              <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed mb-8">
                {product.description}
              </p>
            )}

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4 mb-8">
              {TRUST_BADGES.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 text-xs text-neutral-500"
                >
                  <Icon size={14} />
                  <span>{label}</span>
                </div>
              ))}
            </div>

            {/* Client-side Add-to-Cart */}
            <AddToCartButton product={product} />

            {/* Trust reassurance */}
            <div className="mt-8 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-700">
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                <strong className="text-neutral-700 dark:text-neutral-300">
                  {SITE_CONFIG.name} Assurance:
                </strong>{' '}
                Every product is dermatologist-tested, hypoallergenic, and backed by our
                30-day satisfaction guarantee. Ships via{' '}
                {SITE_CONFIG.carriers.join(', ')}.
              </p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-20 pt-12 border-t border-neutral-200 dark:border-neutral-800">
            <h2 className="text-sm uppercase tracking-[0.2em] text-neutral-500 mb-8 text-center">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl mx-auto">
              {related.map((item) => (
                <div
                  key={item.name}
                  className="flex gap-4 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-700"
                >
                  <div className="w-16 h-16 rounded-lg flex-shrink-0 overflow-hidden" style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                    <ProductArtwork productId={item.id} category="accessories" className="w-full h-full" />
                  </div>
                  <div className="flex flex-col justify-between flex-1 min-w-0">
                    <div>
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-neutral-500">{item.size}</p>
                      <p className="text-sm font-semibold mt-1">${item.price.toFixed(2)}</p>
                    </div>
                    <RelatedProductButton product={item} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  )
}
