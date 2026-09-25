/**
 * Loads the site's sample blog posts and research articles into a local CMS
 * so the pages have something to show during development. Every body says
 * plainly that it is sample text. Safe to re-run: entries whose title already
 * exists are skipped.
 *
 *   pnpm --filter cms seed:samples
 *
 * sample-content.json is the catalogue the site shipped with before the CMS
 * (the old BLOG.posts and REPORTS arrays in apps/web/content).
 */
const fs = require("fs")
const os = require("os")
const path = require("path")
const sharp = require("sharp")
const { createStrapi, compileStrapi } = require("@strapi/strapi")

const SAMPLE = require("./sample-content.json")
const WEB_PUBLIC = path.resolve(__dirname, "../../web/public")
const MONTHS = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ")

/** "12 Sep 2026" or "Aug 2026" → "2026-09-12" / "2026-08-01". */
function isoDate(text) {
  const parts = text.split(" ")
  const [day, month, year] = parts.length === 3 ? parts : ["1", ...parts]
  const m = String(MONTHS.indexOf(month) + 1).padStart(2, "0")
  return `${year}-${m}-${String(day).padStart(2, "0")}`
}

// Bodies are HTML, as the article editor (src/admin/rich-text) writes them.
const p = (value) => `<p>${value}</p>`
const h2 = (value) => `<h2>${value}</h2>`
const ul = (items) => `<ul>${items.map((i) => `<li>${i}</li>`).join("")}</ul>`

const SAMPLE_NOTE =
  "Sample article. This text stands in for the real piece, which will be written in the CMS before launch."

// The excerpt/summary already sits under the title, so bodies start after it.
function blogBody() {
  return [
    p(SAMPLE_NOTE),
    h2("What changed"),
    p(
      "Placeholder section. The published version explains the change, who it applies to and the date it takes effect."
    ),
    h2("What to do about it"),
    ul([
      "Placeholder step one.",
      "Placeholder step two.",
      "Placeholder step three.",
    ]),
  ].join("")
}

function researchBody() {
  return [
    p(SAMPLE_NOTE),
    h2("Key findings"),
    ul([
      "Placeholder finding one.",
      "Placeholder finding two.",
      "Placeholder finding three.",
    ]),
    h2("Method"),
    p(
      "Placeholder section. The published version sets out the regulation, ministry practice and anonymised casework the findings rest on."
    ),
    // A table with a caption, as the editor stores one.
    '<figure class="table"><table><thead><tr><th>Placeholder item</th><th>Timeline</th><th>Cost</th></tr></thead><tbody><tr><td>Placeholder row one</td><td>2–4 weeks</td><td>SAR —</td></tr><tr><td>Placeholder row two</td><td>1–2 weeks</td><td>SAR —</td></tr></tbody></table><figcaption>Placeholder table.</figcaption></figure>',
    h2("What it means for your entity"),
    p(
      "Placeholder section. The published version turns the findings into decisions for a foreign-owned company."
    ),
  ].join("")
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
  const covers = new Map()

  async function cover(publicPath) {
    if (covers.has(publicPath)) return covers.get(publicPath)
    // Stored as WebP, like everything uploaded through the admin.
    const source = path.join(WEB_PUBLIC, publicPath)
    const name = `${path.parse(source).name}.webp`
    const filepath = path.join(os.tmpdir(), name)
    const { size } = await sharp(source).webp(webpOptions).toFile(filepath)
    const [file] = await upload.upload({
      data: { fileInfo: { name, alternativeText: "" } },
      files: { filepath, originalFilename: name, mimetype: "image/webp", size },
    })
    await fs.promises.rm(filepath, { force: true })
    covers.set(publicPath, file.id)
    return file.id
  }

  async function seed(uid, entries, toData, bodyOf) {
    const documents = app.documents(uid)
    let created = 0
    let refilled = 0
    for (const [i, entry] of entries.entries()) {
      const [existing] = await documents.findMany({
        filters: { title: entry.title },
        limit: 1,
      })
      if (existing) {
        // Only an empty body is filled in (e.g. after the editor changed
        // format); anything an editor wrote is left alone.
        if (existing.body) continue
        const body = bodyOf(entry)
        await documents.update({
          documentId: existing.documentId,
          data: { body },
        })
        await documents.publish({ documentId: existing.documentId })
        refilled += 1
        continue
      }
      const doc = await documents.create({ data: await toData(entry, i) })
      await documents.publish({ documentId: doc.documentId })
      created += 1
    }
    console.log(
      `${uid}: ${created} created, ${refilled} bodies filled, ${entries.length - created - refilled} left as they were`
    )
  }

  await seed(
    "api::blog-post.blog-post",
    SAMPLE.posts,
    async (post, i) => ({
      title: post.title,
      excerpt: post.excerpt,
      cover: await cover(post.image),
      format: post.format,
      market: post.market,
      date: isoDate(post.date),
      readMinutes: parseInt(post.readTime, 10),
      body: blogBody(),
      featured: i === 0,
    }),
    blogBody
  )

  await seed(
    "api::research-article.research-article",
    SAMPLE.reports,
    async (report, i) => ({
      title: report.title,
      summary: report.summary,
      cover: await cover(report.image),
      market: report.market,
      topic: report.topic,
      date: isoDate(report.date),
      readMinutes: parseInt(report.readTime, 10),
      body: researchBody(),
      emailGate: report.gated,
      previewBlocks: 3,
      featured: i === 0,
    }),
    researchBody
  )

  await app.destroy()
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
