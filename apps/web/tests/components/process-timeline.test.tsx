import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ProcessTimeline } from "@/components/home/process-timeline"
import { HOME } from "@/lib/content/home"

describe("ProcessTimeline", () => {
  it("renders the How It Works heading and all steps", () => {
    render(<ProcessTimeline />)

    expect(screen.getByText(HOME.howItWorks.eyebrow)).toBeInTheDocument()
    expect(screen.getByText(HOME.howItWorks.title)).toBeInTheDocument()

    HOME.howItWorks.steps.forEach((step) => {
      expect(screen.getByText(step.title)).toBeInTheDocument()
      expect(screen.getByText(step.description)).toBeInTheDocument()
    })
  })
})
