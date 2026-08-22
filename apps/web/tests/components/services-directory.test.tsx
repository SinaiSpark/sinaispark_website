import { render, screen, fireEvent, cleanup } from "@testing-library/react"
import { describe, expect, it, vi, afterEach } from "vitest"

import { ServicesDirectory } from "@/components/services/services-directory"

// Mock lucide icons to avoid rendering issues in tests
vi.mock("lucide-react", async (importOriginal) => {
  const actual = (await importOriginal()) as any
  return {
    ...actual,
    ArrowRightIcon: () => <svg data-testid="icon-arrow-right" />,
    Building2Icon: () => <svg data-testid="icon-building-2" />,
    SearchIcon: () => <svg data-testid="icon-search" />,
  }
})

describe("ServicesDirectory", () => {
  afterEach(cleanup)

  it("renders the navigation tabs and search input", () => {
    render(<ServicesDirectory />)

    // Tabs
    expect(
      screen.getByRole("button", { name: /all practices/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: /core corporate/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: /saudi business/i })
    ).toBeInTheDocument()

    // Search input
    expect(screen.getByPlaceholderText(/search practices/i)).toBeInTheDocument()
  })

  it("filters services based on search query", () => {
    render(<ServicesDirectory />)

    const searchInput = screen.getByPlaceholderText(/search practices/i)
    fireEvent.change(searchInput, {
      target: { value: "xyznonexistentservice" },
    })

    // Should show empty state
    expect(screen.getByText(/no practices found/i)).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: /reset filters/i })
    ).toBeInTheDocument()
  })
})
