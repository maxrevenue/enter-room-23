import { SITE_CONFIG } from '@/config/site'
import { PRODUCTS, productPath } from '@/lib/products'
import { JOURNAL_ARTICLES } from '@/lib/journal'
import { COLLECTIONS } from '@/lib/products'

export default function sitemap() {
  const staticPages = [
    { path: '/', priority: 1.0, changeFrequency: 'monthly' },
    { path: '/shop', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/collections', priority: 0.7, changeFrequency: 'weekly' },
    { path: '/journal', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/about', priority: 0.5, changeFrequency: 'monthly' },
    { path: '/faq', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/contact', priority: 0.5, changeFrequency: 'monthly' },
    { path: '/terms', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/shipping', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/standards', priority: 0.5, changeFrequency: 'monthly' },
    { path: '/quiz', priority: 0.4, changeFrequency: 'monthly' },
  ]

  const staticEntries = staticPages.map((p) => ({
    url: `https://${SITE_CONFIG.domain}${p.path}`,
    lastModified: new Date('2026-08-16'),
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }))

  const productEntries = PRODUCTS.map((product) => ({
    url: `https://${SITE_CONFIG.domain}${productPath(product)}`,
    lastModified: new Date('2026-08-16'),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const journalEntries = JOURNAL_ARTICLES.map((article) => ({
    url: `https://${SITE_CONFIG.domain}/journal/${article.id}`,
    lastModified: new Date('2026-08-16'),
    changeFrequency: 'monthly',
    priority: 0.5,
  }))

  const collectionEntries = Object.keys(COLLECTIONS).map((slug) => ({
    url: `https://${SITE_CONFIG.domain}/collections/${slug}`,
    lastModified: new Date('2026-08-16'),
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  return [...staticEntries, ...productEntries, ...journalEntries, ...collectionEntries]
}
