import { NextResponse } from 'next/server'

/**
 * Edge middleware — HTTPS only + security headers.
 *
 * Age verification is a client overlay (see AgeGate). Do not 307 shop, PDP,
 * journal, collections, cart, or checkout to /. Underwriters and curl must
 * receive unique HTML for those routes.
 *
 * OpenNext on Cloudflare does not reliably apply next.config.js headers()
 * to Worker HTML, so security headers are set here.
 */
const SECURITY_HEADERS = {
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy':
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;",
}

function withSecurityHeaders(response) {
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value)
  }
  return response
}

export function middleware(request) {
  const proto = request.headers.get('x-forwarded-proto')
  const host = request.headers.get('host') || ''
  const isLocal = host.startsWith('localhost') || host.startsWith('127.0.0.1')

  if (proto === 'http' && !isLocal) {
    const url = request.nextUrl.clone()
    url.protocol = 'https:'
    return withSecurityHeaders(NextResponse.redirect(url, 301))
  }

  return withSecurityHeaders(NextResponse.next())
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
