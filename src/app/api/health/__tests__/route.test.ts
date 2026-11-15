// @vitest-environment node

import { describe, expect, it } from "vitest"

import { GET } from "@/app/api/health/route"

describe("health endpoint", () => {
  it("returns a successful JSON response with a current timestamp", async () => {
    const before = Date.now()
    const response = await GET()
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(response.headers.get("Content-Type")).toContain("application/json")
    expect(body.ok).toBe(true)
    expect(Date.parse(body.timestamp)).toBeGreaterThanOrEqual(before)
    expect(Date.parse(body.timestamp)).toBeLessThanOrEqual(Date.now())
  })
})
