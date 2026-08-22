import { render, screen, fireEvent } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { WhyChooseUsGrid } from "@/components/home/why-choose-us-grid"
import { HOME } from "@/lib/content/home"

describe("WhyChooseUsGrid", () => {
  it("renders all points with title and description", () => {
    render(<WhyChooseUsGrid points={HOME.whyChooseUs.points} />)

    HOME.whyChooseUs.points.forEach((point) => {
      expect(screen.getByText(point.title)).toBeInTheDocument()
      expect(screen.getByText(point.description)).toBeInTheDocument()
    })
  })

  it("handles mouse hover and leave on grid cells", () => {
    render(<WhyChooseUsGrid points={HOME.whyChooseUs.points} />)

    const firstCard = screen
      .getByText(HOME.whyChooseUs.points[0]!.title)
      .closest("div")
    expect(firstCard).toBeInTheDocument()

    // Hover on first card
    if (firstCard) {
      fireEvent.mouseEnter(firstCard)
    }

    // Leave grid
    const gridContainer = firstCard?.parentElement
    if (gridContainer) {
      fireEvent.mouseLeave(gridContainer)
    }
  })
})
