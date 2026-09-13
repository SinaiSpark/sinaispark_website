/**
 * Asserts the header stays on screen the whole way down a page, and that the
 * sub-nav (and, on the licences page, the comparison table's header row) parks
 * directly below it rather than sliding behind it.
 *
 *   node scripts/spy-probe.mjs http://localhost:3000/services/compliance/ ./shots
 */
import puppeteer from "puppeteer-core"

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe"
const url = process.argv[2] || "http://localhost:3000/services/compliance/"
const OUT = process.argv[3] || "."

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox"],
})
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 })
// wait for the intro tween to finish putting the nav at 0 before asserting
for (let i = 0; i < 40; i++) {
  await new Promise((r) => setTimeout(r, 250))
  const top = await page.evaluate(() =>
    Math.round(document.querySelector("#nav").getBoundingClientRect().top)
  )
  if (top === 0 && i > 8) break
}

const sample = () =>
  page.evaluate(() => {
    const rect = (sel) => {
      const el = document.querySelector(sel)
      if (!el) return null
      const b = el.getBoundingClientRect()
      return [Math.round(b.top), Math.round(b.bottom)]
    }
    return {
      y: Math.round(window.scrollY),
      nav: rect("#nav"),
      spy: rect(".spy"),
      header: rect("table.mx thead th:nth-child(2)"),
      table: rect("table.mx"),
    }
  })

const fails = []
const check = (m) => {
  if (!m.nav || m.nav[0] !== 0) {
    fails.push(`y=${m.y}: header left the top of the viewport (${m.nav})`)
  }
  if (m.spy && m.nav && m.spy[0] < m.nav[1] - 2) {
    fails.push(`y=${m.y}: sub-nav ${m.spy} sits behind the header ${m.nav}`)
  }
  // only while the table itself is still on screen; once it scrolls past,
  // the header is meant to leave with it
  const tableInView =
    m.table && m.table[1] > (m.spy ? m.spy[1] : 0) + 120 && m.table[0] < 900
  if (tableInView && m.header && m.spy && m.header[0] < m.spy[1] - 2) {
    fails.push(
      `y=${m.y}: table header ${m.header} sits behind the sub-nav ${m.spy}`
    )
  }
}

const walk = async (label, from, to, step) => {
  for (let y = from; step > 0 ? y <= to : y >= to; y += step) {
    await page.evaluate((v) => window.scrollTo(0, v), y)
    await new Promise((r) => setTimeout(r, 160))
    check(await sample())
  }
  const m = await sample()
  console.log(
    `${label.padEnd(6)} settled at y=${m.y}  nav=${m.nav?.join("..")}  spy=${m.spy?.join("..") ?? "-"}  tableHeader=${m.header?.join("..") ?? "-"}`
  )
  await page.screenshot({
    path: `${OUT}/spy-${label}.png`,
    captureBeyondViewport: false,
  })
}

const max = await page.evaluate(
  () => document.body.scrollHeight - window.innerHeight
)
await walk("down", 200, Math.min(max, 4000), 300)
await walk("up", Math.min(max, 4000), 200, -300)

await browser.close()
if (fails.length) {
  console.log("\nFAIL")
  fails.slice(0, 8).forEach((f) => console.log("  " + f))
  process.exit(1)
}
console.log("\nheader stays put and every bar stacks below it, both directions")
