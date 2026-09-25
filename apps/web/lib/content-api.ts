import type { PostFormat } from "@/content/blog"
import type { Market, Topic } from "@/content/research"
import { ROUTES } from "@/content/site"
import { cms } from "@/lib/cms"
import type { Seo } from "@/lib/seo"
import { SEO_POPULATE } from "@/lib/settings"

/**
 * Blog posts and research articles from the CMS, shaped for the site.
 *
 * Every fetch is cached under a tag the CMS refreshes on publish ("blog",
 * "research"; see app/api/revalidate), with an hourly fallback in case a
 * refresh is ever missed. Errors are thrown, not swallowed: at build time
 * that stops an empty blog from shipping, and at runtime Next keeps serving
 * the last good page.
 *
 * In preview (Next.js draft mode) the single-article fetches ask for the
 * draft and skip the cache, so editors see exactly what they just saved.
 */

interface StrapiMedia {
  url: string
  alternativeText?: string | null
  width?: number
  height?: number
}

interface Common {
  id: string
  slug: string
  href: string
  title: string
  image: string
  imageAlt: string
  /** Date as the cards print it. */
  date: string
  /** yyyy-mm-dd, for <time> and sorting. */
  isoDate: string
  readTime: string
  readMinutes: number
  featured: boolean
}

export interface Post extends Common {
  format: PostFormat
  market: string
  excerpt: string
}

export interface Report extends Common {
  market: Market
  topic: Topic
  summary: string
  gated: boolean
}

export interface Article {
  /** Editor HTML, not yet cleaned: render it through lib/article-html.ts. */
  body: string
  seo: Seo | null
}

export type PostDetail = Post & Article
export type ReportDetail = Report & Article & { previewBlocks: number }

const HOUR = 60 * 60
const COVER =
  "populate[cover][fields][0]=url&populate[cover][fields][1]=alternativeText"

/** Media URLs are relative on the local upload provider, absolute on R2. */
export function mediaUrl(url: string | undefined | null) {
  if (!url) return ""
  if (/^https?:\/\//.test(url)) return url
  const base = process.env.CMS_PUBLIC_URL ?? process.env.CMS_URL ?? ""
  return `${base.replace(/\/$/, "")}${url}`
}

/**
 * A draft can be saved with required fields still empty, and previews show
 * drafts, so every field below has a fallback instead of throwing.
 */
const formatDate = (iso: string | null | undefined, withDay: boolean) => {
  const date = new Date(`${iso}T00:00:00Z`)
  if (!iso || Number.isNaN(date.getTime())) return "No date yet"
  return new Intl.DateTimeFormat("en-GB", {
    day: withDay ? "numeric" : undefined,
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date)
}

type Raw = Record<string, unknown> & {
  documentId: string
  slug: string
  title: string
  date: string
  readMinutes: number
  featured?: boolean | null
  cover?: StrapiMedia | null
}

const common = (raw: Raw, href: string, withDay: boolean): Common => ({
  id: raw.documentId,
  slug: raw.slug,
  href,
  title: raw.title || "Untitled draft",
  image: mediaUrl(raw.cover?.url),
  imageAlt: raw.cover?.alternativeText ?? "",
  date: formatDate(raw.date, withDay),
  isoDate: raw.date ?? "",
  readTime: raw.readMinutes ? `${raw.readMinutes} min` : "–",
  readMinutes: raw.readMinutes ?? 0,
  featured: Boolean(raw.featured),
})

const toPost = (raw: Raw): Post => ({
  ...common(raw, ROUTES.blogPost(raw.slug), true),
  format: raw.format as PostFormat,
  market: raw.market as string,
  excerpt: (raw.excerpt as string | null) ?? "",
})

const toReport = (raw: Raw): Report => ({
  ...common(raw, ROUTES.researchArticle(raw.slug), false),
  market: raw.market as Market,
  topic: raw.topic as Topic,
  summary: (raw.summary as string | null) ?? "",
  gated: Boolean(raw.emailGate),
})

const LIST_FIELDS = (fields: string[]) =>
  fields.map((field, i) => `fields[${i}]=${field}`).join("&")

async function list(path: string, tag: string, fields: string[]) {
  const res = await cms<{ data: Raw[] }>(
    `${path}?sort[0]=date:desc&sort[1]=id:desc&pagination[pageSize]=100&${LIST_FIELDS(fields)}&${COVER}`,
    { cache: "force-cache", next: { tags: [tag], revalidate: HOUR } }
  )
  return res.data
}

async function one(path: string, tag: string, slug: string, draft: boolean) {
  const res = await cms<{ data: Raw[] }>(
    `${path}?filters[slug][$eq]=${encodeURIComponent(slug)}&pagination[pageSize]=1&${COVER}&${SEO_POPULATE}${draft ? "&status=draft" : ""}`,
    draft
      ? { cache: "no-store" }
      : { cache: "force-cache", next: { tags: [tag], revalidate: HOUR } }
  )
  return res.data[0] ?? null
}

const BASE_FIELDS = [
  "documentId",
  "slug",
  "title",
  "date",
  "readMinutes",
  "featured",
]

/** Newest first, with the one marked featured (or the newest) leading. */
function featuredFirst<T extends Common>(items: T[]) {
  const i = items.findIndex((item) => item.featured)
  if (i <= 0) return items
  return [items[i]!, ...items.slice(0, i), ...items.slice(i + 1)]
}

export async function getPosts(): Promise<Post[]> {
  const raw = await list("/blog-posts", "blog", [
    ...BASE_FIELDS,
    "format",
    "market",
    "excerpt",
  ])
  return featuredFirst(raw.map(toPost))
}

export async function getPost(
  slug: string,
  { draft = false } = {}
): Promise<PostDetail | null> {
  const raw = await one("/blog-posts", "blog", slug, draft)
  if (!raw) return null
  return {
    ...toPost(raw),
    body: (raw.body as string | null) ?? "",
    seo: (raw.seo as Seo) ?? null,
  }
}

export async function getReports(): Promise<Report[]> {
  const raw = await list("/research-articles", "research", [
    ...BASE_FIELDS,
    "market",
    "topic",
    "summary",
    "emailGate",
  ])
  return featuredFirst(raw.map(toReport))
}

export async function getReport(
  slug: string,
  { draft = false } = {}
): Promise<ReportDetail | null> {
  const raw = await one("/research-articles", "research", slug, draft)
  if (!raw) return null
  return {
    ...toReport(raw),
    body: (raw.body as string | null) ?? "",
    seo: (raw.seo as Seo) ?? null,
    previewBlocks: (raw.previewBlocks as number | null) ?? 3,
  }
}
