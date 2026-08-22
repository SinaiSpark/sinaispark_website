import { describe, expect, it } from "vitest"

import { CTA_LABEL, NAV_LINKS, SERVICES, SITE } from "@/lib/site-config"

/**
 * Seam: lib/site-config
 * Behavior spec: the approved route map and contact data stay internally
 * consistent — nav/footer/sitemap/schema all derive from these values.
 */
describe("site config integrity", () => {
  it("exposes exactly the ten approved service routes", () => {
    expect(SERVICES).toHaveLength(10)
  })

  it("gives every service a unique href under /services/", () => {
    const hrefs = SERVICES.map((service) => service.href)
    for (const href of hrefs) {
      expect(href.startsWith("/services/")).toBe(true)
    }
    expect(new Set(hrefs).size).toBe(hrefs.length)
  })

  it("includes the five license pages and five core services", () => {
    const slugs = SERVICES.map((service) =>
      service.href.replace("/services/", "")
    )
    for (const required of [
      "administrative-solutions/",
      "legal-services/",
      "commercial-license/",
      "industrial-license/",
      "entrepreneurial-license/",
      "service-license/",
      "real-estate-license/",
      "pro-visa-services/",
      "compliance/",
      "property-management/",
    ]) {
      expect(slugs).toContain(required)
    }
  })

  it("keeps primary navigation pointing at real top-level routes", () => {
    for (const link of NAV_LINKS) {
      expect(link.href.startsWith("/")).toBe(true)
    }
  })

  it("lists exactly the three Saudi offices used by LocalBusiness schema", () => {
    expect(SITE.offices.map((office) => office.city)).toEqual([
      "Riyadh",
      "Jeddah",
      "Dammam",
    ])
  })

  it("derives the WhatsApp number from the displayed phone digits", () => {
    const phoneDigits = SITE.phone.replace(/\D/g, "")
    expect(SITE.whatsappNumber).toBe(phoneDigits)
  })

  it("keeps brand copy exact", () => {
    expect(SITE.name).toBe("Sinai Spark Global")
    expect(SITE.tagline).toBe("Your Vision, Our Mission")
  })

  it("has valid metadata for SEO and external links", () => {
    expect(SITE.url.startsWith("https://")).toBe(true)
    expect(SITE.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    expect(typeof SITE.description).toBe("string")
    expect(SITE.description.length).toBeGreaterThan(0)
    expect(SITE.description.length).toBeLessThanOrEqual(200)

    for (const link of Object.values(SITE.socials)) {
      expect(link.startsWith("https://")).toBe(true)
    }
  })

  it("includes all primary navigation links with valid titles", () => {
    const expectedTitles = [
      "Home",
      "About Us",
      "India",
      "Research",
      "Blog",
      "FAQs",
    ]
    const titles = NAV_LINKS.map((l) => l.title)

    expect(titles).toEqual(expectedTitles)

    for (const link of NAV_LINKS) {
      expect(typeof link.title).toBe("string")
      expect(link.title.length).toBeGreaterThan(0)
    }
  })

  it("ensures all services have valid titles and optionally descriptions", () => {
    for (const service of SERVICES) {
      expect(typeof service.title).toBe("string")
      expect(service.title.length).toBeGreaterThan(0)

      if (service.description !== undefined) {
        expect(typeof service.description).toBe("string")
        expect(service.description.length).toBeGreaterThan(0)
      }
    }
  })

  it("exports a non-empty call-to-action label", () => {
    expect(typeof CTA_LABEL).toBe("string")
    expect(CTA_LABEL.length).toBeGreaterThan(0)
    expect(CTA_LABEL).toBe("Book a Free Consultation")
  })
})
