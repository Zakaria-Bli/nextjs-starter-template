import assert from "node:assert/strict"

// Run against a production server after `pnpm build`.
const baseUrl = new URL(process.argv[2] ?? "http://localhost:3000")
const nonces = new Set()

for (const [path, status] of [
  ["/", 200],
  ["/dependency-smoke-test-missing-page", 404],
]) {
  const response = await fetch(new URL(path, baseUrl), {
    headers: { "x-nonce": "untrusted-client-nonce" },
  })
  assert.equal(response.status, status, path)
  assert.equal(response.headers.get("x-frame-options"), "DENY")
  assert.equal(response.headers.get("x-content-type-options"), "nosniff")
  const policy = response.headers.get("content-security-policy") ?? ""
  assert.ok(!policy.includes("'unsafe-inline'"), "Production CSP must stay strict")
  assert.ok(!policy.includes("'unsafe-eval'"), "Production CSP must not allow eval")
  const nonce = policy.match(/'nonce-([A-Za-z0-9+/=]+)'/)?.[1]
  assert.ok(nonce, `${path}: missing CSP nonce`)
  assert.notEqual(nonce, "untrusted-client-nonce")
  assert.ok(!nonces.has(nonce), "Nonce must be unique per request")
  nonces.add(nonce)

  const html = await response.text()
  const scripts = html.match(/<script\b[^>]*>/g) ?? []
  assert.ok(scripts.length > 0, `${path}: missing framework scripts`)
  for (const script of scripts) {
    assert.ok(script.includes(`nonce="${nonce}"`), `${path}: script without matching nonce`)
  }
  assert.ok(!/<[a-z][^>]*\sstyle="[^"]+"/i.test(html), "Inline styles violate strict CSP")
  if (path === "/") {
    assert.match(html, /To get started/)
    for (const asset of html.matchAll(/(?:src|href)="([^"?]*\/_next\/static\/[^"?]+)[^"]*"/g)) {
      const result = await fetch(new URL(asset[1], baseUrl))
      assert.equal(result.status, 200, `Static asset: ${asset[1]}`)
    }
  }
}

const repeat = await fetch(baseUrl)
const repeatNonce = repeat.headers.get("content-security-policy")?.match(/'nonce-([^']+)'/)?.[1]
assert.ok(repeatNonce && !nonces.has(repeatNonce), "Repeat page request must get a fresh nonce")

const health = await fetch(new URL("/api/health", baseUrl))
assert.equal(health.status, 200)
const body = await health.json()
assert.equal(body.ok, true)
assert.ok(Number.isFinite(Date.parse(body.timestamp)))

for (const path of ["/robots.txt", "/sitemap.xml", "/next.svg", "/vercel.svg"]) {
  const response = await fetch(new URL(path, baseUrl))
  assert.equal(response.status, 200, path)
}

process.stdout.write(
  "Production smoke checks passed: HTML, CSP nonces, assets, 404, health, metadata.\n"
)
