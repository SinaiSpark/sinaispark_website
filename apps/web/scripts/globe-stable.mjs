/** Confirms the globe holds its position and stays inside its box. */
import puppeteer from "puppeteer-core"
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe"
const BASE = process.argv[2]
const OUT = process.argv[3]
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: [
    "--no-sandbox",
    "--enable-unsafe-swiftshader",
    "--use-gl=angle",
    "--use-angle=swiftshader",
  ],
})
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })
await page.goto(BASE + "/india/", {
  waitUntil: "domcontentloaded",
  timeout: 60000,
})
await new Promise((r) => setTimeout(r, 4000))
await page.evaluate(async () => {
  const el = document.querySelector(".bmap")
  const t = el.getBoundingClientRect().top + window.scrollY - 250
  for (let y = 0; y < t; y += 400) {
    window.scrollTo(0, y)
    await new Promise((r) => setTimeout(r, 60))
  }
  window.scrollTo(0, t)
})
await new Promise((r) => setTimeout(r, 8000))

const box = await page.evaluate(() => {
  const wrap = document.querySelector(".bglobe")
  const bmap = document.querySelector(".bmap")
  const c = wrap.querySelector("canvas")
  const r = (e) => {
    const b = e.getBoundingClientRect()
    return {
      l: Math.round(b.left),
      t: Math.round(b.top),
      w: Math.round(b.width),
      h: Math.round(b.height),
    }
  }
  return { bmap: r(bmap), canvas: r(c) }
})
console.log("bmap  :", JSON.stringify(box.bmap))
console.log("canvas:", JSON.stringify(box.canvas))
console.log(
  "canvas inside bmap:",
  box.canvas.l >= box.bmap.l &&
    box.canvas.t >= box.bmap.t &&
    box.canvas.l + box.canvas.w <= box.bmap.l + box.bmap.w &&
    box.canvas.t + box.canvas.h <= box.bmap.t + box.bmap.h
)

// The arcs, rings and clocks animate by design, so compare a patch of the
// globe's left limb instead: if the sphere were turning, the coastline there
// would move. Clip is document-relative, hence the scroll offset.
const patch = await page.evaluate(() => {
  const c = document.querySelector(".bglobe canvas").getBoundingClientRect()
  return {
    x: Math.round(c.left + c.width * 0.06),
    y: Math.round(c.top + window.scrollY + c.height * 0.38),
    width: 90,
    height: 150,
  }
})
const shot = async (n) => {
  await page.screenshot({
    path: `${OUT}/stable-${n}.png`,
    captureBeyondViewport: false,
  })
  return page.screenshot({ encoding: "base64", clip: patch })
}
const a = await shot(1)
await new Promise((r) => setTimeout(r, 6000))
const b = await shot(2)
console.log("globe limb unchanged after 6s:", a === b)
await browser.close()
if (a !== b) {
  console.log("FAIL: the globe is still moving")
  process.exit(1)
}
console.log("globe is stationary and fully inside its box")
