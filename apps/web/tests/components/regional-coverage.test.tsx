import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { RegionalCoverage } from "@/components/home/regional-coverage"
import { HOME } from "@/lib/content/home"

// Mock next/image
vi.mock("next/image", () => ({
  default: (props: any) => <img {...props} data-testid="regional-image" />,
}))

describe("RegionalCoverage", () => {
  it("renders the heading and all three regions", () => {
    render(<RegionalCoverage />)

    expect(screen.getByText(HOME.regionalCoverage.eyebrow)).toBeInTheDocument()
    expect(screen.getByText(HOME.regionalCoverage.title)).toBeInTheDocument()

    HOME.regionalCoverage.regions.forEach((region) => {
      expect(screen.getByText(region.city)).toBeInTheDocument()
      expect(screen.getByText(region.description)).toBeInTheDocument()
    })
  })
})
