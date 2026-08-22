import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import HomePage from "@/app/page"
import { HOME } from "@/lib/content/home"
import { SITE } from "@/lib/site-config"

// Mock next/image
vi.mock("next/image", () => ({
  default: (props: any) => <img {...props} data-testid="mock-image" />,
}))

describe("HomePage", () => {
  it("renders the hero headline and subheadline", () => {
    render(<HomePage />)

    expect(screen.getByText(HOME.hero.headline)).toBeInTheDocument()
    expect(screen.getByText(HOME.hero.subheadline)).toBeInTheDocument()
  })

  it("renders key sections: who we are, mission/vision, services, why choose us", () => {
    render(<HomePage />)

    // Who we are
    expect(screen.getByText(HOME.whoWeAre.title)).toBeInTheDocument()

    // Mission / Vision
    expect(
      screen.getByText(HOME.missionVision.mission.title)
    ).toBeInTheDocument()
    expect(
      screen.getByText(HOME.missionVision.vision.title)
    ).toBeInTheDocument()

    // What we do
    expect(screen.getByText(HOME.whatWeDo.title)).toBeInTheDocument()

    // Why choose us
    expect(screen.getByText(HOME.whyChooseUs.title)).toBeInTheDocument()

    // Closing CTA
    expect(screen.getByText(HOME.closingCta.title)).toBeInTheDocument()
  })
})
