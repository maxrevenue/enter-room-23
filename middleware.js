import { NextResponse } from 'next/server'

/**
 * Edge middleware — HTTPS only.
 *
 * Age verification is a client overlay (see AgeGate). Do not 307 shop, PDP,
 * journal, collections, cart, or checkout to /. Underwriters and curl must
 * receive unique HTML for those routes.
 */
export function middleware(request) {
  const proto = request.headers.get('x-forwarded-proto')
  const host = request.headers.get('host') || ''
  const isLocal = host.startsWith('localhost') || host.startsWith('127.0.0.1')

  if (proto === 'http' && !isLocal) {
    const url = request.nextUrl.clone()
    url.protocol = 'https:'
    return NextResponse.redirect(url, 301)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
