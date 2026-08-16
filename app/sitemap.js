import { SITE_CONFIG } from '@/config/site'
import { PRODUCTS, productHref } from '@/lib/products'

export default function sitemap() {
  const staticPages = [
    { path: '/', priority: 1.0, changeFrequency: 'weekly' },
    { path: '/shop', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/collections', priority: 0.7, changeFrequency: 'weekly' },
    { path: '/collections/essentials', priority: 0.7, changeFrequency: 'weekly' },
    { path: '/collections/new-arrivals', priority: 0.6, changeFrequency: 'weekly' },
    { path: '/journal', priority: 0.7, changeFrequency: 'weekly' },
    { path: '/journal/wellness-maintenance', priority: 0.5, changeFrequency: 'monthly' },
    { path: '/journal/lubricant-formulations', priority: 0.5, changeFrequency: 'monthly' },
    { path: '/journal/discreet-luxury', priority: 0.5, changeFrequency: 'monthly' },
    { path: '/standards', priority: 0.5, changeFrequency: 'monthly' },
    { path: '/shipping', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/faq', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/about', priority: 0.5, changeFrequency: 'monthly' },
    { path: '/contact', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/terms', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
  ]

  const staticEntries = staticPages.map((p) => ({
    url: `https://${SITE_CONFIG.domain}${p.path}`,
    lastModified: new Date('2026-08-16'),
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }))

  const productEntries = PRODUCTS.map((product) => ({
    url: `https://${SITE_CONFIG.domain}${productHref(product)}`,
    lastModified: new Date('2026-08-16'),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [...staticEntries, ...productEntries]
}
