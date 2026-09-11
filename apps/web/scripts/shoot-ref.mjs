/** Capture an external reference site at desktop + mobile widths. */
import puppeteer from "puppeteer-core"

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe"
const [url, outBase] = process.argv.slice(2)
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36"

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--lang=en-US"],
})

for (const [label, width] of [
  ["desktop", 1440],
  ["mobile", 390],
]) {
  const page = await browser.newPage()
  await page.setUserAgent(UA)
  await page.setViewport({ width, height: 900, deviceScaleFactor: 1 })
  try {
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 })
  } catch (e) {
    console.log(`${label}: goto warning — ${e.message.split("\n")[0]}`)
  }
  // trigger lazy/scroll-reveal content
  await page.evaluate(async () => {
    const h = document.body.scrollHeight
    for (let y = 0; y < h; y += 600) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 120))
    }
    window.scrollTo(0, 0)
  })
  await page.evaluate(() => new Promise((r) => setTimeout(r, 1500)))
  const out = `${outBase}-${label}.png`
  await page.screenshot({ path: out, fullPage: true })
  const h = await page.evaluate(() => document.body.scrollHeight)
  console.log(`${out}  ${width}x${h}`)
  await page.close()
}
await browser.close()
