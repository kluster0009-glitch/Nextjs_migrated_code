import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/middleware'

export async function middleware(request) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createClient(request, response)

  const { data: { session } } = await supabase.auth.getSession()

  const { pathname } = request.nextUrl

  // Define protected routes
  const protectedRoutes = ['/chat', '/cluster', '/events', '/leaderboard', '/library', '/notifications', '/professor', '/profile', '/settings']
  const authRoutes = ['/login', '/signup', '/']
  
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAuthRoute = authRoutes.includes(pathname)

  // If user is not logged in and trying to access protected route
  if (!session && isProtectedRoute) {
    const redirectUrl = new URL('/login', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  // If user is logged in and trying to access auth routes (login, signup, landing)
  if (session && isAuthRoute) {
    const redirectUrl = new URL('/cluster', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
