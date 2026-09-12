/**
 * Renders live routes headlessly and writes screenshots plus a short report.
 *
 * Usage:
 *   node scripts/shoot-site.mjs <baseUrl> <outDir> <route> [route...]
 *
 * For each route it visits desktop (1440) and phone (390) widths, scrolls the
 * page in steps so scroll-triggered animations actually fire, and reports
 * console errors, horizontal overflow and document height. Routes are written
 * as paths, e.g. "/" or "/services/compliance/".
 */
import { createRequire } from "node:module"
import { mkdirSync } from "node:fs"

const require = createRequire(
  "C:/Users/Admin/Desktop/sinaispark_website/apps/web/package.json"
)
const puppeteer = require("puppeteer-core")

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe"
const [base, outDir, ...routes] = process.argv.slice(2)
if (!base || !outDir || !routes.length) {
  console.error(
    "usage: node scripts/shoot-site.mjs <baseUrl> <outDir> <route...>"
  )
  process.exit(1)
}
mkdirSync(outDir, { recursive: true })

const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const VIEWPORTS = [
  { tag: "d", width: 1440, height: 900 },
  { tag: "m", width: 390, height: 844 },
]

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--autoplay-policy=no-user-gesture-required"],
})

let failures = 0

for (const route of routes) {
  const slug =
    route.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "home"

  for (const vp of VIEWPORTS) {
    const page = await browser.newPage()
    const errors = []
    page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`))
    page.on("console", (m) => {
      if (m.type() === "error")
        errors.push(`console: ${m.text().slice(0, 160)}`)
    })
    page.on("response", (res) => {
      if (res.status() >= 400)
        errors.push(`${res.status()} ${res.url().slice(0, 140)}`)
    })
    page.on("requestfailed", (r) => {
      const url = r.url()
      // The CDN fallback source is expected to be unused when the local file loads.
      if (!url.startsWith("data:") && !url.includes("cloudfront")) {
        errors.push(`request failed: ${url.slice(0, 120)}`)
      }
    })

    await page.setViewport({ width: vp.width, height: vp.height })
    await page.goto(base + route, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    })
    await wait(3500) // let the intro timeline finish

    await page.screenshot({ path: `${outDir}/${slug}-${vp.tag}-top.png` })

    // Step down the page so every ScrollTrigger fires, then grab the full page.
    const height = await page.evaluate(
      () => document.documentElement.scrollHeight
    )
    const steps = Math.min(14, Math.max(4, Math.round(height / vp.height)))
    for (let i = 1; i <= steps; i++) {
      await page.evaluate((y) => window.scrollTo(0, y), (height / steps) * i)
      await wait(650)
    }
    await wait(800)

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth
    )
    const finalHeight = await page.evaluate(
      () => document.documentElement.scrollHeight
    )
    await page.screenshot({ path: `${outDir}/${slug}-${vp.tag}-end.png` })

    const bad = errors.length > 0 || overflow > 0
    if (bad) failures++
    console.log(
      `${bad ? "FAIL" : "ok  "} ${route.padEnd(34)} ${vp.tag} h=${finalHeight} overflow=${overflow}` +
        (errors.length ? `\n     ${errors.slice(0, 5).join("\n     ")}` : "")
    )

    await page.close()
  }
}

await browser.close()
process.exit(failures ? 1 : 0)
