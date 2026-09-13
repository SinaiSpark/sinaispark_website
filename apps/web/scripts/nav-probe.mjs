/**
 * Walks a route sequence as a visitor would — client-side navigations through
 * Next's router, not fresh loads — and fails on any console error.
 *
 * This is the check that catches GSAP tearing down too late: ScrollTrigger pins
 * reparent sections into a .pin-spacer, and if that is not reverted before
 * React unmounts them the removal throws NotFoundError. A plain per-route
 * screenshot pass never sees it, because it only ever loads pages cold.
 *
 *   node scripts/nav-probe.mjs http://localhost:3000 / /services/ /india/
 */
import puppeteer from "puppeteer-core"

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe"
const [base, ...routes] = process.argv.slice(2)

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox"],
})
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })

const errors = []
page.on("console", (m) => {
  if (m.type() === "error") errors.push([page.url(), m.text()])
})
page.on("pageerror", (e) => errors.push([page.url(), "PAGEERROR " + e.message]))

const first = routes.shift()
await page.goto(base + first, { waitUntil: "domcontentloaded", timeout: 60000 })
await new Promise((r) => setTimeout(r, 4000))
console.log("loaded " + first)

for (const route of routes) {
  const before = errors.length
  const clicked = await page.evaluate((href) => {
    const link = [...document.querySelectorAll("a")].find(
      (a) => new URL(a.href, location.href).pathname === href
    )
    if (!link) return false
    link.click()
    return true
  }, route)

  if (!clicked) {
    // No link to it from here; push through the router directly.
    await page.evaluate((href) => history.pushState({}, "", href), route)
    await page.goto(base + route, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    })
  }
  await new Promise((r) => setTimeout(r, 3500))

  // Scroll so the pinned sections actually engage before we leave again.
  await page.evaluate(async () => {
    const step = window.innerHeight
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 90))
    }
    window.scrollTo(0, 0)
  })
  await new Promise((r) => setTimeout(r, 800))

  const added = errors.length - before
  const how = clicked ? "click" : "load"
  console.log(
    `${how.padEnd(5)} -> ${route.padEnd(34)} ${added ? "ERRORS " + added : "ok"} | at ${page.url().replace(base, "")}`
  )
}

await browser.close()

if (errors.length) {
  console.log("\n--- errors ---")
  for (const [where, text] of errors) {
    console.log(where + "\n  " + text.slice(0, 800) + "\n")
  }
  process.exit(1)
}
console.log("\nno console errors across " + (routes.length + 1) + " views")
