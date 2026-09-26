import { assistantEnabled } from "@/lib/assistant/db"
import { ingest } from "@/lib/assistant/knowledge"

/**
 * Rebuilds the assistant's search index now and reports what changed. For
 * `pnpm --filter web kb:ingest` and deploys; publishing in the CMS triggers
 * the same thing on its own (app/api/revalidate). Uses REVALIDATE_SECRET.
 */

export const runtime = "nodejs"
export const maxDuration = 300

export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET
  if (!secret || request.headers.get("x-revalidate-secret") !== secret) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }
  if (!assistantEnabled()) {
    return Response.json(
      { error: "ASSISTANT_DATABASE_URL is not set" },
      { status: 503 }
    )
  }
  try {
    return Response.json(await ingest())
  } catch (error) {
    console.error("[assistant] reindex:", error)
    return Response.json({ error: (error as Error).message }, { status: 500 })
  }
}
