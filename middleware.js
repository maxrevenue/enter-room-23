import { NextResponse } from 'next/server'

/**
 * Edge middleware — force HTTPS. Age verification is handled client-side
 * so shop/PDP/journal HTML returns 200 for reviewers and crawlers.
 */
export function middleware(request) {
  const proto = request.headers.get('x-forwarded-proto')
  if (proto === 'http') {
    const url = request.nextUrl.clone()
    url.protocol = 'https:'
    return NextResponse.redirect(url, 308)
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
