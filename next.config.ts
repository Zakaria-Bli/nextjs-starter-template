import "./src/lib/env"

import { buildSecurityHeaders } from "@/lib/security/headers"

import type { NextConfig } from "next"

/**
 * Static security headers applied to all routes. Per-request CSP with a
 * nonce is set in `src/proxy.ts` so each HTML response gets a fresh nonce.
 *
 * `Content-Security-Policy` is intentionally absent from the headers below —
 * it is injected per-request by `proxy.ts` and would be overwritten anyway.
 *
 * @see https://nextjs.org/docs/app/api-reference/config/next-config-js/headers
 */
const securityHeaders = buildSecurityHeaders()

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: "standalone",

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ]
  },

  // To enable the forbidden() and unauthorized() functions (and their
  // corresponding forbidden.tsx / unauthorized.tsx pages), uncomment:
  //
  // experimental: {
  //   authInterrupts: true,
  // },
}

export default nextConfig
