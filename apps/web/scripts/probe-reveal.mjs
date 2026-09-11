/** Scroll to a section, wait, then report whether its Reveal children resolved. */
import puppeteer from "puppeteer-core"

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe"
const [url, selector, out] = process.argv.slice(2)

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
})
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
await page.goto(url, { waitUntil: "networkidle0" })

const info = await page.evaluate(async (sel) => {
  const section = document.querySelector(sel)
  if (!section) return { error: `no element for ${sel}` }
  section.scrollIntoView({ block: "start" })
  await new Promise((r) => setTimeout(r, 1800))
  const rows = []
  for (const el of section.querySelectorAll("[style]")) {
    const cs = getComputedStyle(el)
    if (
      cs.opacity !== "1" ||
      (cs.transform !== "none" && cs.transform !== "matrix(1, 0, 0, 1, 0, 0)")
    ) {
      rows.push({
        tag: el.tagName.toLowerCase(),
        opacity: cs.opacity,
        transform: cs.transform,
        inline: el.getAttribute("style")?.slice(0, 80),
        text: (el.textContent ?? "").trim().slice(0, 40),
      })
    }
  }
  const r = section.getBoundingClientRect()
  return {
    top: Math.round(r.top),
    height: Math.round(r.height),
    unresolved: rows.slice(0, 8),
  }
}, selector)

console.log(JSON.stringify(info, null, 2))
if (out) await page.screenshot({ path: out })
await browser.close()
