import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { CTASection } from "@/components/site/cta-section"

describe("CTASection", () => {
  it("renders the eyebrow, title, and subheadline", () => {
    render(
      <CTASection
        eyebrow="Assessment"
        title="Ready to begin?"
        subheadline="Let us help you out."
      />
    )
    expect(screen.getByText("Assessment")).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { level: 2, name: /ready to begin/i })
    ).toBeInTheDocument()
    expect(screen.getByText("Let us help you out.")).toBeInTheDocument()
  })

  it("renders buttons with correct links and variants", () => {
    render(
      <CTASection
        title="Ready to begin?"
        buttons={[
          { label: "Primary Button", href: "/primary", variant: "primary" },
          {
            label: "Secondary Button",
            href: "/secondary",
            variant: "secondary",
          },
          { label: "Gold Button", href: "/gold", variant: "gold" },
          { label: "Default Button", href: "/default" },
        ]}
      />
    )

    const primaryButton = screen.getByRole("link", { name: /primary button/i })
    expect(primaryButton).toHaveAttribute("href", "/primary")
    expect(primaryButton).toHaveClass("bg-primary")

    const secondaryButton = screen.getByRole("link", {
      name: /secondary button/i,
    })
    expect(secondaryButton).toHaveAttribute("href", "/secondary")
    expect(secondaryButton).toHaveClass("border")
    expect(secondaryButton).toHaveClass("border-primary-foreground/40")

    const goldButton = screen.getByRole("link", { name: /gold button/i })
    expect(goldButton).toHaveAttribute("href", "/gold")
    expect(goldButton).toHaveClass("bg-gold")
  })
})
