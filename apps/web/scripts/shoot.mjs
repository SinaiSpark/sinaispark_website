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
// Scroll through so whileInView reveals fire and *finish* before the
// fullPage capture resizes the viewport. Reveals run ~550ms plus up to
// ~400ms of stagger/delay, so each step must wait longer than that or
// far-down sections are captured mid-animation as empty bands.
await page.evaluate(async () => {
  const step = window.innerHeight * 0.6
  const h = document.body.scrollHeight
  for (let y = 0; y < h; y += step) {
    window.scrollTo(0, y)
    await new Promise((r) => setTimeout(r, 750))
  }
  window.scrollTo(0, 0)
})
await page.evaluate(() => new Promise((r) => setTimeout(r, 1200)))
await page.screenshot({ path: out, fullPage })
console.log(`${out}  ${width}px  fullPage=${fullPage}`)
await browser.close()
