import sitemap from "@/app/sitemap"
import {
  hashOf,
  withOverlap,
  passageText,
  passagesFromHtml,
  splitText,
} from "@/lib/assistant/chunk"
import { sql, vector } from "@/lib/assistant/db"
import { embedPassages, embedQuestions } from "@/lib/assistant/embed"
import { cms } from "@/lib/cms"
import { mediaUrl } from "@/lib/content-api"
import { ROUTES } from "@/content/site"

/**
 * Builds the assistant's search index from:
 *
 * - every page in the sitemap, fetched as rendered (so it's exactly what
 *   visitors read, whether the copy lives in code or in the CMS)
 * - the FAQs and the assistant's menu, straight from the CMS
 * - "Assistant knowledge" documents: uploaded PDF, Word or text files
 *
 * Each passage is stored with a hash, so a re-run embeds only what changed.
 * Written answers (menu topics, FAQs) also go in as "intents": a typed
 * question that closely matches one gets that answer without the model.
 */

interface Chunk {
  source: string
  url: string | null
  title: string
  heading: string | null
  content: string
}

interface Intent {
  kind: "topic" | "faq"
  ref: string
  question: string
  answer: string | null
  url: string | null
}

/** Where the site can reach itself; in production, its own port. */
const origin = () =>
  (
    process.env.ASSISTANT_CRAWL_ORIGIN ??
    `http://127.0.0.1:${process.env.PORT ?? 3100}`
  ).replace(/\/$/, "")

const fresh = { cache: "no-store" as const }

/** Characters per document passage (about 120 tokens). */
const DOCUMENT_PASSAGE = 500

/** The first line of every sample article's body. */
const SAMPLE_MARKER = "This text stands in for the real piece"

async function fetchPage(path: string) {
  const url = `${origin()}${path}`
  let res = await fetch(url, { cache: "no-store", redirect: "follow" })
  // Right after a CMS publish the first request gets the old page while the
  // new one renders; ask again for the new one.
  if (res.headers.get("x-nextjs-cache") === "STALE") {
    await new Promise((r) => setTimeout(r, 2500))
    res = await fetch(url, { cache: "no-store", redirect: "follow" })
  }
  if (!res.ok) throw new Error(`${res.status} fetching ${path}`)
  return res.text()
}

async function pageChunks(): Promise<Chunk[]> {
  const entries = await sitemap()
  const chunks: Chunk[] = []
  for (const entry of entries) {
    const path = new URL(entry.url).pathname
    try {
      const html = await fetchPage(path)
      // Sample articles (apps/cms/scripts/seed-samples.js) have a real-looking
      // title over placeholder text; indexed, the model answers the title
      // from its own knowledge. Real articles replace them before launch.
      if (html.includes(SAMPLE_MARKER)) continue
      const { title, passages } = passagesFromHtml(html)
      for (const p of passages) {
        chunks.push({
          source: `page:${path}`,
          url: path,
          ...p,
          title: p.title || title,
        })
      }
    } catch (error) {
      console.warn(`[assistant] skipped ${path}:`, (error as Error).message)
    }
  }
  return chunks
}

async function faqData() {
  const res = await cms<{
    data: { documentId: string; question: string; answer: string }[]
  }>(
    "/faqs?fields[0]=question&fields[1]=answer&pagination[pageSize]=200",
    fresh
  )
  const chunks: Chunk[] = []
  const intents: Intent[] = []
  for (const faq of res.data) {
    chunks.push({
      source: `faq:${faq.documentId}`,
      url: ROUTES.faq,
      title: "Frequently asked questions",
      heading: faq.question,
      content: faq.answer,
    })
    intents.push({
      kind: "faq",
      ref: faq.documentId,
      question: faq.question,
      answer: faq.answer,
      url: ROUTES.faq,
    })
  }
  return { chunks, intents }
}

async function topicData() {
  const res = await cms<{
    data: {
      documentId: string
      question: string
      answer: string
      alsoAsked?: string | null
      linkUrl?: string | null
    }[]
  }>(
    "/assistant-topics?fields[0]=question&fields[1]=answer&fields[2]=alsoAsked&fields[3]=linkUrl&pagination[pageSize]=200",
    fresh
  )
  const chunks: Chunk[] = []
  const intents: Intent[] = []
  for (const topic of res.data) {
    const url = topic.linkUrl?.startsWith("/") ? topic.linkUrl : null
    chunks.push({
      source: `topic:${topic.documentId}`,
      url,
      title: topic.question,
      heading: null,
      content: topic.answer,
    })
    const questions = [
      topic.question,
      ...(topic.alsoAsked ?? "").split("\n").map((q) => q.trim()),
    ].filter(Boolean)
    for (const question of questions) {
      intents.push({
        kind: "topic",
        ref: topic.documentId,
        question,
        answer: null,
        url,
      })
    }
  }
  return { chunks, intents }
}

async function fileText(url: string, mime: string, name: string) {
  const res = await fetch(url, { cache: "no-store" })
  if (!res.ok) throw new Error(`${res.status} downloading ${name}`)
  const buffer = new Uint8Array(await res.arrayBuffer())
  if (mime === "application/pdf" || /\.pdf$/i.test(name)) {
    const { extractText, getDocumentProxy } = await import("unpdf")
    const pdf = await getDocumentProxy(buffer)
    const { text } = await extractText(pdf, { mergePages: true })
    return text
  }
  if (/wordprocessingml/.test(mime) || /\.docx$/i.test(name)) {
    const mammoth = await import("mammoth")
    const { value } = await mammoth.extractRawText({
      buffer: Buffer.from(buffer),
    })
    return value
  }
  if (/^text\//.test(mime) || /\.(md|txt|csv)$/i.test(name)) {
    return new TextDecoder().decode(buffer)
  }
  throw new Error(`unsupported file type ${mime} (${name})`)
}

async function documentChunks(): Promise<Chunk[]> {
  const res = await cms<{
    data: {
      documentId: string
      title: string
      text?: string | null
      link?: string | null
      file?: { url: string; mime: string; name: string } | null
    }[]
  }>(
    "/knowledge-documents?fields[0]=title&fields[1]=text&fields[2]=link&populate[file][fields][0]=url&populate[file][fields][1]=mime&populate[file][fields][2]=name&pagination[pageSize]=200",
    fresh
  )
  const chunks: Chunk[] = []
  for (const doc of res.data) {
    let body = doc.text ?? ""
    if (doc.file?.url) {
      try {
        const text = await fileText(
          mediaUrl(doc.file.url) ?? doc.file.url,
          doc.file.mime,
          doc.file.name
        )
        body = `${body}\n\n${text}`
      } catch (error) {
        console.warn(
          `[assistant] document "${doc.title}":`,
          (error as Error).message
        )
      }
    }
    const link = doc.link && /^(\/|https:\/\/)/.test(doc.link) ? doc.link : null
    // Smaller passages than for pages: a document has no sections to split
    // at, and one passage mixing several topics matches none of them well.
    for (const content of withOverlap(splitText(body, DOCUMENT_PASSAGE))) {
      chunks.push({
        source: `doc:${doc.documentId}`,
        url: link,
        title: doc.title,
        heading: null,
        content,
      })
    }
  }
  return chunks
}

/** Replaces stored chunks with `chunks`, embedding only new or changed ones. */
async function syncChunks(chunks: Chunk[]) {
  const withHash = chunks.map((c) => ({
    ...c,
    text: passageText(c),
    hash: hashOf(`${c.source}\n${c.url}\n${passageText(c)}`),
  }))
  const existing = await sql<{ id: string; hash: string }>(
    "select id, hash from assistant.chunks"
  )
  const have = new Set(existing.map((row) => row.hash))
  const want = new Set(withHash.map((c) => c.hash))

  const stale = existing
    .filter((row) => !want.has(row.hash))
    .map((row) => row.id)
  if (stale.length) {
    await sql("delete from assistant.chunks where id = any($1::bigint[])", [
      stale,
    ])
  }

  const added = withHash.filter(
    (c, i) =>
      !have.has(c.hash) && withHash.findIndex((d) => d.hash === c.hash) === i
  )
  const vectors = await embedPassages(added.map((c) => c.text))
  for (const [i, c] of added.entries()) {
    await sql(
      `insert into assistant.chunks (source, url, title, heading, content, hash, embedding)
       values ($1, $2, $3, $4, $5, $6, $7)`,
      [
        c.source,
        c.url,
        c.title,
        c.heading,
        c.content,
        c.hash,
        vector(vectors[i]!),
      ]
    )
  }
  return { added: added.length, removed: stale.length }
}

async function syncIntents(intents: Intent[]) {
  const withHash = intents.map((it) => ({
    ...it,
    hash: hashOf(
      `${it.kind}\n${it.ref}\n${it.question}\n${it.answer ?? ""}\n${it.url ?? ""}`
    ),
  }))
  const existing = await sql<{ id: string; hash: string }>(
    "select id, hash from assistant.intents"
  )
  const have = new Set(existing.map((row) => row.hash))
  const want = new Set(withHash.map((it) => it.hash))

  const stale = existing
    .filter((row) => !want.has(row.hash))
    .map((row) => row.id)
  if (stale.length) {
    await sql("delete from assistant.intents where id = any($1::bigint[])", [
      stale,
    ])
  }
  const added = withHash.filter(
    (it, i) =>
      !have.has(it.hash) && withHash.findIndex((d) => d.hash === it.hash) === i
  )
  const vectors = await embedQuestions(added.map((it) => it.question))
  for (const [i, it] of added.entries()) {
    await sql(
      `insert into assistant.intents (kind, ref, question, answer, url, hash, embedding)
       values ($1, $2, $3, $4, $5, $6, $7)`,
      [
        it.kind,
        it.ref,
        it.question,
        it.answer,
        it.url,
        it.hash,
        vector(vectors[i]!),
      ]
    )
  }
  return { added: added.length, removed: stale.length }
}

export interface IngestReport {
  chunks: { added: number; removed: number; total: number }
  intents: { added: number; removed: number; total: number }
  ms: number
}

/**
 * Rebuilds the index. A source that fails to load (the CMS is down) keeps
 * its previous chunks rather than being wiped.
 */
export async function ingest(): Promise<IngestReport> {
  const started = Date.now()
  const [pages, faqs, topics, docs] = await Promise.allSettled([
    pageChunks(),
    faqData(),
    topicData(),
    documentChunks(),
  ])

  /** A source that couldn't be loaded keeps what it had. */
  const keep = (prefix: string) =>
    sql<Chunk>(
      "select source, url, title, heading, content from assistant.chunks where source like $1",
      [`${prefix}:%`]
    )

  const chunks: Chunk[] = [
    ...(pages.status === "fulfilled" ? pages.value : await keep("page")),
    ...(faqs.status === "fulfilled" ? faqs.value.chunks : await keep("faq")),
    ...(topics.status === "fulfilled"
      ? topics.value.chunks
      : await keep("topic")),
    ...(docs.status === "fulfilled" ? docs.value : await keep("doc")),
  ]
  for (const result of [pages, faqs, topics, docs]) {
    if (result.status === "rejected")
      console.error("[assistant] ingest:", result.reason)
  }

  const chunkReport = await syncChunks(chunks)
  const intentReport =
    faqs.status === "fulfilled" && topics.status === "fulfilled"
      ? await syncIntents([...faqs.value.intents, ...topics.value.intents])
      : { added: 0, removed: 0 }

  // Generated answers may quote what just changed.
  if (
    chunkReport.added ||
    chunkReport.removed ||
    intentReport.added ||
    intentReport.removed
  ) {
    await sql("delete from assistant.answer_cache")
  }

  const [totals] = await sql<{ chunks: number; intents: number }>(
    `select (select count(*) from assistant.chunks)::int as chunks,
            (select count(*) from assistant.intents)::int as intents`
  )

  return {
    chunks: { ...chunkReport, total: totals?.chunks ?? 0 },
    intents: { ...intentReport, total: totals?.intents ?? 0 },
    ms: Date.now() - started,
  }
}

const shared = globalThis as unknown as {
  assistantIngest?: {
    timer?: NodeJS.Timeout
    running?: Promise<unknown>
    again?: boolean
  }
}

/**
 * Re-indexes shortly after content changes. Publishing often comes in bursts
 * (an editor saving several entries), so calls within the delay collapse
 * into one run, and a change during a run queues exactly one more.
 */
export function scheduleIngest(delayMs = 15_000) {
  const state = (shared.assistantIngest ??= {})
  if (state.timer) clearTimeout(state.timer)
  state.timer = setTimeout(async () => {
    state.timer = undefined
    if (state.running) {
      state.again = true
      return
    }
    state.running = ingest()
      .then((report) => console.info("[assistant] index updated", report))
      .catch((error) =>
        console.error("[assistant] index update failed:", error)
      )
      .finally(() => {
        state.running = undefined
        if (state.again) {
          state.again = false
          scheduleIngest(1000)
        }
      })
  }, delayMs)
}
