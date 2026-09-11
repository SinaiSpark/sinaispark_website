/** Capture the header's interactive states: mobile sheet open, desktop services dropdown open. */
import puppeteer from "puppeteer-core"

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe"
const [base, outDir] = process.argv.slice(2)

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
})

// Mobile: open the menu sheet
{
  const page = await browser.newPage()
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 })
  await page.goto(`${base}/`, { waitUntil: "networkidle0" })
  await page.click('button[aria-label="Open menu"]')
  await page.evaluate(() => new Promise((r) => setTimeout(r, 700)))
  await page.screenshot({ path: `${outDir}/nav-mobile-open.png` })
  console.log("nav-mobile-open.png")
  await page.close()
}

// Desktop: hover Services to open the dropdown
{
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 760, deviceScaleFactor: 1 })
  await page.goto(`${base}/`, { waitUntil: "networkidle0" })
  const btn = await page.$('header button[aria-haspopup="true"]')
  await btn.hover()
  await page.evaluate(() => new Promise((r) => setTimeout(r, 500)))
  await page.screenshot({ path: `${outDir}/nav-desktop-dropdown.png` })
  console.log("nav-desktop-dropdown.png")
  await page.close()
}

await browser.close()
