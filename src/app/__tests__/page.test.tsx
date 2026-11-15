import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"

import Home from "@/app/page"

afterEach(cleanup)

describe("home page", () => {
  it("renders the starter heading and navigation links", () => {
    render(<Home />)

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("To get started")
    expect(screen.getByRole("link", { name: "Documentation" })).toHaveAttribute(
      "href",
      "https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
    )
    expect(screen.getByRole("link", { name: /Deploy Now/ })).toHaveAttribute(
      "rel",
      "noopener noreferrer"
    )
  })

  it("renders both logos without inline styles blocked by strict CSP", () => {
    render(<Home />)

    const images = screen.getAllByRole("img")
    expect(images).toHaveLength(2)
    for (const image of images) {
      expect(image.getAttribute("style") || "").toBe("")
      expect(image).toHaveAttribute("width")
      expect(image).toHaveAttribute("height")
    }
  })
})
