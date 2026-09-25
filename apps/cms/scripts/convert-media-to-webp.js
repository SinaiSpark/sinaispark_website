/**
 * Converts the JPEG and PNG images already in the media library to WebP.
 * New uploads are converted on the way in (src/middlewares/webp-uploads.ts); this handles
 * everything uploaded before it, or uploaded some other way (scripts, the API).
 *
 *   pnpm --filter cms media:webp            # convert
 *   pnpm --filter cms media:webp --dry-run  # list what would change
 *
 * Strapi's own "replace" keeps the old extension (so a converted file would
 * be served as .jpg with WebP bytes). Instead, each image is uploaded again as
 * a new .webp file with the same name, alt text, caption and folder; every
 * entry that used the old file is pointed at the new one (media fields and
 * images inside article text); then the old file and its sizes are deleted.
 */
const fs = require("fs")
const os = require("os")
const path = require("path")
const sharp = require("sharp")
const { createStrapi, compileStrapi } = require("@strapi/strapi")

const FILE = "plugin::upload.file"
const CONVERT = ["image/jpeg", "image/jpg", "image/png"]
/** Content types whose rich-text body can embed images. */
const RICH_TEXT = [
  "api::blog-post.blog-post",
  "api::research-article.research-article",
]
const DRY_RUN = process.argv.includes("--dry-run")

const kb = (bytes) => `${Math.round(bytes / 1024)} KB`

async function readOriginal(app, file) {
  if (file.provider === "local") {
    return fs.promises.readFile(path.join(app.dirs.static.public, file.url))
  }
  const res = await fetch(file.url)
  if (!res.ok) throw new Error(`download failed (${res.status})`)
  return Buffer.from(await res.arrayBuffer())
}

/**
 * Swap the old file for the new one wherever an article body shows it. The
 * editor writes plain HTML with the file URLs in src and srcset, so every URL
 * of the old file (original and each size) is replaced by the new one.
 */
async function relinkRichText(app, oldFile, newFile) {
  const swaps = [[oldFile.url, newFile.url]]
  for (const [key, format] of Object.entries(oldFile.formats ?? {})) {
    swaps.push([format.url, newFile.formats?.[key]?.url ?? newFile.url])
  }
  let changed = 0
  for (const uid of RICH_TEXT) {
    // Every row, draft and published alike, so nothing is republished.
    const rows = await app.db.query(uid).findMany({ select: ["id", "body"] })
    for (const row of rows) {
      if (typeof row.body !== "string") continue
      let body = row.body
      for (const [from, to] of swaps) body = body.split(from).join(to)
      if (body !== row.body) {
        await app.db
          .query(uid)
          .update({ where: { id: row.id }, data: { body } })
        changed += 1
      }
    }
  }
  return changed
}

async function main() {
  const app = await createStrapi(await compileStrapi()).load()
  app.log.level = "error"

  // Same settings as uploads (src/lib/webp.ts), from the build just compiled.
  const { WEBP_OPTIONS: options } = require("../dist/src/lib/webp")
  const upload = app.plugin("upload").service("upload")
  const files = await app.db.query(FILE).findMany({
    where: { mime: { $in: CONVERT } },
    populate: ["folder"],
  })

  if (!files.length) {
    console.log("Nothing to convert: every image is already WebP.")
  }

  let before = 0
  let after = 0
  const tmp = await fs.promises.mkdtemp(path.join(os.tmpdir(), "webp-"))

  for (const file of files) {
    try {
      const original = await readOriginal(app, file)
      const base = path.parse(file.name).name
      const target = path.join(tmp, `${base}-${file.id}.webp`)
      const { size } = await sharp(original).webp(options).toFile(target)
      before += original.length
      after += size
      console.log(
        `${DRY_RUN ? "would convert" : "converting"} ${file.name}: ${kb(original.length)} → ${kb(size)}`
      )
      if (DRY_RUN) continue

      const [created] = await upload.upload({
        data: {
          fileInfo: {
            name: `${base}.webp`,
            alternativeText: file.alternativeText,
            caption: file.caption,
            folder: file.folder?.id,
          },
        },
        files: {
          filepath: target,
          originalFilename: `${base}.webp`,
          mimetype: "image/webp",
          size,
        },
      })

      // Media fields (covers, share images) live in the morph join table.
      await app.db
        .connection("files_related_mph")
        .where({ file_id: file.id })
        .update({ file_id: created.id })
      const bodies = await relinkRichText(app, file, created)

      await upload.remove(file)
      console.log(
        `  → ${created.url}${bodies ? ` (also relinked in ${bodies} article bodies)` : ""}`
      )
    } catch (error) {
      console.error(`  ✗ ${file.name}: ${error.message}`)
    }
  }

  await fs.promises.rm(tmp, { recursive: true, force: true })
  if (files.length) {
    console.log(
      `\n${files.length} images: ${kb(before)} → ${kb(after)}${DRY_RUN ? " (dry run, nothing changed)" : ""}`
    )
  }

  // The relinking bypasses the document service, so tell the site directly.
  const url = process.env.WEB_REVALIDATE_URL
  const secret = process.env.WEB_REVALIDATE_SECRET
  if (!DRY_RUN && files.length && url && secret) {
    await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-revalidate-secret": secret,
      },
      body: JSON.stringify({ tags: ["blog", "research"], now: true }),
    }).catch(() =>
      console.warn("Site refresh failed; it catches up within the hour.")
    )
  }

  await app.destroy()
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
