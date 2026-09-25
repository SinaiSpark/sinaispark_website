import { redirect } from "next/navigation"

import { endPreview, startPreview } from "@/lib/preview"

/**
 * Entry point for the CMS's "Open preview" button (apps/cms/config/admin.ts).
 * Checks the shared secret, starts a preview of that one page (or ends it,
 * for the "Published" tab; see lib/preview.ts) and sends the editor there.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = process.env.PREVIEW_SECRET
  if (!secret || searchParams.get("secret") !== secret) {
    return new Response("Invalid preview link", { status: 401 })
  }

  // Only paths on this site: never an open redirect.
  const path = searchParams.get("path") ?? "/"
  if (!/^\/(?!\/)[\w\-/]*$/.test(path)) {
    return new Response("Invalid path", { status: 400 })
  }

  if (searchParams.get("status") === "published") await endPreview()
  else await startPreview(path)

  redirect(path)
}
