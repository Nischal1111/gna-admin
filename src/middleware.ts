import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const protectedRoutes = [
    "/home",
    "/trekkings",
    "/tours",
    "/wellness",
    "/blogs",
    "/activities",
    "/plan-trip",
    "/requests-mails",
    "/users-info",
    "/my-account",
    "/about-us",
    "/faqs",
  ]

  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  )

  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/home/:path*",
    "/trekkings/:path*",
    "/tours/:path*",
    "/wellness/:path*",
    "/blogs/:path*",
    "/activities/:path*", 
    "/plan-trip/:path*",
    "/requests-mails/:path*",
    "/users-info/:path*",
    "/my-account/:path*",
    "/my-account/edit-profile/:path*",
    "/about-us/:path*",
    "/faqs/:path*",

    "/login", // Include login in matcher
    "/forgot-password", // Include forgot-password in matcher
  ],
}
