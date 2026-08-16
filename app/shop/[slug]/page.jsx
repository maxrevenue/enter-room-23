import { redirect } from 'next/navigation'
import { getProductBySlug, productHref } from '@/lib/products'

export const dynamic = 'force-dynamic'

export default async function ShopSlugRedirect({ params }) {
  const resolved = typeof params?.then === 'function' ? await params : params
  const slug = resolved?.slug
  const product = getProductBySlug(slug)
  if (product) {
    redirect(productHref(product))
  }
  redirect('/shop')
}
