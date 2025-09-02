
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This is a demonstration API key. In a real-world application,
// this should be stored securely in an environment variable.
const SECRET_API_KEY = 'a-super-secret-key-for-lore-weaver';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // We only want to protect our /api routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    
    // The web app itself doesn't use the API key, it uses server-side rendering
    // and direct database access for some features, and its own fetch calls for others.
    // We can exempt requests from the app itself by checking for a specific internal header
    // that browsers automatically add. We will allow these to pass through.
    const isFromWebApp = request.headers.get('sec-fetch-site') === 'same-origin';
    if (isFromWebApp) {
      return NextResponse.next();
    }
    
    // For all other requests (e.g., from curl, Postman, or an external script),
    // we require an API key.
    const apiKey = request.headers.get('x-api-key');

    if (apiKey === SECRET_API_KEY) {
      return NextResponse.next();
    }

    // If the key is missing or incorrect, return an unauthorized error.
    return new Response(JSON.stringify({ error: 'Unauthorized: Missing or invalid API key.' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/api/:path*',
}
