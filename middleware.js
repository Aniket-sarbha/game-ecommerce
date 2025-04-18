// middleware.js
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export const config = {
  matcher: [
    '/api/stores/:path*',
    '/stores/:path*/payment', // This will match any payment route under stores
    '/payment-callback/:path*', // Payment callback routes
  ],
}

export async function middleware(request) {
  const response = NextResponse.next();
  
  // Add cache control headers for API routes
  if (request.nextUrl.pathname.startsWith('/api/stores')) {
    // Public CDN caching for GET requests
    if (request.method === 'GET') {
      response.headers.set('Cache-Control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=600');
    }
  }
  
  // Authentication check for payment routes
  const isPaymentRoute = 
    request.nextUrl.pathname.includes('/payment') || 
    request.nextUrl.pathname.includes('/payment-callback');
    
  if (isPaymentRoute) {
    const session = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    // If the user is not authenticated, redirect to the login page
    if (!session) {
      // Store the original URL to redirect back after login
      const url = new URL('/login', request.url);
      url.searchParams.set('callbackUrl', request.nextUrl.pathname + request.nextUrl.search);
      
      return NextResponse.redirect(url);
    }
  }
  
  return response;
}