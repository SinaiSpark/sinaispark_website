/**
 * Screenshot a route at a real device viewport.
 * Usage: node scripts/shoot.mjs <url> <width> <out.png> [--full]
 */
import puppeteer from "puppeteer-core"

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe"
const [url, w, out] = process.argv.slice(2)
const fullPage = process.argv.includes("--full")
const width = Number(w ?? 1440)

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
})
const page = await browser.newPage()
await page.setViewport({
  width,
  height: fullPage ? 900 : 1000,
  deviceScaleFactor: 1,
})
await page.goto(url, { waitUntil: "networkidle0" })
await page.evaluate(() => new Promise((r) => setTimeout(r, 1200)))
await page.screenshot({ path: out, fullPage })
console.log(`${out}  ${width}px  fullPage=${fullPage}`)
await browser.close()
