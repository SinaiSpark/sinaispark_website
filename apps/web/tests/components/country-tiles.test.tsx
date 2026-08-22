import { render, screen, cleanup } from "@testing-library/react"
import { describe, expect, it, vi, afterEach, beforeEach } from "vitest"
import { act } from "react" // React 18 / 19 compatibility

import { CountryTiles } from "@/components/home/country-tiles"
import { HOME } from "@/lib/content/home"

// Mock next/image
vi.mock("next/image", () => ({
  default: (props: any) => <img {...props} data-testid="next-image" />,
}))

// Mock lucide icons
vi.mock("lucide-react", async (importOriginal) => {
  const actual = (await importOriginal()) as any
  return {
    ...actual,
    ArrowRightIcon: () => <svg data-testid="icon-arrow-right" />,
  }
})

describe("CountryTiles", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
    cleanup()
  })

  it("renders the heading and all markets", () => {
    render(<CountryTiles />)

    // Check heading
    expect(screen.getByText("Global Presence")).toBeInTheDocument()

    // Check that all markets from HOME.globalPresence.markets are rendered
    HOME.globalPresence.markets.forEach((market) => {
      expect(screen.getByText(market.name)).toBeInTheDocument()
    })
  })

  it("rotates the flagship market on interval", () => {
    render(<CountryTiles />)

    const markets = HOME.globalPresence.markets

    // The first market is featured initially.
    // Only the featured market has its tag rendered.
    expect(screen.getByText(markets[0]!.tag)).toBeInTheDocument()

    // Non-featured markets should not have their tags rendered
    expect(screen.queryByText(markets[1]!.tag)).not.toBeInTheDocument()

    // Fast-forward 5 seconds
    act(() => {
      vi.advanceTimersByTime(5000)
    })

    // Now the second market should be featured
    expect(screen.getByText(markets[1]!.tag)).toBeInTheDocument()
    expect(screen.queryByText(markets[0]!.tag)).not.toBeInTheDocument()

    // Fast-forward another 5 seconds
    act(() => {
      vi.advanceTimersByTime(5000)
    })

    // Now the third market should be featured
    expect(screen.getByText(markets[2]!.tag)).toBeInTheDocument()
  })
})
