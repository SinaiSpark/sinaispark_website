import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { StatsBand } from "@/components/home/stats-band"
import { HOME } from "@/lib/content/home"

describe("StatsBand", () => {
  it("renders all company statistics labels", () => {
    render(<StatsBand />)

    HOME.stats.forEach((stat) => {
      expect(screen.getByText(stat.label)).toBeInTheDocument()
    })
  })

  it("has accessible section region", () => {
    render(<StatsBand />)
    expect(
      screen.getByRole("region", { name: /company statistics/i })
    ).toBeInTheDocument()
  })
})
