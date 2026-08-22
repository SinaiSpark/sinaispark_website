import { render, screen, cleanup } from "@testing-library/react"
import { describe, expect, it, vi, afterEach, beforeEach } from "vitest"
import { act } from "react"

import { AboutImageStack } from "@/components/home/about-image-stack"
import type { ImageAsset } from "@/lib/images"

// Mock next/image
vi.mock("next/image", () => ({
  default: (props: any) => <img {...props} data-testid="next-image" />,
}))

const mockAssets: ImageAsset[] = [
  {
    src: "/images/about/test-1.jpg",
    alt: "Test image 1 description",
    status: "client",
  },
  {
    src: "/images/about/test-2.jpg",
    alt: "Test image 2 description",
    status: "client",
  },
  {
    src: "/images/about/test-3.jpg",
    alt: "Test image 3 description",
    status: "client",
  },
]

describe("AboutImageStack", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
    cleanup()
  })

  it("renders the initial active image", () => {
    render(<AboutImageStack assets={mockAssets} />)

    const img = screen.getByAltText("Test image 1 description")
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute("src", "/images/about/test-1.jpg")
  })

  it("rotates to the next image after the interval", () => {
    render(<AboutImageStack assets={mockAssets} />)

    expect(screen.getByAltText("Test image 1 description")).toBeInTheDocument()

    // Advance 5 seconds (interval is 5000ms)
    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(screen.getByAltText("Test image 2 description")).toBeInTheDocument()

    // Advance another 5 seconds
    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(screen.getByAltText("Test image 3 description")).toBeInTheDocument()
  })

  it("returns null when assets array is empty", () => {
    const { container } = render(<AboutImageStack assets={[]} />)
    expect(container.firstChild).toBeNull()
  })
})
