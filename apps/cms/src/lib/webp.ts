import { promises as fs } from "node:fs"
import path from "node:path"
import sharp from "sharp"

/** https://sharp.pixelplumbing.com/api-output#webp */
export const WEBP_OPTIONS = { quality: 80, effort: 4 } as const

/** Formats converted on upload. GIFs are left alone (they may be animated). */
export const CONVERTIBLE = new Set(["image/jpeg", "image/jpg", "image/png"])

export const webpName = (name: string) => `${path.parse(name).name}.webp`

/** The shape Strapi's body parser gives an uploaded file. */
export interface UploadedFile {
  filepath: string
  originalFilename?: string | null
  mimetype?: string | null
  size: number
}

/**
 * Converts an upload's temporary file to WebP in place, before Strapi reads
 * it. Keeps the original when WebP would not be smaller (rare, but it happens
 * with tiny or already heavily compressed images), unless `force` is set.
 * Returns whether it converted.
 */
export async function convertUploadToWebp(
  file: UploadedFile,
  { force = false }: { force?: boolean } = {}
) {
  if (!file.mimetype || !CONVERTIBLE.has(file.mimetype)) return false

  const name = webpName(file.originalFilename ?? path.basename(file.filepath))
  const target = path.join(path.dirname(file.filepath), `${Date.now()}-${name}`)
  const { size } = await sharp(file.filepath).webp(WEBP_OPTIONS).toFile(target)

  if (size >= file.size && !force) {
    await fs.rm(target, { force: true })
    return false
  }

  await fs.rm(file.filepath, { force: true })
  file.filepath = target
  file.originalFilename = name
  file.mimetype = "image/webp"
  file.size = size
  return true
}
