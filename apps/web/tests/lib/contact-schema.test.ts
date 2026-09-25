import { describe, expect, it } from "vitest"

import { CONSULT } from "@/content/home"
import {
  enquirySchema,
  MARKET_OPTIONS,
  SERVICE_OPTIONS,
  subscribeSchema,
} from "@/lib/contact-schema"

/**
 * Seam: lib/contact-schema
 * Behavior spec: /api/enquiry accepts exactly what the consultation form
 * sends, and /api/subscribe accepts an email with an optional research unlock.
 * Bots that fill the hidden honeypot field are rejected.
 */
describe("enquiry schema", () => {
  const valid = {
    name: "Jane Founder",
    email: "Jane@Example.com",
    phone: "+966 50 123 4567",
    market: "Saudi Arabia",
    service: "Compliance",
    message: "We want to open a branch office in Riyadh.",
    page: "/contact",
  }

  it("accepts a complete submission and normalises the email", () => {
    const result = enquirySchema.safeParse(valid)
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.email).toBe("jane@example.com")
  })

  it("needs only name, email, market and service", () => {
    const result = enquirySchema.safeParse({
      name: "Jane",
      email: "jane@example.com",
      market: "India",
      service: "Not sure yet",
    })
    expect(result.success).toBe(true)
  })

  it("reports name and email when they are missing or malformed", () => {
    const result = enquirySchema.safeParse({ ...valid, name: " ", email: "no" })
    expect(result.success).toBe(false)
    if (!result.success) {
      const fields = result.error.issues.map((issue) => issue.path[0])
      expect(fields).toEqual(expect.arrayContaining(["name", "email"]))
    }
  })

  it("offers the same markets and services as the form", () => {
    expect(MARKET_OPTIONS).toEqual(CONSULT.markets.map((m) => m.label))
    expect(SERVICE_OPTIONS).toEqual(CONSULT.services)
  })

  it("rejects a market or service outside the dropdowns", () => {
    expect(enquirySchema.safeParse({ ...valid, market: "Mars" }).success).toBe(
      false
    )
    expect(
      enquirySchema.safeParse({ ...valid, service: "Investment Matchmaking" })
        .success
    ).toBe(false)
  })

  it("rejects submissions that fill the honeypot", () => {
    expect(
      enquirySchema.safeParse({ ...valid, website: "http://spam" }).success
    ).toBe(false)
  })
})

describe("subscribe schema", () => {
  it("defaults to a newsletter sign-up", () => {
    const result = subscribeSchema.parse({ email: "a@b.co" })
    expect(result.source).toBe("Newsletter")
  })

  it("accepts a research unlock without newsletter consent", () => {
    const result = subscribeSchema.parse({
      email: "a@b.co",
      source: "Research gate",
      research: "kifedhv0f75kio5msqetqfaq",
    })
    expect(result.newsletter).toBe(false)
  })

  it("rejects a malformed email", () => {
    expect(subscribeSchema.safeParse({ email: "nope" }).success).toBe(false)
  })
})
