import type { Metadata } from 'next'
import ProductCard from '@/components/product-card'
import { PRODUCTS, searchProducts } from '@/lib/products'

export const metadata: Metadata = {
  title: 'Shop',
  description:
    'Curated adult wellness essentials from Room 23 — body-safe lubricants, delay spray, mists, oils, and the Hello Cake stroker. 18+ only.',
}

type ShopPageProps = {
  searchParams: Promise<{ category?: string }>
}

function formatCategoryLabel(category?: string) {
  if (!category || category === 'all') return null
  return String(category).replace(/-/g, ' ')
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { category } = await searchParams
  const activeCategory = category && category !== 'all' ? category : undefined
  const products = activeCategory ? searchProducts('', { category: activeCategory }) : PRODUCTS
  const categoryLabel = formatCategoryLabel(activeCategory)

  return (
    <div className="bg-theme-bg text-theme-text">
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20 md:py-24">
        <header className="mb-12 max-w-xl sm:mb-16">
          <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-theme-muted">
            {categoryLabel ? categoryLabel : 'The collection'}
          </p>
          <h1 className="mt-4 font-serif text-3xl tracking-tight text-theme-text sm:text-4xl md:text-5xl">
            Shop
          </h1>
          <p className="mt-5 text-sm leading-relaxed text-theme-muted sm:text-[15px]">
            {categoryLabel
              ? `A considered selection of ${categoryLabel} pieces from the Room 23 edit.`
              : 'A tightly held edit of body-safe essentials. Nothing ornamental.'}
          </p>
        </header>

        <ul className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
          {products.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
