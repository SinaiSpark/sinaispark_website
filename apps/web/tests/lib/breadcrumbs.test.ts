import { describe, expect, it } from "vitest"

import { buildBreadcrumbs } from "@/lib/breadcrumbs"

/**
 * Seam: lib/breadcrumbs#buildBreadcrumbs
 * Behavior spec: turns a pathname into a Home-rooted label/href trail,
 * resolving labels from approved site config (services, static pages).
 */
describe("buildBreadcrumbs", () => {
  it("returns an empty trail for the home page", () => {
    expect(buildBreadcrumbs("/")).toEqual([])
  })

  it("labels a top-level static page after Home", () => {
    const trail = buildBreadcrumbs("/about-us/")
    expect(trail).toEqual([
      { label: "Home", href: "/" },
      { label: "About Us", href: "/about-us/" },
    ])
  })

  it("resolves known service pages by their configured title", () => {
    const trail = buildBreadcrumbs("/services/administrative-solutions/")
    expect(trail).toEqual([
      { label: "Home", href: "/" },
      { label: "Services", href: "/services/" },
      {
        label: "Business Setup in Saudi Arabia",
        href: "/services/administrative-solutions/",
      },
    ])
  })

  it("resolves every license page route to its title", () => {
    for (const slug of [
      "commercial-license",
      "industrial-license",
      "entrepreneurial-license",
      "service-license",
      "real-estate-license",
    ]) {
      const trail = buildBreadcrumbs(`/services/${slug}/`)
      expect(trail.at(-1)).toEqual({
        label: expect.stringMatching(/License/),
        href: `/services/${slug}/`,
      })
    }
  })

  it("falls back to a humanized label for unknown segments", () => {
    const trail = buildBreadcrumbs("/privacy-policy/")
    expect(trail.at(-1)?.label).toBe("Privacy Policy")
  })
})
