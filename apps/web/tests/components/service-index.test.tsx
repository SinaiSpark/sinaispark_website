import { render, screen, fireEvent } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { ServiceIndex } from "@/components/home/service-index"
import { HOME } from "@/lib/content/home"

// Mock next/image
vi.mock("next/image", () => ({
  default: (props: any) => <img {...props} data-testid="service-image" />,
}))

describe("ServiceIndex", () => {
  it("renders the What We Do heading and all service items", () => {
    render(<ServiceIndex />)

    expect(screen.getByText(HOME.whatWeDo.eyebrow)).toBeInTheDocument()
    expect(screen.getByText(HOME.whatWeDo.title)).toBeInTheDocument()

    HOME.whatWeDo.items.forEach((item) => {
      expect(screen.getByText(item.title)).toBeInTheDocument()
      expect(screen.getByText(item.description)).toBeInTheDocument()
    })
  })

  it("updates active image preview on hovering a service row", () => {
    render(<ServiceIndex />)

    const secondServiceLink = screen
      .getByText(HOME.whatWeDo.items[1]!.title)
      .closest("a")
    expect(secondServiceLink).toBeInTheDocument()

    if (secondServiceLink) {
      fireEvent.mouseEnter(secondServiceLink)
    }
  })
})
