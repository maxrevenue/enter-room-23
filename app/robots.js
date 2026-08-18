import { SITE_CONFIG } from '@/config/site'

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin', '/order-confirmed'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/admin', '/order-confirmed'],
      },
    ],
    sitemap: `https://${SITE_CONFIG.domain}/sitemap.xml`,
  }
}

