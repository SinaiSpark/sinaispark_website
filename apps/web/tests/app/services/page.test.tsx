import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import ServicesHubPage from "@/app/services/page"

// Mock the child components so we don't have to render the whole tree
vi.mock("@/components/site/breadcrumbs", () => ({
  Breadcrumbs: () => <div data-testid="breadcrumbs-mock" />,
}))
vi.mock("@/components/site/cta-section", () => ({
  CTASection: () => <div data-testid="cta-section-mock" />,
}))
vi.mock("@/components/services/services-directory", () => ({
  ServicesDirectory: () => <div data-testid="services-directory-mock" />,
}))

describe("ServicesHubPage", () => {
  it("renders the hero section and mock children", () => {
    render(<ServicesHubPage />)

    // Check main title
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      /end-to-end corporate capabilities/i
    )

    // Check metrics
    expect(screen.getByText(/10 practices/i)).toBeInTheDocument()
    expect(screen.getByText(/5 key markets/i)).toBeInTheDocument()

    // Check children
    expect(screen.getByTestId("breadcrumbs-mock")).toBeInTheDocument()
    expect(screen.getByTestId("cta-section-mock")).toBeInTheDocument()
    expect(screen.getByTestId("services-directory-mock")).toBeInTheDocument()
  })
})
