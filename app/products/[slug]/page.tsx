import { notFound } from 'next/navigation'
import { PRODUCTS, getProductBySlug } from '@/lib/products'
import ProductDetail, { productJsonLd } from '@/components/product-detail'

export function generateStaticParams() {
  return PRODUCTS.flatMap((product) => [
    { slug: product.slug },
    { slug: product.id },
    ...(product.aliases || []).map((alias) => ({ slug: alias })),
  ])
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) return { title: 'Product' }
  return {
    title: product.name,
    description: product.shortEditorial || product.description,
  }
}

export default async function ProductPage({ params }) {
  const { slug } = await params
  const product = getProductBySlug(slug)
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
