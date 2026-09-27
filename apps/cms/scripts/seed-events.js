/**
 * Loads sample events into a local CMS so the events pages have something to
 * show during development: write-ups, photo galleries, uploaded video clips
 * and a YouTube link. Every write-up says plainly that it is sample text.
 *
 *   pnpm --filter cms seed:events
 *
 * The photos and clips are downloaded from the free stock libraries listed in
 * event-content.json, then uploaded like anything added through the admin
 * (photos as WebP). Safe to re-run: events whose title already exists are
 * skipped, and nothing is downloaded unless an event needs it.
 */
const fs = require("fs")
const os = require("os")
const path = require("path")
const sharp = require("sharp")
const { createStrapi, compileStrapi } = require("@strapi/strapi")

const SAMPLE = require("./event-content.json")

const p = (value) => `<p>${value}</p>`
const h2 = (value) => `<h2>${value}</h2>`
const ul = (items) => `<ul>${items.map((i) => `<li>${i}</li>`).join("")}</ul>`

// The summary already sits under the title, so the write-up starts after it.
function body(event) {
  const hosted = event.role === "Organised"
  return [
    p(
      "Sample event. This write-up stands in for the real one, which will be written in the CMS before launch."
    ),
    h2(hosted ? "What we covered" : "Why we were there"),
    p(
      "Placeholder section. The published version describes the sessions, who spoke and the questions the room kept coming back to."
    ),
    h2("What we took away"),
    ul([
      "Placeholder takeaway one.",
      "Placeholder takeaway two.",
      "Placeholder takeaway three.",
    ]),
  ].join("")
}

async function download(url, file) {
  const res = await fetch(url, { signal: AbortSignal.timeout(120_000) })
  if (!res.ok) throw new Error(`Download failed (${res.status}): ${url}`)
  await fs.promises.writeFile(file, Buffer.from(await res.arrayBuffer()))
}

async function main() {
  if (
    process.env.NODE_ENV === "production" &&
    !process.argv.includes("--force")
  ) {
    throw new Error("Refusing to seed sample content into production.")
  }

  const app = await createStrapi(await compileStrapi()).load()
  app.log.level = "error"
  const upload = app.plugin("upload").service("upload")
  // Same settings as uploads (src/lib/webp.ts), from the build just compiled.
  const { WEBP_OPTIONS: webpOptions } = require("../dist/src/lib/webp")
  const tmp = await fs.promises.mkdtemp(path.join(os.tmpdir(), "events-"))
  const uploaded = new Map()

  /** Downloads and uploads a catalogue item once, returning its file id. */
  async function media(key) {
    if (uploaded.has(key)) return uploaded.get(key)
    const item = SAMPLE.media[key]
    if (!item) throw new Error(`Unknown media "${key}" in event-content.json`)

    const source = path.join(tmp, `${key}${item.video ? ".mp4" : ".jpg"}`)
    await download(item.url, source)

    let filepath = source
    let name = `event-${key}.mp4`
    let mimetype = "video/mp4"
    if (!item.video) {
      name = `event-${key}.webp`
      mimetype = "image/webp"
      filepath = path.join(tmp, name)
      await sharp(source).webp(webpOptions).toFile(filepath)
    }
    const { size } = await fs.promises.stat(filepath)
    const [file] = await upload.upload({
      data: {
        fileInfo: { name, alternativeText: item.alt, caption: item.alt },
      },
      files: { filepath, originalFilename: name, mimetype, size },
    })
    uploaded.set(key, file.id)
    process.stdout.write(".")
    return file.id
  }

  const documents = app.documents("api::event.event")
  let created = 0
  for (const event of SAMPLE.events) {
    const [existing] = await documents.findMany({
      filters: { title: event.title },
      limit: 1,
    })
    if (existing) continue

    const gallery = []
    for (const key of event.gallery) gallery.push(await media(key))

    const doc = await documents.create({
      data: {
        title: event.title,
        role: event.role,
        format: event.format,
        summary: event.summary,
        startDate: event.startDate,
        endDate: event.endDate ?? null,
        city: event.city,
        venue: event.venue || null,
        market: event.market,
        cover: await media(event.cover),
        gallery,
        videos: event.videos ?? [],
        highlights: event.highlights ?? [],
        registrationUrl: event.registrationUrl ?? null,
        featured: Boolean(event.featured),
        body: body(event),
      },
    })
    await documents.publish({ documentId: doc.documentId })
    created += 1
  }

  await fs.promises.rm(tmp, { recursive: true, force: true })
  console.log(
    `\napi::event.event: ${created} created, ${SAMPLE.events.length - created} left as they were, ${uploaded.size} media files uploaded`
  )

  await app.destroy()
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
