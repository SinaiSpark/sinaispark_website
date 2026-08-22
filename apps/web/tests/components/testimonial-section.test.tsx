import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { TestimonialSection } from "@/components/home/testimonial-section"
import { HOME } from "@/lib/content/home"

describe("TestimonialSection", () => {
  it("renders the testimonial cards when published is true", () => {
    render(<TestimonialSection />)

    if (HOME.testimonials.published) {
      expect(screen.getByText(HOME.testimonials.title)).toBeInTheDocument()
      expect(
        screen.getByText(HOME.testimonials.subheadline)
      ).toBeInTheDocument()

      HOME.testimonials.items.forEach((item) => {
        expect(screen.getByText(item.name)).toBeInTheDocument()
        expect(screen.getByText(item.quote)).toBeInTheDocument()
      })
    }
  })
})
