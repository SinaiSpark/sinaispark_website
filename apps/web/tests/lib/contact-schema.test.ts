import { describe, expect, it } from "vitest"

import { contactFormSchema, SERVICE_OPTIONS } from "@/lib/contact-schema"

/**
 * Seam: lib/contact-schema
 * Behavior spec: the consultation form accepts exactly the revised document's
 * field set and rejects malformed submissions with field-level errors.
 */
describe("contact form schema", () => {
  const valid = {
    fullName: "Jane Founder",
    companyName: "",
    email: "jane@example.com",
    phone: "+966 50 123 4567",
    country: "United Kingdom",
    serviceOfInterest: "Company Formation",
    message: "We want to open a branch office in Riyadh.",
  }

  it("accepts a complete submission without company name", () => {
    const result = contactFormSchema.safeParse(valid)
    expect(result.success).toBe(true)
  })

  it("requires full name, email, phone, country and message", () => {
    const result = contactFormSchema.safeParse({
      ...valid,
      fullName: "",
      email: "nope",
      phone: "",
      country: "",
      message: "",
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      const fields = result.error.issues.map((issue) => issue.path[0])
      expect(fields).toContain("fullName")
      expect(fields).toContain("email")
      expect(fields).toContain("phone")
      expect(fields).toContain("country")
      expect(fields).toContain("message")
    }
  })

  it("rejects invalid email format", () => {
    const result = contactFormSchema.safeParse({
      ...valid,
      email: "not-an-email",
    })
    expect(result.success).toBe(false)
  })

  it("offers exactly the seven approved service options", () => {
    expect(SERVICE_OPTIONS).toEqual([
      "Company Formation",
      "Licensing",
      "Legal Advisory",
      "PRO & Visa",
      "Compliance",
      "Property Management",
      "India Company Formation",
    ])
  })

  it("rejects a service of interest outside the dropdown", () => {
    const result = contactFormSchema.safeParse({
      ...valid,
      serviceOfInterest: "Investment Matchmaking",
    })
    expect(result.success).toBe(false)
  })
})
