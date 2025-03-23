// middleware.js
import { NextResponse } from 'next/server'

export const config = {
  matcher: [
    '/api/stores/:path*',
  ],
}

export function middleware(request) {
  const response = NextResponse.next()
  
  // Add cache control headers for API routes
  if (request.nextUrl.pathname.startsWith('/api/stores')) {
    // Public CDN caching for GET requests
    if (request.method === 'GET') {
      response.headers.set('Cache-Control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=600')
    }
  }
  
  return response
}