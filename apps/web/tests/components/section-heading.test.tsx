import { render, screen } from "@testing-library/react"

import { describe, expect, it } from "vitest"

import { SectionHeading } from "@/components/site/section-heading"

/**
 * Seam: SectionHeading (render)
 * Behavior spec: renders the gold eyebrow + one H2 + optional lede, with
 * heading-level semantics intact for the SEO checklist.
 */
describe("SectionHeading", () => {
  it("renders eyebrow and title", () => {
    render(
      <SectionHeading
        eyebrow="What We Do"
        title="Complete market-entry services"
      />
    )
    expect(screen.getByText("What We Do")).toBeInTheDocument()
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /complete market-entry services/i,
      })
    ).toBeInTheDocument()
  })

  it("omits the lede paragraph when not provided", () => {
    const { container } = render(
      <SectionHeading eyebrow="Stats" title="By the numbers" />
    )
    expect(container.querySelector("p")).not.toBeInTheDocument()
  })

  it("renders the lede when provided", () => {
    render(
      <SectionHeading
        eyebrow="Global Presence"
        title="Five markets, one partner"
        lede="Wherever your business is headed, we already have a team on the ground."
      />
    )
    expect(screen.getByText(/team on the ground/i)).toBeInTheDocument()
  })
})
