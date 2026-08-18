import { NextResponse } from 'next/server'
import { hasAdminSessionCookie, isAdminPath } from '@/lib/admin-auth'
import { buildProductCanonicalRedirects } from '@/lib/product-canonical-redirects'

/**
 * Edge middleware — HTTPS only + security headers + product canonical 308s.
 *
 * Age verification is a client overlay (see AgeGate). Do not 307 shop, PDP,
 * journal, collections, cart, or checkout to /. Underwriters and curl must
 * receive unique HTML for those routes.
 *
 * OpenNext on Cloudflare does not reliably apply next.config.js headers()
 * or redirects() to Worker HTML, so those run here.
 */
const SECURITY_HEADERS = {
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy':
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;",
}

const PRODUCT_CANONICAL_REDIRECTS = new Map(
  buildProductCanonicalRedirects().map((rule) => [rule.source, rule.destination]),
)

function withSecurityHeaders(response, { noStore = false } = {}) {
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value)
  }
  if (noStore) {
    response.headers.set('Cache-Control', 'private, no-store')
  }
  return response
}

function pathnameWithoutTrailingSlash(pathname) {
  if (pathname.length > 1 && pathname.endsWith('/')) return pathname.slice(0, -1)
  return pathname
}

export async function middleware(request) {
  const proto = request.headers.get('x-forwarded-proto')
  const host = request.headers.get('host') || ''
  const isLocal = host.startsWith('localhost') || host.startsWith('127.0.0.1')

  if (proto === 'http' && !isLocal) {
    const url = request.nextUrl.clone()
    url.protocol = 'https:'
    return withSecurityHeaders(NextResponse.redirect(url, 301))
  }

  const pathname = pathnameWithoutTrailingSlash(request.nextUrl.pathname)
  const adminRequest = isAdminPath(pathname)

  if (adminRequest) {
    const authed = hasAdminSessionCookie(request.cookies)
    const isLogin = pathname === '/admin/login'

    if (!authed && !isLogin) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      url.search = ''
      return withSecurityHeaders(NextResponse.redirect(url), { noStore: true })
    }

    if (authed && isLogin) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin'
      url.search = ''
      return withSecurityHeaders(NextResponse.redirect(url), { noStore: true })
    }
  }

  const canonicalPath = PRODUCT_CANONICAL_REDIRECTS.get(pathname)
  if (canonicalPath) {
    const url = request.nextUrl.clone()
    url.pathname = canonicalPath
    return withSecurityHeaders(NextResponse.redirect(url, 308))
  }

  return withSecurityHeaders(NextResponse.next(), { noStore: adminRequest })
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
