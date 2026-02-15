// // middleware.ts
// import { createServerClient } from '@supabase/ssr'
// import { NextResponse, type NextRequest } from 'next/server'

// export async function updateSession(request: NextRequest) {
//     let supabaseResponse = NextResponse.next({
//         request,
//     })

//     const supabase = createServerClient(
//         process.env.NEXT_PUBLIC_SUPABASE_URL!,
//         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//         {
//             cookies: {
//                 getAll() {
//                     return request.cookies.getAll()
//                 },
//                 setAll(cookiesToSet) {
//                     cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
//                     supabaseResponse = NextResponse.next({
//                         request,
//                     })
//                     cookiesToSet.forEach(({ name, value, options }) =>
//                         supabaseResponse.cookies.set(name, value, options)
//                     )
//                 },
//             },
//         }
//     )

//     // refreshing the auth token
//     await supabase.auth.getUser()

//     return supabaseResponse
// }

// export async function middleware(request: NextRequest) {
//     const response = await updateSession(request)

//     const supabase = createServerClient(
//         process.env.NEXT_PUBLIC_SUPABASE_URL!,
//         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//         {
//             cookies: {
//                 getAll() {
//                     return request.cookies.getAll()
//                 },
//                 setAll() { }
//             }
//         }
//     )

//     const { data: { user } } = await supabase.auth.getUser()

//     // Protect dashboard routes
//     if (request.nextUrl.pathname.startsWith('/dashboard') && !user) {
//         return NextResponse.redirect(new URL('/login', request.url))
//     }

//     // Redirect logged in users away from login page
//     if (request.nextUrl.pathname === '/login' && user) {
//         return NextResponse.redirect(new URL('/dashboard', request.url))
//     }

//     // Handle root path
//     if (request.nextUrl.pathname === '/') {
//         if (user) {
//             return NextResponse.redirect(new URL('/dashboard', request.url))
//         } else {
//             return NextResponse.redirect(new URL('/login', request.url))
//         }
//     }

//     return response
// }

// export const config = {
//     matcher: [
//         /*
//          * Match all request paths except for the ones starting with:
//          * - _next/static (static files)
//          * - _next/image (image optimization files)
//          * - favicon.ico (favicon file)
//          * Feel free to modify this pattern to include more paths.
//          */
//         '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
//     ],
// }











// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // ✅ Allow Supabase auth routes to pass through
  if (pathname.startsWith('/auth')) {
    return response
  }

  // Protect dashboard
  if (pathname.startsWith('/dashboard') && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect logged-in users away from login
  if (pathname === '/login' && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Root redirect
  if (pathname === '/') {
    if (user) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    } else {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
