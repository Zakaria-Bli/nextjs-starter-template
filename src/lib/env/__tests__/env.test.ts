import { describe, expect, it } from "vitest"

// eslint-disable-next-line import/no-restricted-paths
import { env } from ".."

describe("test environment", () => {
  it("loads and validates values from .env.test", () => {
    expect(new URL(env.NEXT_PUBLIC_APP_BASE_URL).protocol).toMatch(/^https?:$/)
  })
})
