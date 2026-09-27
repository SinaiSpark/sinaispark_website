import type { PostFormat } from "@/content/blog"
import type { EventRole } from "@/content/events"
import type { Market, Topic } from "@/content/research"
import { ROUTES } from "@/content/site"
import { cms, CmsError } from "@/lib/cms"
import { formatEventDates, isUpcoming, todayIso } from "@/lib/event-dates"
import type { Seo } from "@/lib/seo"
import { SEO_POPULATE } from "@/lib/settings"

/**
 * Blog posts, research articles and events from the CMS, shaped for the site.
 *
 * Every fetch is cached under a tag the CMS refreshes on publish ("blog",
 * "research", "events"; see app/api/revalidate), with an hourly fallback in case a
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
function featuredFirst<T extends { featured: boolean }>(items: T[]) {
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

/* ============ EVENTS ============ */

export interface EventMedia {
  kind: "image" | "video"
  src: string
  alt: string
  caption: string
  width: number | null
  height: number | null
}

export interface EventVideoLink {
  title: string
  url: string
}

export interface EventItem {
  id: string
  slug: string
  href: string
  title: string
  summary: string
  image: string
  imageAlt: string
  role: EventRole
  format: string
  market: string
  city: string
  venue: string
  /** yyyy-mm-dd; the end date is empty for a one-day event. */
  isoDate: string
  isoEnd: string
  /** The dates as printed, e.g. "12–14 Mar 2026". */
  date: string
  featured: boolean
  upcoming: boolean
  registrationUrl: string
  /** Photos and uploaded clips, in the editor's order. */
  gallery: EventMedia[]
  /** YouTube or Vimeo links. */
  videos: EventVideoLink[]
  photoCount: number
  videoCount: number
}

export interface EventDetail extends EventItem, Article {
  highlights: { value: number; suffix: string; label: string }[]
}

type RawMedia = StrapiMedia & {
  mime?: string | null
  caption?: string | null
}

const GALLERY =
  "populate[gallery][fields][0]=url&populate[gallery][fields][1]=alternativeText&populate[gallery][fields][2]=caption&populate[gallery][fields][3]=mime&populate[gallery][fields][4]=width&populate[gallery][fields][5]=height"

const EVENT_FIELDS = [
  "documentId",
  "slug",
  "title",
  "summary",
  "role",
  "format",
  "market",
  "city",
  "venue",
  "startDate",
  "endDate",
  "featured",
  "registrationUrl",
]

const toMedia = (raw: RawMedia): EventMedia => ({
  kind: raw.mime?.startsWith("video/") ? "video" : "image",
  src: mediaUrl(raw.url),
  alt: raw.alternativeText ?? "",
  caption: raw.caption ?? "",
  width: raw.width ?? null,
  height: raw.height ?? null,
})

function toEvent(raw: Raw, today: string): EventItem {
  const gallery = ((raw.gallery as RawMedia[] | null) ?? [])
    .filter((item) => item?.url)
    .map(toMedia)
  const videos = ((raw.videos as EventVideoLink[] | null) ?? []).filter(
    (video) => video?.url
  )
  const start = (raw.startDate as string | null) ?? ""
  const end = (raw.endDate as string | null) ?? ""
  const uploadedClips = gallery.filter((item) => item.kind === "video").length

  return {
    id: raw.documentId,
    slug: raw.slug,
    href: ROUTES.event(raw.slug),
    title: raw.title || "Untitled draft",
    summary: (raw.summary as string | null) ?? "",
    image: mediaUrl(raw.cover?.url),
    imageAlt: raw.cover?.alternativeText ?? "",
    role: ((raw.role as EventRole | null) ?? "Attended") as EventRole,
    format: (raw.format as string | null) ?? "",
    market: (raw.market as string | null) ?? "",
    city: (raw.city as string | null) ?? "",
    venue: (raw.venue as string | null) ?? "",
    isoDate: start,
    isoEnd: end,
    date: formatEventDates(start, end),
    featured: Boolean(raw.featured),
    upcoming: isUpcoming(start, end, today),
    registrationUrl: (raw.registrationUrl as string | null) ?? "",
    gallery,
    videos,
    photoCount: gallery.length - uploadedClips,
    videoCount: uploadedClips + videos.length,
  }
}

/**
 * Every published event, newest first. The one marked featured (or the
 * newest past event) leads; upcoming events are split out by the page.
 */
/**
 * A 404 on the whole collection means the CMS has no Event type yet (it is
 * older than this page). Treat that as "no events" so the page shows its
 * empty state; any other failure still throws, like the blog.
 */
const noEventsYet = (error: unknown) => {
  if (error instanceof CmsError && error.status === 404) return { data: [] }
  throw error
}

export async function getEvents(): Promise<EventItem[]> {
  const res = await cms<{ data: Raw[] }>(
    `/events?sort[0]=startDate:desc&sort[1]=id:desc&pagination[pageSize]=100&${LIST_FIELDS(EVENT_FIELDS)}&${COVER}&${GALLERY}&populate[videos]=true`,
    { cache: "force-cache", next: { tags: ["events"], revalidate: HOUR } }
  ).catch(noEventsYet)
  const today = todayIso()
  return featuredFirst(res.data.map((raw) => toEvent(raw, today)))
}

export async function getEvent(
  slug: string,
  { draft = false } = {}
): Promise<EventDetail | null> {
  const res = await cms<{ data: Raw[] }>(
    `/events?filters[slug][$eq]=${encodeURIComponent(slug)}&pagination[pageSize]=1&${COVER}&${GALLERY}&populate[videos]=true&populate[highlights]=true&${SEO_POPULATE}${draft ? "&status=draft" : ""}`,
    draft
      ? { cache: "no-store" }
      : { cache: "force-cache", next: { tags: ["events"], revalidate: HOUR } }
  ).catch(noEventsYet)
  const raw = res.data[0]
  if (!raw) return null
  return {
    ...toEvent(raw, todayIso()),
    body: (raw.body as string | null) ?? "",
    seo: (raw.seo as Seo) ?? null,
    highlights: (
      (raw.highlights as EventDetail["highlights"] | null) ?? []
    ).map((h) => ({ value: h.value, suffix: h.suffix ?? "", label: h.label })),
  }
}
