import { permanentRedirect } from 'next/navigation'
import { getStorefrontProductBySlug } from '@/lib/admin-catalog'
import { productHref } from '@/lib/products'

export const dynamic = 'force-dynamic'

export default async function ShopSlugRedirect({ params }) {
  const resolved = typeof params?.then === 'function' ? await params : params
  const slug = resolved?.slug
  const product = await getStorefrontProductBySlug(slug)
  if (product) {
    permanentRedirect(productHref(product))
  }
  permanentRedirect('/shop')
}
