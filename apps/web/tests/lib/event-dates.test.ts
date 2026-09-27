import { describe, expect, it } from "vitest"

import { dateStamp, formatEventDates, isUpcoming } from "@/lib/event-dates"

describe("formatEventDates", () => {
  it("prints a one-day event as a single date", () => {
    expect(formatEventDates("2026-03-14")).toBe("14 Mar 2026")
    expect(formatEventDates("2026-03-14", "2026-03-14")).toBe("14 Mar 2026")
  })

  it("collapses a range within one month", () => {
    expect(formatEventDates("2026-03-12", "2026-03-14")).toBe("12–14 Mar 2026")
  })

  it("keeps both months when a range crosses one", () => {
    expect(formatEventDates("2026-02-28", "2026-03-02")).toBe(
      "28 Feb – 2 Mar 2026"
    )
  })

  it("keeps both years when a range crosses one", () => {
    expect(formatEventDates("2025-12-30", "2026-01-02")).toBe(
      "30 Dec 2025 – 2 Jan 2026"
    )
  })

  it("ignores an end date before the start", () => {
    expect(formatEventDates("2026-03-14", "2026-03-01")).toBe("14 Mar 2026")
  })

  it("says so when a draft has no date yet", () => {
    expect(formatEventDates(null)).toBe("Date to be confirmed")
    expect(formatEventDates("not a date")).toBe("Date to be confirmed")
  })
})

describe("dateStamp", () => {
  it("splits the day from the month and year", () => {
    expect(dateStamp("2026-03-04")).toEqual({ day: "4", rest: "Mar 2026" })
  })
})

describe("isUpcoming", () => {
  it("counts an event as upcoming until its last day has passed", () => {
    expect(isUpcoming("2026-09-25", "2026-09-27", "2026-09-26")).toBe(true)
    expect(isUpcoming("2026-09-26", null, "2026-09-26")).toBe(true)
    expect(isUpcoming("2026-09-20", "2026-09-25", "2026-09-26")).toBe(false)
  })
})
