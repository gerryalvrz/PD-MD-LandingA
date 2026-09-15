import { NextResponse, type NextRequest } from "next/server"
import { CANONICAL_SITE_URL } from "@/content/landing"
import { isVercelAppHost } from "@/lib/site-url"

/**
 * - Production *.vercel.app → permanent redirect to academia.motusdao.org
 * - Preview *.vercel.app → noindex (keep shareable preview URLs)
 */
export function middleware(request: NextRequest) {
  const host = request.headers.get("host")
  if (!isVercelAppHost(host)) {
    return NextResponse.next()
  }

  if (process.env.VERCEL_ENV === "production") {
    const canonical = new URL(request.nextUrl.pathname + request.nextUrl.search, CANONICAL_SITE_URL)
    return NextResponse.redirect(canonical, 308)
  }

  const response = NextResponse.next()
  response.headers.set("X-Robots-Tag", "noindex, nofollow")
  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif)$).*)"],
}
