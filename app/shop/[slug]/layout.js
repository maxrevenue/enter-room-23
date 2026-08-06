import { PRODUCTS } from '@/lib/products'

// Reuse the slug logic from the PDP page
function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({
    slug: slugify(product.name),
  }))
}

export function generateMetadata({ params }) {
  const product = PRODUCTS.find((p) => slugify(p.name) === params.slug || p.id === params.slug)

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found on Room 23.',
    }
  }

  return {
    title: product.name,
    description: product.tagline,
    openGraph: {
      title: product.name,
      description: product.tagline,
      type: 'product',
      price: product.price.toFixed(2),
      currency: 'USD',
    },
  }
}
