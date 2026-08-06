import { SITE_CONFIG } from '@/config/site'

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `https://${SITE_CONFIG.domain}/sitemap.xml`,
  }
}
