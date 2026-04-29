export type SecurityHeader = {
  key: string
  value: string
}

/**
 * Builds a strict, nonce-aware Content Security Policy.
 *
 * The returned string still contains the literal `{NONCE}` placeholder,
 * which `proxy.ts` substitutes per request. Setting CSP via the proxy is
 * required so each HTML response gets a fresh, unguessable nonce.
 *
 * @see https://nextjs.org/docs/app/guides/content-security-policy
 */
export function buildContentSecurityPolicy(nodeEnv: string | undefined) {
  const isDevelopment = nodeEnv === "development"

  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-{NONCE}' 'strict-dynamic'${isDevelopment ? " 'unsafe-eval'" : ""}`,
    `style-src 'self' ${isDevelopment ? "'unsafe-inline'" : "'nonce-{NONCE}'"}`,
    "img-src 'self' blob: data:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ")
}

/**
 * Static security headers applied to every route by `next.config.ts`.
 *
 * `Content-Security-Policy` is intentionally omitted here — it is set
 * per-request in `proxy.ts` so it can include a fresh nonce for each HTML
 * response.
 */
export function buildSecurityHeaders(): SecurityHeader[] {
  return [
    // DNS prefetching for external resources — improves perceived performance.
    { key: "X-DNS-Prefetch-Control", value: "on" },

    // Force HTTPS for 2 years (including subdomains). Remove if not using HTTPS.
    { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },

    // Legacy framing protection for older clients that do not support CSP
    // frame-ancestors. Aligned to DENY to match the `frame-ancestors 'none'`
    // directive in the per-request CSP set by proxy.ts.
    { key: "X-Frame-Options", value: "DENY" },

    // Prevent MIME-type sniffing — mitigates XSS via user-uploaded content.
    { key: "X-Content-Type-Options", value: "nosniff" },

    // Control how much referrer info is sent on cross-origin navigations.
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },

    // Restrict access to device APIs that the app does not use.
    {
      key: "Permissions-Policy",
      value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
    },

    // Cross-origin isolation: protect against cross-origin attacks (Spectre, etc.).
    // COEP is set to `unsafe-none` to keep third-party assets working out of the box.
    // Tighten to `require-corp` (or `credentialless`) when the app no longer relies
    // on opaque cross-origin resources.
    { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
    { key: "Cross-Origin-Embedder-Policy", value: "unsafe-none" },
    { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  ]
}
