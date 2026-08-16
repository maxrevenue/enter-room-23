import { notFound } from 'next/navigation'
import { PRODUCTS, getProductBySlug } from '@/lib/products'
import ProductDetail, { productJsonLd } from '@/components/product-detail'

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ slug: product.slug }))
}

export async function generateMetadata({ params }) {
  const resolved = await params
  const product = getProductBySlug(resolved.slug)
  if (!product) {
    return { title: 'Product Not Found' }
  }
  return {
    title: product.name,
    description: product.tagline || product.description,
  }
}

export default async function ShopProductPage({ params }) {
  const resolved = await params
  const product = getProductBySlug(resolved.slug)
  if (!product) notFound()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product)) }}
      />
      <ProductDetail product={product} />
    </>
  )
}
