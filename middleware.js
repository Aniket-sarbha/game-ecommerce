// middleware.js
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export const config = {
  matcher: [
    '/api/stores/:path*',
    '/stores/:path*/payment', // This will match any payment route under stores
    '/payment-callback/:path*', // Payment callback routes
    '/((?!api|_next/static|_next/image|favicon.ico).*)', // Add this to check all non-API routes
  ],
}

export async function middleware(request) {
  const response = NextResponse.next();
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  
  // Add cache control headers for API routes
  if (request.nextUrl.pathname.startsWith('/api/stores')) {
    // Public CDN caching for GET requests
    if (request.method === 'GET') {
      response.headers.set('Cache-Control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=600');
    }
  }
  
  // Skip role check for public routes
  const isPublicRoute = 
    request.nextUrl.pathname === '/' ||
    request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/signup') ||
    request.nextUrl.pathname.startsWith('/api/auth') ||
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/role-selection');
  
  // If user is logged in but has a 'pending' role and isn't already on role selection page
  if (token && token.role === 'pending' && !isPublicRoute && !request.nextUrl.pathname.startsWith('/role-selection')) {
    return NextResponse.redirect(new URL('/role-selection', request.url));
  }
  
  // Authentication check for payment routes
  const isPaymentRoute = 
    request.nextUrl.pathname.includes('/payment') || 
    request.nextUrl.pathname.includes('/payment-callback');
    
  if (isPaymentRoute) {
    // If the user is not authenticated, redirect to the login page
    if (!token) {
      // Store the original URL to redirect back after login
      const url = new URL('/login', request.url);
      url.searchParams.set('callbackUrl', request.nextUrl.pathname + request.nextUrl.search);
      
      return NextResponse.redirect(url);
    }
    
    // Check if user has a role other than 'pending'
    if (token.role === 'pending') {
      return NextResponse.redirect(new URL('/role-selection', request.url));
    }
  }
  
  return response;
}