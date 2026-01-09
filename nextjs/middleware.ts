import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from './src/shared/lib/auth'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Redirect root path to /home
  if (pathname === '/') {
    const url = new URL('/home', request.url)
    return NextResponse.redirect(url)
  }

  // Public paths that don't require authentication
  const publicPaths = [
    '/home',
    '/home/signIn',
    '/home/signUp',
    '/home/share',
    '/api/auth/login',
    '/api/auth/register',
    '/api/health',
    '/api/metadata',
  ]

  // Check if the current path is public
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path))

  // Allow public paths
  if (isPublicPath) {
    return NextResponse.next()
  }

  // Check for authentication on protected paths
  if (pathname.startsWith('/documents')) {
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      // Redirect to home page if no token
      const url = new URL('/home', request.url)
      return NextResponse.redirect(url)
    }

    // Verify token
    const payload = verifyToken(token)
    
    if (!payload) {
      // Invalid token, clear cookie and redirect
      const url = new URL('/home', request.url)
      const response = NextResponse.redirect(url)
      response.cookies.delete('auth-token')
      return response
    }

    // Token is valid, continue to the requested page
    return NextResponse.next()
  }

  // Allow all other paths by default
  return NextResponse.next()
}

// Configure which paths this middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

