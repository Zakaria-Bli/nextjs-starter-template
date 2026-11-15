// @vitest-environment node

import { NextRequest } from "next/server"
import { describe, expect, it } from "vitest"

import { proxy } from "@/proxy"

describe("CSP proxy", () => {
  it("replaces untrusted nonce and CSP headers with a fresh matching nonce", () => {
    const request = new NextRequest("http://localhost/", {
      headers: {
        "x-nonce": "attacker-controlled",
        "Content-Security-Policy": "default-src *",
      },
    })
    const response = proxy(request)
    const policy = response.headers.get("Content-Security-Policy")!
    const nonce = response.headers.get("x-middleware-request-x-nonce")!

    expect(nonce).toMatch(/^[A-Za-z0-9+/]{22}==$/)
    expect(Buffer.from(nonce, "base64")).toHaveLength(16)
    expect(policy).toContain(`'nonce-${nonce}'`)
    expect(policy).not.toContain("{NONCE}")
    expect(policy).not.toContain("attacker-controlled")
    expect(policy).not.toContain("default-src *")
    expect(response.headers.get("x-middleware-request-content-security-policy")).toBe(policy)
  })

  it("generates a different nonce for every request", () => {
    const first = proxy(new NextRequest("http://localhost/"))
    const second = proxy(new NextRequest("http://localhost/"))

    expect(first.headers.get("Content-Security-Policy")).not.toBe(
      second.headers.get("Content-Security-Policy")
    )
  })
})
