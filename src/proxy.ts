import { NextResponse } from "next/server"

import { buildContentSecurityPolicy } from "@/lib/security/headers"

import type { NextRequest } from "next/server"

/**
 * Per-request proxy that injects a strict, nonce-based Content Security
 * Policy. Static security headers (HSTS, X-Frame-Options, etc.) are still
 * served from `next.config.ts`.
 *
 * NOTE: In this version of Next.js, `middleware.ts` has been renamed to
 * `proxy.ts`. See `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`.
 *
 * @see https://nextjs.org/docs/app/guides/content-security-policy
 */
export function proxy(request: NextRequest) {
  // Generate a 128-bit, base64-encoded nonce for this request. Using raw
  // random bytes (rather than a UUID string) keeps the nonce compact and
  // matches the convention recommended by the Next.js CSP guide.
  const nonceBytes = new Uint8Array(16)
  crypto.getRandomValues(nonceBytes)
  const nonce = Buffer.from(nonceBytes).toString("base64")

  const csp = buildContentSecurityPolicy(process.env.NODE_ENV).replace(/{NONCE}/g, nonce)

  // Forward the nonce to the application via a request header so server
  // components can read it via `headers().get("x-nonce")`.
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-nonce", nonce)
  requestHeaders.set("Content-Security-Policy", csp)

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  })
  response.headers.set("Content-Security-Policy", csp)

  return response
}

export const config = {
  // Skip CSP injection on assets, image optimization output, API routes,
  // and prefetch requests — none of which render HTML that needs a nonce.
  matcher: [
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
}
