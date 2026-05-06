import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Protect /admin routes - EXCLUSIVE ACCESS for aluminiumhouse08@gmail.com
    if (path.startsWith("/admin")) {
      const isSuperAdmin = token?.email === "aluminiumhouse08@gmail.com"
      if (!isSuperAdmin) {
        return NextResponse.redirect(new URL("/", req.url))
      }
    }
    // Redirect authenticated users away from auth pages
    if (path === "/login" || path === "/register" || path === "/forgot-password" || path === "/reset-password") {
      if (token) {
        return NextResponse.redirect(new URL("/account/dashboard", req.url))
      }
    }
    
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname
        // Only require auth for /account and /admin
        if (path.startsWith("/account") || path.startsWith("/admin")) {
          return !!token
        }
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    "/account/:path*",
    "/admin/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password"
  ],
}
