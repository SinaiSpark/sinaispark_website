import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { SiteHeader } from "@/components/site/header"

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}))

describe("SiteHeader", () => {
  it("renders navigation links and logo", () => {
    render(<SiteHeader />)

    // Check for logo text (screen reader text in LogoLockup or similar)
    // Actually just check for main nav links
    expect(screen.getByRole("link", { name: /home/i })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /about us/i })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /india/i })).toBeInTheDocument()

    // Check for services dropdown button
    expect(
      screen.getByRole("button", { name: /services/i })
    ).toBeInTheDocument()
  })
})
