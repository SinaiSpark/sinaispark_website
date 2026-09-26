import { describe, expect, it } from "vitest"

import {
  countryFromEmail,
  extractEmail,
  extractName,
  extractPhone,
  firstName,
  isDecline,
  phoneFromPicker,
  readDetails,
} from "@/lib/assistant/lead"

/**
 * Seam: lib/assistant/lead
 * Behavior spec: the assistant reads a name, email and phone out of what a
 * visitor types in reply to its questions, in any order and in ordinary
 * phrasing, and recognises a refusal. Anything doubtful is not a detail:
 * a wrong name in the CRM is worse than asking again.
 */
describe("assistant lead details", () => {
  it("reads names in the ways people give them", () => {
    expect(extractName("Sara")).toBe("Sara")
    expect(extractName("sara khan")).toBe("Sara Khan")
    expect(extractName("Hi, I'm Rahul Mehta")).toBe("Rahul Mehta")
    expect(extractName("my name is Aisha.")).toBe("Aisha")
    expect(extractName("it's O'Brien")).toBe("O'Brien")
    expect(extractName("Call me Mo")).toBe("Mo")
    expect(extractName("Jean-Luc Picard")).toBe("Jean-Luc Picard")
    expect(extractName("محمد")).toBe("محمد")
  })

  it("keeps the visitor's own capitalisation", () => {
    expect(extractName("McDonald")).toBe("McDonald")
    expect(extractName("de la Cruz")).toBe("de la Cruz")
  })

  it("does not mistake questions, refusals or chatter for names", () => {
    expect(extractName("how much does it cost?")).toBeUndefined()
    expect(extractName("why do you need that")).toBeUndefined()
    expect(extractName("no thanks")).toBeUndefined()
    expect(extractName("ok")).toBeUndefined()
    expect(extractName("sara@acme.com")).toBeUndefined()
    expect(
      extractName("I want to open a trading company in Riyadh next year")
    ).toBeUndefined()
  })

  it("reads an email anywhere in the reply, lower-cased", () => {
    expect(extractEmail("sure, it's Sara.Khan@Acme.co.uk thanks")).toBe(
      "sara.khan@acme.co.uk"
    )
    expect(extractEmail("sara at acme dot com")).toBeUndefined()
  })

  it("reads phone numbers with or without the country code", () => {
    expect(extractPhone("+966 50 123 4567")?.phone).toBe("+966 50 123 4567")
    expect(extractPhone("050 123 4567", "SA")?.phone).toBe("+966 50 123 4567")
    expect(extractPhone("my number is +91 98765 43210")?.country).toBe("IN")
    expect(extractPhone("12345")).toBeUndefined()
  })

  it("validates the phone picker's number against its country", () => {
    expect(phoneFromPicker("AE", "50 123 4567")?.phone).toBe("+971 50 123 4567")
    expect(phoneFromPicker("SA", "12")).toBeUndefined()
  })

  it("reads everything given at once", () => {
    expect(
      readDetails("I'm Sara Khan, sara@acme.com, +966 50 123 4567")
    ).toEqual({
      name: "Sara Khan",
      email: "sara@acme.com",
      phone: "+966 50 123 4567",
      phoneCountry: "SA",
    })
  })

  it("recognises a refusal, but not a reply that gives a detail", () => {
    expect(isDecline("I'd rather not")).toBe(true)
    expect(isDecline("no thanks")).toBe(true)
    expect(isDecline("why do you need my email?")).toBe(true)
    expect(isDecline("skip")).toBe(true)
    expect(isDecline("no, it's sara@acme.com")).toBe(false)
    expect(isDecline("Sara")).toBe(false)
  })

  it("takes the phone country from a country email domain", () => {
    expect(countryFromEmail("sam@example.co.uk")).toBe("GB")
    expect(countryFromEmail("rohan@example.in")).toBe("IN")
    expect(countryFromEmail("a@b.ae")).toBe("AE")
    expect(countryFromEmail("sara@acme.com")).toBeUndefined()
    expect(countryFromEmail(null)).toBeUndefined()
  })

  it("greets by first name", () => {
    expect(firstName("Sara Khan")).toBe("Sara")
  })
})
