import { describe, expect, it } from "vitest"

import { enquirySchema } from "@/lib/contact-schema"
import { sourceLabel } from "@/lib/enquiry-label"
import {
  consultHref,
  DIRECT_SOURCE,
  prefillFor,
  prefillFromQuery,
} from "@/lib/enquiry-source"

/**
 * Seam: lib/enquiry-source + lib/enquiry-label
 * Behavior spec: every consultation button leads to the one contact form; the
 * form preselects its service and market from where the visitor came from (or
 * the link), and the enquiry records that page, or "direct" when the contact
 * page was opened on its own.
 */
describe("enquiry source", () => {
  it("labels the page the visitor came from", () => {
    expect(sourceLabel("/services/legal-services/")).toMatch(
      /^Service: .+ \(\/services\/legal-services\/\)$/
    )
    expect(sourceLabel("/india/")).toBe("India (/india/)")
    expect(sourceLabel("/blog/misa/")).toBe("Blog: misa (/blog/misa/)")
    expect(sourceLabel(null)).toBe(DIRECT_SOURCE)
  })

  it("preselects the service and market for the page", () => {
    expect(prefillFor("/india/")).toEqual({
      service: "Indian company registration (NRI)",
      market: "India",
    })
    expect(prefillFor("/licences/industrial-license/").service).toMatch(
      /^A licence/
    )
    expect(prefillFor("/about/")).toEqual({})
    expect(prefillFor(null)).toEqual({})
  })

  it("round-trips a prefilled link and ignores unknown values", () => {
    const href = consultHref({
      service: "Indian company registration (NRI)",
      market: "India",
      plan: "Pvt Ltd",
    })
    expect(href.startsWith("/contact/?")).toBe(true)
    expect(href.endsWith("#form")).toBe(true)
    expect(
      prefillFromQuery(href.slice(href.indexOf("?"), href.indexOf("#")))
    ).toEqual({
      service: "Indian company registration (NRI)",
      market: "India",
      plan: "Pvt Ltd",
    })
    expect(prefillFromQuery("?service=Hacking&market=Mars")).toEqual({
      service: undefined,
      market: undefined,
      plan: undefined,
    })
  })
})

describe("enquiry phone and origin", () => {
  const base = {
    name: "A",
    email: "a@b.co",
    market: "Saudi Arabia",
    service: "Compliance",
  }

  it("accepts a valid international number and rejects a wrong one", () => {
    expect(
      enquirySchema.safeParse({ ...base, phone: "+966 50 123 4567" }).success
    ).toBe(true)
    expect(enquirySchema.safeParse({ ...base, phone: "+966 12" }).success).toBe(
      false
    )
    expect(enquirySchema.safeParse({ ...base, phone: "" }).success).toBe(true)
  })

  it("keeps a site path as the origin and drops anything else", () => {
    const ok = enquirySchema.parse({ ...base, from: "/india/" })
    expect(ok.from).toBe("/india/")
    const bad = enquirySchema.parse({ ...base, from: "https://evil.example/x" })
    expect(bad.from).toBeNull()
  })
})
