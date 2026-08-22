import type { ImageKey } from "@/lib/images"

/**
 * Research landing page content (revised doc §8) — a dedicated home for
 * original research and reports, visually distinct from the Blog.
 * PENDING_CLIENT_DATA: no reports exist yet; the page ships with an honest
 * empty state until the first publication lands.
 */

export interface Report {
  slug: string
  title: string
  summary: string
  market: "Saudi Arabia" | "UAE" | "UK" | "India" | "Bahrain"
  topic: "Licensing" | "Compliance" | "Taxation" | "Visas" | "Market Entry"
  date: string
  readTime: string
  /** Gated reports require an email before download (tooling TBD, plan §9). */
  gated: boolean
  imageKey?: ImageKey
}

/** Placeholder catalog — replaced when real publications arrive. */
export const REPORTS: Report[] = [
  {
    slug: "saudi-market-entry-2026",
    title: "Saudi Market Entry Report 2026",
    summary:
      "Annual analysis of licensing volumes, MISA registrations and sector trends across the Kingdom's three economic centers.",
    market: "Saudi Arabia",
    topic: "Market Entry",
    date: "2026-07-15",
    readTime: "18 min read",
    gated: true,
    imageKey: "homeHero",
  },
]

export const MARKETS = [
  "Saudi Arabia",
  "UAE",
  "UK",
  "India",
  "Bahrain",
] as const
export const TOPICS = [
  "Licensing",
  "Compliance",
  "Taxation",
  "Visas",
  "Market Entry",
] as const
