/**
 * Diagnose horizontal overflow: reports every element wider than the viewport.
 * Usage: node scripts/measure-overflow.mjs <url> [width]
 */
import puppeteer from "puppeteer-core"

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe"
const url = process.argv[2] ?? "http://localhost:3411/"
const width = Number(process.argv[3] ?? 390)

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
})
const page = await browser.newPage()
await page.setViewport({ width, height: 900, deviceScaleFactor: 1 })
await page.goto(url, { waitUntil: "networkidle0" })

const report = await page.evaluate((vw) => {
  const doc = document.documentElement
  const offenders = []
  for (const el of document.querySelectorAll("*")) {
    const r = el.getBoundingClientRect()
    if (r.width === 0 || r.height === 0) continue
    if (r.right > vw + 1 || r.left < -1) {
      offenders.push({
        tag: el.tagName.toLowerCase(),
        cls: (el.getAttribute("class") ?? "").slice(0, 90),
        left: Math.round(r.left),
        right: Math.round(r.right),
        width: Math.round(r.width),
      })
    }
  }
  return {
    scrollWidth: doc.scrollWidth,
    clientWidth: doc.clientWidth,
    bodyScrollWidth: document.body.scrollWidth,
    offenders: offenders.slice(0, 25),
  }
}, width)

console.log(
  `viewport=${width}  documentElement.scrollWidth=${report.scrollWidth}  clientWidth=${report.clientWidth}  body.scrollWidth=${report.bodyScrollWidth}`
)
console.log(`overflowing elements: ${report.offenders.length}`)
for (const o of report.offenders) {
  console.log(
    `  <${o.tag}> left=${o.left} right=${o.right} w=${o.width}  ${o.cls}`
  )
}
await browser.close()
