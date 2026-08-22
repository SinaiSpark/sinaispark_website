import "@testing-library/jest-dom/vitest"
import { vi, afterEach } from "vitest"
import { cleanup } from "@testing-library/react"

// Automatically cleanup DOM after each test
afterEach(() => {
  cleanup()
})

// Mock IntersectionObserver for Framer Motion viewport triggers
class MockIntersectionObserver {
  readonly root: Element | null = null
  readonly rootMargin: string = ""
  readonly thresholds: ReadonlyArray<number> = []
  disconnect = vi.fn()
  observe = vi.fn((target: Element) => {
    // Optionally trigger immediate intersection for tests
  })
  takeRecords = vi.fn(() => [])
  unobserve = vi.fn()
}

globalThis.IntersectionObserver = MockIntersectionObserver as any

// Mock window.matchMedia for useReducedMotion
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})
