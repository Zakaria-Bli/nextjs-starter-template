import { describe, expect, it } from "vitest"

import { buildContentSecurityPolicy, buildSecurityHeaders } from "@/lib/security/headers"

describe("Content Security Policy", () => {
  it.each(["production", "test", undefined])("keeps %s scripts and styles nonce-only", (mode) => {
    const policy = buildContentSecurityPolicy(mode)

    expect(policy).toContain("script-src 'self' 'nonce-{NONCE}' 'strict-dynamic'")
    expect(policy).toContain("style-src 'self' 'nonce-{NONCE}'")
    expect(policy).not.toContain("'unsafe-inline'")
    expect(policy).not.toContain("'unsafe-eval'")
    expect(policy).toContain("object-src 'none'")
    expect(policy).toContain("frame-ancestors 'none'")
  })

  it("allows only the development exceptions needed by Next.js", () => {
    const policy = buildContentSecurityPolicy("development")

    expect(policy).toContain("script-src 'self' 'nonce-{NONCE}' 'strict-dynamic' 'unsafe-eval'")
    expect(policy).toContain("style-src 'self' 'unsafe-inline'")
  })
})

describe("static security headers", () => {
  it("retains security headers without overriding the per-request CSP", () => {
    const headers = Object.fromEntries(buildSecurityHeaders().map(({ key, value }) => [key, value]))

    expect(headers["X-Frame-Options"]).toBe("DENY")
    expect(headers["X-Content-Type-Options"]).toBe("nosniff")
    expect(headers["Strict-Transport-Security"]).toContain("includeSubDomains")
    expect(headers["Content-Security-Policy"]).toBeUndefined()
  })
})
