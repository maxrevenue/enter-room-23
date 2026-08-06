/**
 * sitemap.xml — consistent with SITE_INDEXABLE.
 * Returns empty array when indexing is disabled (default).
 */
export default function sitemap() {
  const indexable = process.env.SITE_INDEXABLE === 'true'

  if (!indexable) {
    return []
  }

  const pages = ['/', '/shop', '/faq', '/contact', '/terms', '/privacy', '/shipping']

  return pages.map((path) => ({
    url: `https://room23.net${path}`,
    lastModified: new Date('2026-08-05'),
    changeFrequency: 'monthly',
    priority: path === '/' ? 1.0 : 0.5,
  }))
}
