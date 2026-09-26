/**
 * Rebuilds the assistant's search index on a running site and prints what
 * changed. The work happens in the site itself (app/api/assistant/reindex),
 * which holds the embedding model.
 *
 *   pnpm --filter web kb:ingest                       # local dev site
 *   SITE=https://sinaispark.com pnpm --filter web kb:ingest
 */
const site = (process.env.SITE ?? "http://localhost:3100").replace(/\/$/, "")
const secret = process.env.REVALIDATE_SECRET
if (!secret) {
  console.error("REVALIDATE_SECRET is not set (it's read from .env.local).")
  process.exit(1)
}

const started = Date.now()
const res = await fetch(`${site}/api/assistant/reindex/`, {
  method: "POST",
  headers: { "x-revalidate-secret": secret },
})
const body = await res.json().catch(() => ({}))
if (!res.ok) {
  console.error(`Reindex failed (${res.status}):`, body.error ?? body)
  process.exit(1)
}
console.log(
  `Index updated in ${((Date.now() - started) / 1000).toFixed(1)}s:\n` +
    `  passages  +${body.chunks.added} -${body.chunks.removed} (${body.chunks.total} total)\n` +
    `  questions +${body.intents.added} -${body.intents.removed} (${body.intents.total} total)`
)
