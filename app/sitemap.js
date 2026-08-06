import { SITE_CONFIG } from '@/config/site'
import { PRODUCTS } from '@/lib/products'

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export default function sitemap() {
  const staticPages = [
    { path: '/', priority: 1.0, changeFrequency: 'monthly' },
    { path: '/shop', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/journal', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/faq', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/contact', priority: 0.5, changeFrequency: 'monthly' },
    { path: '/terms', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/shipping', priority: 0.6, changeFrequency: 'monthly' },
  ]

  const staticEntries = staticPages.map((p) => ({
    url: `https://${SITE_CONFIG.domain}${p.path}`,
    lastModified: new Date('2026-08-05'),
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }))

  const productEntries = PRODUCTS.map((product) => ({
    url: `https://${SITE_CONFIG.domain}/shop/${slugify(product.name)}`,
    lastModified: new Date('2026-08-05'),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [...staticEntries, ...productEntries]
}
