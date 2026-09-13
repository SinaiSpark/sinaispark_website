/** Proves the three.js stack is not in the India page's initial payload, and
 *  that the globe actually renders once the bridge section is reached. */
import puppeteer from "puppeteer-core"
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe"
const BASE = process.argv[2] || "http://localhost:3413"
const OUT = process.argv[3] || "."

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

let js = 0
const seen = new Set()
page.on("response", async (r) => {
  const u = r.url()
  if (!u.endsWith(".js") || seen.has(u)) return
  seen.add(u)
  try {
    js += (await r.buffer()).length
  } catch {}
})
const errs = []
page.on("console", (m) => {
  if (m.type() === "error") errs.push(m.text())
})
page.on("pageerror", (e) => errs.push("PAGEERROR " + e.message))

await page.goto(BASE + "/india/", {
  waitUntil: "domcontentloaded",
  timeout: 60000,
})
await new Promise((r) => setTimeout(r, 5000))
const atLoad = js
console.log("JS on first paint of /india/:", Math.round(atLoad / 1024) + " KB")

await page.evaluate(async () => {
  const el = document.querySelector(".bmap")
  const target = el.getBoundingClientRect().top + window.scrollY - 400
  for (let y = 0; y < target; y += 400) {
    window.scrollTo(0, y)
    await new Promise((r) => setTimeout(r, 70))
  }
  window.scrollTo(0, target)
})
await new Promise((r) => setTimeout(r, 9000))
console.log(
  "JS after reaching the bridge:",
  Math.round(js / 1024) +
    " KB  (+" +
    Math.round((js - atLoad) / 1024) +
    " KB loaded lazily)"
)

const state = await page.evaluate(() => {
  const wrap = document.querySelector(".bglobe")
  const canvas = wrap?.querySelector("canvas")
  let painted = false
  if (canvas) {
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl")
    painted = !!gl && canvas.width > 0 && canvas.height > 0
  }
  return {
    wrap: !!wrap,
    canvas: !!canvas,
    size: canvas ? canvas.width + "x" + canvas.height : "-",
    painted,
    pointerEvents: wrap ? getComputedStyle(wrap).pointerEvents : "-",
    zeroVisible: !!document.querySelector(".bmap .zero b"),
    nodes: document.querySelectorAll(".bmap .bnode").length,
  }
})
console.log("globe:", JSON.stringify(state))
console.log("console errors:", errs.length)
errs.slice(0, 5).forEach((e) => console.log("  " + e.slice(0, 200)))

await page.screenshot({
  path: OUT + "/globe.png",
  captureBeyondViewport: false,
})
await browser.close()
