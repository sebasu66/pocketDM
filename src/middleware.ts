
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This is a DEMO key. In a real production app, use an environment variable.
const SECRET_API_KEY = 'a-super-secret-key-for-lore-weaver';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // We only want to protect our API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const apiKey = request.headers.get('x-api-key');

    // If the API key is missing or incorrect, we return an unauthorized response
    if (apiKey !== SECRET_API_KEY) {
      return new NextResponse(
        JSON.stringify({ success: false, message: 'Authentication required' }),
        { status: 401, headers: { 'content-type': 'application/json' } }
      )
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/api/:path*',
}
