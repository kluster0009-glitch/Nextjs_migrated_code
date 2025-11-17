import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isAuthPage = request.nextUrl.pathname.startsWith('/auth')
  const isPublicPage = request.nextUrl.pathname === '/'
  const isProtectedPage = !isAuthPage && !isPublicPage

  // If user is logged in, validate their email domain
  if (user && user.email) {
    const domain = user.email.split('@')[1]?.toLowerCase()
    
    if (domain) {
      // Check if domain is in allowed list
      const { data: domainData, error } = await supabase
        .from('email_domains')
        .select('domain')
        .eq('domain', domain)
        .single()
      
      // If domain not found or error, sign out and redirect to auth
      if (error || !domainData) {
        console.log('Unauthorized domain detected:', domain)
        
        // Sign out the user
        await supabase.auth.signOut()
        
        // Redirect to auth page with error message
        const url = request.nextUrl.clone()
        url.pathname = '/auth'
        url.searchParams.set('error', 'unauthorized_domain')
        url.searchParams.set('domain', domain)
        return NextResponse.redirect(url)
      }
    }
  }

  // If user is logged in and tries to access auth page, redirect to feed
  if (user && isAuthPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/feed'
    return NextResponse.redirect(url)
  }

  // If user is NOT logged in and tries to access protected page, redirect to auth
  if (!user && isProtectedPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
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
