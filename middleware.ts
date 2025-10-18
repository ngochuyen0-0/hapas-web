import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  // Handle CORS for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const response = NextResponse.next();

    // Set CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*'); // In production, specify your mobile app's origin
    response.headers.set(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS',
    );
    response.headers.set(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization',
    );

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 20,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    return response;
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
