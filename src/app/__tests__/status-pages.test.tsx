import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { renderToStaticMarkup } from "react-dom/server"
import { afterEach, describe, expect, it, vi } from "vitest"

import ErrorPage from "@/app/error"
import Forbidden from "@/app/forbidden"
import GlobalError from "@/app/global-error"
import Loading from "@/app/loading"
import NotFound from "@/app/not-found"
import Unauthorized from "@/app/unauthorized"

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe("status pages under strict CSP", () => {
  const error = Object.assign(new Error("Test render failure"), { digest: "test-digest" })
  const retry = vi.fn()

  it.each([
    ["404", <NotFound key="404" />],
    ["403", <Forbidden key="403" />],
    ["401", <Unauthorized key="401" />],
    ["loading", <Loading key="loading" />],
    ["segment error", <ErrorPage key="segment-error" error={error} unstable_retry={retry} />],
    ["root error", <GlobalError key="root-error" error={error} unstable_retry={retry} />],
  ])("renders %s without blocked inline styles", (_name, page) => {
    const html = renderToStaticMarkup(page)

    expect(html).not.toMatch(/\sstyle="/)
    expect(html).toContain("status-grid")
  })

  it("keeps the error boundary retry action working after the React update", () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined)
    render(<ErrorPage error={error} unstable_retry={retry} />)

    fireEvent.click(screen.getByRole("button", { name: /Try again/ }))

    expect(retry).toHaveBeenCalledOnce()
    expect(screen.getByText("test-digest")).toBeInTheDocument()
  })
})
