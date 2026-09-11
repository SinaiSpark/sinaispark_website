/**
 * Why does a page never reach networkidle? Loads it with a loose wait, then
 * reports page errors, console errors, and any requests still in flight.
 * Usage: node scripts/probe-network.mjs <url>
 */
import puppeteer from "puppeteer-core"

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe"
const url = process.argv[2]

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
})
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })

const pending = new Map()
const errors = []
let finished = 0
page.on("request", (r) => pending.set(r.url(), Date.now()))
page.on("requestfinished", (r) => {
  pending.delete(r.url())
  finished++
})
page.on("requestfailed", (r) => {
  pending.delete(r.url())
  errors.push(`request failed: ${r.url()} — ${r.failure()?.errorText}`)
})
page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`))
page.on("console", (m) => {
  if (m.type() === "error" || m.type() === "warning")
    errors.push(`console.${m.type()}: ${m.text().slice(0, 200)}`)
})

const t0 = Date.now()
const res = await page.goto(url, {
  waitUntil: "domcontentloaded",
  timeout: 30000,
})
console.log(`status=${res?.status()}  final=${res?.url()}`)
await new Promise((r) => setTimeout(r, 8000))

console.log(`finished requests: ${finished}`)
console.log(`still pending after 8s: ${pending.size}`)
for (const [u, t] of pending)
  console.log(`  ${Math.round((Date.now() - t) / 1000)}s  ${u.slice(0, 160)}`)
console.log(`errors/warnings: ${errors.length}`)
for (const e of errors.slice(0, 12)) console.log(`  ${e}`)
console.log(`elapsed ${Math.round((Date.now() - t0) / 1000)}s`)
await browser.close()
