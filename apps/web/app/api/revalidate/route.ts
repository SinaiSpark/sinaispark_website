import { revalidateTag } from "next/cache"

import { assistantEnabled } from "@/lib/assistant/db"
import { scheduleIngest } from "@/lib/assistant/knowledge"

/** Tags the CMS may refresh; see SITE_TAGS in apps/cms/src/lib/revalidate.ts. */
const TAGS = new Set([
  "blog",
  "research",
  "settings",
  "seo",
  "faqs",
  "team",
  "testimonials",
  "contact",
  "home",
  "assistant",
  "knowledge",
])

/**
 * Called by the CMS whenever content is published, unpublished or deleted,
 * so the cached pages built from it are rebuilt on their next visit.
 *
 * By default the next visitor still gets the old page once while the new one
 * builds, which is fine when the old content is still valid. `now: true`
 * drops it outright, for changes that break the old page, such as media
 * files being deleted by the WebP conversion.
 */
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET
  if (!secret || request.headers.get("x-revalidate-secret") !== secret) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = (await request.json().catch(() => ({}))) as {
    tags?: unknown
    now?: unknown
  }
  const tags = Array.isArray(body.tags)
    ? body.tags.filter((tag): tag is string => TAGS.has(tag as string))
    : []
  for (const tag of tags) {
    revalidateTag(tag, body.now === true ? { expire: 0 } : "max")
  }
  // Whatever changed may be something the assistant quotes: re-index it
  // once the pages have rebuilt (unchanged passages are skipped).
  if (tags.length && assistantEnabled()) scheduleIngest()

  return Response.json({ revalidated: tags })
}
