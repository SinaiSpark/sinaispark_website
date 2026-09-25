import type { Core } from "@strapi/strapi"

import { convertUploadToWebp, webpName, type UploadedFile } from "../lib/webp"

/**
 * Converts JPEG and PNG uploads to WebP before Strapi stores them, so the
 * original and every generated size (thumbnail/small/medium/large) are WebP.
 *
 * Covers every way a file is uploaded:
 *   POST /upload/files              the media library (one file per request)
 *   POST /upload                    the older uploader in entries (one or many)
 *   POST /api/upload                the content API
 *   POST /upload/files/:id/replace  "replace file" in the media library
 *   POST /upload?id=:id             "replace file" in the older uploader
 *
 * Strapi keeps the old extension when a file is replaced, so a replacement is
 * converted exactly when the file it replaces is WebP: the bytes always match
 * the .webp or .jpg in the URL.
 *
 * Existing images: pnpm --filter cms media:webp
 */
const UPLOAD_PATHS = new Set(["/upload", "/upload/files", "/api/upload"])
const REPLACE_PATH = /^\/upload\/files\/(\d+)\/replace\/?$/

type Info = Record<string, unknown>

/**
 * fileInfo arrives in three shapes: one JSON object, one JSON array (the
 * media library), or one JSON string per file (the older uploader). Read it
 * into a list and hand back a writer that restores the same shape.
 */
function readFileInfo(raw: unknown): {
  infos: Info[]
  write: (infos: Info[]) => unknown
} | null {
  if (raw === undefined) return { infos: [], write: () => raw }
  if (typeof raw === "string") {
    const parsed = JSON.parse(raw) as Info | Info[]
    return Array.isArray(parsed)
      ? { infos: parsed, write: (infos) => JSON.stringify(infos) }
      : { infos: [parsed], write: (infos) => JSON.stringify(infos[0]) }
  }
  if (Array.isArray(raw)) {
    return {
      infos: raw.map((item) =>
        typeof item === "string" ? (JSON.parse(item) as Info) : (item as Info)
      ),
      write: (infos) =>
        raw.map((item, i) =>
          typeof item === "string" ? JSON.stringify(infos[i]) : infos[i]
        ),
    }
  }
  return null
}

export default (_config: unknown, { strapi }: { strapi: Core.Strapi }) => {
  /**
   * What to do with this request: null to leave it alone, otherwise whether
   * conversion is forced (a replacement of a WebP must become WebP even in
   * the rare case it would not be smaller).
   */
  async function plan(ctx: any): Promise<{ force: boolean } | null> {
    if (ctx.method !== "POST") return null
    const replaceId =
      ctx.path.match(REPLACE_PATH)?.[1] ??
      (ctx.path === "/upload" ? ctx.query?.id : undefined)
    if (replaceId) {
      const existing = await strapi.db
        .query("plugin::upload.file")
        .findOne({ where: { id: Number(replaceId) }, select: ["ext"] })
      return existing?.ext === ".webp" ? { force: true } : null
    }
    return UPLOAD_PATHS.has(ctx.path) ? { force: false } : null
  }

  return async (ctx: any, next: () => Promise<void>) => {
    const files = ctx.request.files?.files as
      | UploadedFile
      | UploadedFile[]
      | undefined
    const mode = files ? await plan(ctx) : null

    if (files && mode) {
      const list = Array.isArray(files) ? files : [files]
      let fileInfo: ReturnType<typeof readFileInfo> = null
      try {
        fileInfo = readFileInfo(ctx.request.body?.fileInfo)
      } catch {
        // Unreadable fileInfo: let Strapi's own validation answer it.
      }

      for (const [i, file] of list.entries()) {
        try {
          if (!(await convertUploadToWebp(file, mode))) continue
          // Keep the name in step with the file: for several files at once,
          // Strapi pairs each file with its details by this name.
          const info = fileInfo?.infos[i]
          if (info && typeof info.name === "string") {
            info.name = webpName(info.name)
          }
        } catch (error) {
          // A failed conversion uploads the original rather than losing it.
          strapi.log.warn(
            `WebP conversion skipped for ${file.originalFilename}: ${(error as Error).message}`
          )
        }
      }

      if (fileInfo && ctx.request.body?.fileInfo !== undefined) {
        ctx.request.body.fileInfo = fileInfo.write(fileInfo.infos)
      }
    }

    await next()
  }
}
