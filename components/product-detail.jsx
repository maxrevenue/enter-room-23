import Link from 'next/link'
import ProductGallery from '@/components/product-gallery'
import { AddToCartButton } from '@/components/add-to-cart-button'
import ProductSpecs from '@/components/ProductSpecs'
import ProductCard from '@/components/product-card'
import { SITE_CONFIG } from '@/config/site'
import { getRelatedProducts, productPath } from '@/lib/products'

export default function ProductDetail({ product }) {
  const related = getRelatedProducts(product, 3)

  return (
    <main className="min-h-screen bg-theme-bg text-theme-text">
      <div className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
        <nav className="mb-8 text-xs uppercase tracking-widest text-theme-muted">
          <Link href="/shop" className="hover:text-theme-text/80">Shop</Link>
          <span className="mx-2">/</span>
          <span className="text-theme-text/90">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          <ProductGallery product={product} />

          <div className="flex flex-col">
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-theme-muted">
              {product.category}
            </p>
            <h1 className="mt-4 font-serif text-3xl font-normal tracking-tight text-theme-text lg:text-4xl">
              {product.name}
            </h1>
            <p className="mt-5 text-sm tracking-[0.12em] text-theme-muted">
              ${product.price.toFixed(2)} USD
            </p>
            <p className="mt-8 max-w-md text-sm leading-7 tracking-wide text-theme-muted">
              {product.shortEditorial || product.description}
            </p>

            <ul className="mt-8 flex flex-wrap gap-2">
              {(product.attributes || []).map((attribute) => (
                <li
                  key={attribute}
                  className="border border-theme-border px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-theme-muted"
                >
                  {attribute}
                </li>
              ))}
            </ul>

            <div className="mt-10">
              <AddToCartButton product={product} />
            </div>

            <p className="mt-4 text-xs text-theme-muted">{product.ageNote}</p>

            <div className="mt-8 space-y-4 border border-theme-border bg-theme-surface p-5 text-sm leading-6 text-theme-muted">
              <p>
                <strong className="text-theme-text/90">Shipping. </strong>
                {product.shippingSnippet} Statement descriptor: {SITE_CONFIG.billingDescriptor}.
              </p>
              <p>
                <strong className="text-theme-text/90">Returns. </strong>
                {product.returnsSnippet}{' '}
                <Link href="/shipping" className="text-theme-text/90 underline underline-offset-4">Full policy</Link>
              </p>
              <p>
                <Link href="/standards" className="text-theme-text/90 underline underline-offset-4">
                  Materials &amp; standards
                </Link>
              </p>
            </div>

            <ProductSpecs
              composition={product.composition}
              freeFrom={product.freeFrom}
              care={product.care}
              warning={product.warning}
            />

            <div className="mt-8 space-y-8 border-t border-theme-border pt-8 text-sm leading-7 text-theme-muted">
              <section>
                <h2 className="text-[10px] font-medium uppercase tracking-[0.28em] text-theme-muted">Description</h2>
                <p className="mt-3">{product.description}</p>
              </section>
              <section>
                <h2 className="text-[10px] font-medium uppercase tracking-[0.28em] text-theme-muted">Specifications</h2>
                <p className="mt-3">{product.specifications}</p>
              </section>
              <section>
                <h2 className="text-[10px] font-medium uppercase tracking-[0.28em] text-theme-muted">Discretion</h2>
                <p className="mt-3">{product.discretionNotes}</p>
              </section>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-20 border-t border-theme-border pt-12">
            <h2 className="mb-8 text-center text-sm uppercase tracking-[0.2em] text-theme-muted">
              The rest of the edit
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}

export function productJsonLd(product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    sku: product.id,
    brand: { '@type': 'Brand', name: SITE_CONFIG.name },
    offers: {
      '@type': 'Offer',
      price: product.price.toFixed(2),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: `https://${SITE_CONFIG.domain}${productPath(product)}`,
    },
  }
}
