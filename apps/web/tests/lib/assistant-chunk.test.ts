import { describe, expect, it } from "vitest"

import { passagesFromHtml, splitText, withOverlap } from "@/lib/assistant/chunk"

/**
 * Seam: lib/assistant/chunk
 * Behavior spec: pages become search passages per section, headed by the
 * section's heading, without the chrome and boilerplate every page repeats,
 * and no passage outgrows the prompt budget.
 */
describe("assistant passages", () => {
  const page = `<!doctype html><html><head><title>Compliance | Sinai Spark Global</title></head>
  <body>
    <nav><a href="/">Home</a><a href="/services/">Services</a></nav>
    <main>
      <section class="phero"><h1 class="h1" data-split><span class="w"><span class="wi">Compliance</span></span></h1>
        <p>Year-round statutory filings.</p></section>
      <section class="ov"><p class="eyebrow">Overview</p><h2>What the service covers.</h2>
        <p>Formation is a one time event.</p>
        <ul><li>CR renewals</li><li>ZATCA filings</li></ul>
        <form><input name="x"><button>Send</button></form>
        <svg><text>chart</text></svg>
      </section>
      <section class="faq dfaq"><h2>Questions</h2><p>Repeated from the CMS.</p></section>
      <section class="cta"><h2>Book a consultation</h2><p>Every page says this.</p></section>
    </main>
    <footer><p>© 2026</p></footer>
  </body></html>`

  it("splits the main content by section, headed by its heading", () => {
    const { title, passages } = passagesFromHtml(page)
    expect(title).toBe("Compliance")
    expect(passages).toEqual([
      {
        title: "Compliance",
        heading: "Compliance",
        content: "Year-round statutory filings.",
      },
      {
        title: "Compliance",
        heading: "What the service covers.",
        content:
          "Overview\nFormation is a one time event.\nCR renewals\nZATCA filings",
      },
    ])
  })

  it("leaves out navigation, forms, graphics, FAQs and calls to action", () => {
    const text = passagesFromHtml(page)
      .passages.map((p) => p.content)
      .join(" ")
    for (const noise of [
      "Home",
      "Send",
      "chart",
      "Repeated",
      "Every page",
      "©",
    ]) {
      expect(text).not.toContain(noise)
    }
  })

  it("keeps passages under the size limit, breaking between words", () => {
    const long = Array.from(
      { length: 60 },
      (_, i) => `Sentence number ${i} is here.`
    ).join(" ")
    const parts = splitText(`${long}\n\nA short closing paragraph.`, 300)
    expect(parts.length).toBeGreaterThan(3)
    for (const part of parts) {
      expect(part.length).toBeLessThanOrEqual(300)
      expect(part).toBe(part.trim())
    }
    // Nothing lost: every word comes out once, in order.
    expect(parts.join(" ").replace(/\s+/g, " ")).toBe(
      `${long} A short closing paragraph.`
    )
  })

  it("repeats the end of each document passage at the start of the next", () => {
    const parts = withOverlap(
      ["The courier is called the Falcon Pouch.", "Delivery takes six days."],
      20
    )
    expect(parts[0]).toBe("The courier is called the Falcon Pouch.")
    // From a word boundary, never half a word.
    expect(parts[1]).toBe("the Falcon Pouch. Delivery takes six days.")
  })

  it("returns nothing for a page without a main element", () => {
    expect(
      passagesFromHtml("<html><body><p>hi</p></body></html>").passages
    ).toEqual([])
  })
})
