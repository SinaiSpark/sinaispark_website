import { cookies, draftMode } from "next/headers"

/**
 * Previews are scoped to the page the editor opened.
 *
 * Next.js draft mode is one site-wide cookie that lasts until the browser
 * closes, so on its own an editor who pressed "Open preview" once would keep
 * seeing drafts, preview bars and hidden Insights pages everywhere. Alongside
 * it the preview route sets this cookie to the previewed path, for an hour;
 * a page only treats itself as a preview when both are present and the path
 * is its own.
 */
export const PREVIEW_COOKIE = "ss_preview"
const PREVIEW_MAX_AGE = 60 * 60

const secure = process.env.NODE_ENV !== "development"

/** Same attributes as Next's own draft cookie, so both reach the CMS frame. */
export async function startPreview(path: string) {
  ;(await draftMode()).enable()
  ;(await cookies()).set(PREVIEW_COOKIE, path, {
    httpOnly: true,
    path: "/",
    maxAge: PREVIEW_MAX_AGE,
    sameSite: secure ? "none" : "lax",
    secure,
  })
}

export async function endPreview() {
  ;(await draftMode()).disable()
  ;(await cookies()).delete(PREVIEW_COOKIE)
}

/**
 * True only while an editor is previewing this exact page. Checks draft mode
 * first: reading cookies otherwise would make every static page dynamic.
 */
export async function isPreviewing(path: string) {
  if (!(await draftMode()).isEnabled) return false
  return (await cookies()).get(PREVIEW_COOKIE)?.value === path
}
