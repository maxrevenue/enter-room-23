/**
 * robots.txt — driven by SITE_INDEXABLE env var, defaults to disallow.
 *
 * To enable indexing: set SITE_INDEXABLE=true in wrangler vars.
 * This file stays Server Component so it participates in static generation.
 */
export default function robots() {
  // When SITE_INDEXABLE is 'true', allow everything + sitemap reference.
  // Default stays "disallow all" for NMI underwriting safety.
  const indexable = process.env.SITE_INDEXABLE === 'true'

  if (!indexable) {
    return {
      rules: { userAgent: '*', disallow: '/' },
    }
  }

  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://room23.net/sitemap.xml',
  }
}
