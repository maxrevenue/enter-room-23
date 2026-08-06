import { NextResponse } from 'next/server'

/**
 * Edge middleware — enforces age verification at the network level
 * before any protected page HTML is rendered.
 *
 * Unverified requests to /shop (or any non-public route) are redirected
 * to / so the age gate displays before content is ever served.
 */
export function middleware(request) {
  const verified = request.cookies.get('age_verified')?.value === 'true'
  const { pathname } = request.nextUrl

  // Public routes accessible without age verification
  const isPublic =
    pathname === '/' ||
    pathname.startsWith('/terms') ||
    pathname.startsWith('/privacy') ||
    pathname.startsWith('/shipping') ||
    pathname.startsWith('/faq') ||
    pathname.startsWith('/contact') ||
    pathname.startsWith('/journal') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')

  if (!verified && !isPublic) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
