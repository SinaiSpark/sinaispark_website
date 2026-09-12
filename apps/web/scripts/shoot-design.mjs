/**
 * Render a Claude Design bundle page (no <html>/<head>, like an Artifact)
 * and capture it at a few scroll depths, printing console errors.
 * Usage: node scripts/shoot-design.mjs <dir> <file.html> <outPrefix> [width]
 */
import puppeteer from "puppeteer-core"
import { readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe"
const [dir, file, out, w] = process.argv.slice(2)
const width = Number(w ?? 1440)

const body = readFileSync(join(dir, file), "utf8")
const wrapped = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0">${body}</body></html>`
const tmp = join(dir, `_wrapped_${file}`)
writeFileSync(tmp, wrapped)

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
})
const page = await browser.newPage()
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    console.log(`[${m.type()}]`, m.text())
})
page.on("pageerror", (e) => console.log("[pageerror]", e.message))
page.on("requestfailed", (r) => console.log("[reqfail]", r.url().slice(0, 120)))
await page.setViewport({ width, height: 900, deviceScaleFactor: 1 })
await page.goto("file:///" + tmp.replace(/\\/g, "/"), {
  waitUntil: "networkidle0",
})
await new Promise((r) => setTimeout(r, 4500)) // loader + hero intro

const stops = [0, 0.12, 0.22, 0.32, 0.42, 0.52, 0.62, 0.72, 0.82, 0.92, 1]
for (let i = 0; i < stops.length; i++) {
  await page.evaluate(
    (f) => window.scrollTo(0, (document.body.scrollHeight - innerHeight) * f),
    stops[i]
  )
  await new Promise((r) => setTimeout(r, 1600))
  await page.screenshot({ path: `${out}-${String(i).padStart(2, "0")}.png` })
}
const overflow = await page.evaluate(
  () => document.documentElement.scrollWidth - innerWidth
)
console.log("horizontal overflow px:", overflow)
await browser.close()
