import { cache } from "react"

import { cms } from "@/lib/cms"
import { mediaUrl } from "@/lib/content-api"

/**
 * FAQs, team, testimonials and contact details from the CMS, so the client
 * can edit them without a developer. The section copy around them (eyebrows,
 * headlines) stays in the content folder.
 *
 * Cached like the articles: one tag per type, refreshed by the CMS on
 * publish (see SITE_TAGS in apps/cms/src/lib/revalidate.ts), hourly as a
 * fallback. Errors throw for the same reason as lib/content-api.ts: a build
 * without the CMS fails instead of shipping empty sections, and at runtime
 * Next keeps serving the last good page.
 */

const HOUR = 60 * 60
const cached = (tag: string) => ({
  cache: "force-cache" as const,
  next: { tags: [tag], revalidate: HOUR },
})
const ORDERED = "sort[0]=order:asc&sort[1]=id:asc&pagination[pageSize]=200"

/** The FAQ page's headings, in page order. Must match the CMS enumeration. */
export const FAQ_CATEGORIES = [
  "General",
  "Company setup",
  "Licensing",
  "PRO & visas",
  "Compliance",
  "India",
] as const
export type FaqCategory = (typeof FAQ_CATEGORIES)[number]

export interface FaqItem {
  question: string
  answer: string
  category: FaqCategory
  /** Paths of the pages that repeat this question in their own FAQ. */
  pages: string[]
}

export const getFaqs = cache(async (): Promise<FaqItem[]> => {
  const res = await cms<{
    data: (Omit<FaqItem, "pages"> & { pages?: { path: string }[] })[]
  }>(
    `/faqs?${ORDERED}&fields[0]=question&fields[1]=answer&fields[2]=category&populate[pages][fields][0]=path`,
    cached("faqs")
  )
  return res.data.map((faq) => ({
    question: faq.question,
    answer: faq.answer,
    category: faq.category,
    pages: (faq.pages ?? []).map((page) => page.path),
  }))
})

/** The questions an editor chose to show on this page. */
export async function getFaqsFor(path: string) {
  return (await getFaqs()).filter((faq) => faq.pages.includes(path))
}

export interface TeamMember {
  /** Null until the client confirms the name; the card says so. */
  name: string | null
  role: string
  bio: string
  /** Null until a portrait is uploaded; the card falls back to the mark. */
  photo: string | null
  linkedin: string | null
}

export const getTeam = cache(async (): Promise<TeamMember[]> => {
  const res = await cms<{
    data: (Omit<TeamMember, "photo"> & { photo?: { url: string } | null })[]
  }>(
    `/team-members?${ORDERED}&fields[0]=name&fields[1]=role&fields[2]=bio&fields[3]=linkedin&populate[photo][fields][0]=url`,
    cached("team")
  )
  return res.data.map((member) => ({
    name: member.name || null,
    role: member.role,
    bio: member.bio,
    photo: member.photo?.url ? mediaUrl(member.photo.url) : null,
    linkedin: member.linkedin || null,
  }))
})

export interface Testimonial {
  quote: string
  name: string
  /** Whole stars, 1 to 5. */
  rating: number
  /** Role and company, or "Google review" for an imported one without. */
  byline: string
  market: string | null
  /** Month and year, e.g. "May 2026"; null when no date is set. */
  date: string | null
  /** Where clicking the card goes: the review on Google, for imported ones. */
  url: string | null
}

type RawTestimonial = {
  quote?: string | null
  name: string
  rating?: number | null
  role?: string | null
  market?: string | null
  source?: "Google" | "Manual" | null
  reviewUrl?: string | null
  reviewDate?: string | null
}

const monthYear = (iso: string | null | undefined) => {
  const date = new Date(`${iso}T00:00:00Z`)
  if (!iso || Number.isNaN(date.getTime())) return null
  return new Intl.DateTimeFormat("en-GB", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date)
}

/** Published testimonials with text; a star-only review has nothing to show. */
export const getTestimonials = cache(async (): Promise<Testimonial[]> => {
  const fields = [
    "quote",
    "name",
    "rating",
    "role",
    "market",
    "source",
    "reviewUrl",
    "reviewDate",
  ]
  const res = await cms<{ data: RawTestimonial[] }>(
    `/testimonials?${ORDERED}&${fields.map((f, i) => `fields[${i}]=${f}`).join("&")}`,
    cached("testimonials")
  )
  return res.data.flatMap((raw) => {
    const quote = raw.quote?.trim()
    if (!quote) return []
    return [
      {
        quote,
        name: raw.name,
        rating: Math.min(5, Math.max(1, Math.round(raw.rating ?? 5))),
        byline: raw.role || (raw.source === "Google" ? "Google review" : ""),
        market: raw.market || null,
        date: monthYear(raw.reviewDate),
        url: /^https:\/\//.test(raw.reviewUrl ?? "") ? raw.reviewUrl! : null,
      },
    ]
  })
})

export interface Office {
  city: string
  kicker: string
  description: string
  address: string
  timeZone: string
  /** The uploaded photo, or null to use the site's own for that city. */
  photo: string | null
}

export interface ContactDetails {
  email: string
  phone: string | null
  /** A wa.me link, or null when no WhatsApp number is set. */
  whatsapp: string | null
  socials: { label: "LinkedIn" | "Instagram" | "YouTube"; href: string }[]
  offices: Office[]
  /** The details are still placeholders; the contact page says so. */
  placeholder: boolean
}

type RawContact = {
  email: string
  phone?: string | null
  whatsapp?: string | null
  linkedin?: string | null
  instagram?: string | null
  youtube?: string | null
  placeholder?: boolean | null
  offices?: (Omit<Office, "photo" | "kicker" | "description"> & {
    kicker?: string | null
    description?: string | null
    photo?: { url: string } | null
  })[]
}

export const getContactDetails = cache(async (): Promise<ContactDetails> => {
  const res = await cms<{ data: RawContact | null }>(
    "/contact-detail?populate[offices][populate][photo][fields][0]=url",
    cached("contact")
  )
  if (!res.data) throw new Error("Contact details are missing in the CMS")
  const raw = res.data
  const digits = raw.whatsapp?.replace(/\D/g, "")

  return {
    email: raw.email,
    phone: raw.phone || null,
    whatsapp: digits ? `https://wa.me/${digits}` : null,
    socials: (
      [
        ["LinkedIn", raw.linkedin],
        ["Instagram", raw.instagram],
        ["YouTube", raw.youtube],
      ] as const
    ).flatMap(([label, href]) => (href ? [{ label, href }] : [])),
    offices: (raw.offices ?? []).map((office) => ({
      city: office.city,
      kicker: office.kicker ?? "",
      description: office.description ?? "",
      address: office.address,
      timeZone: office.timeZone,
      photo: office.photo?.url ? mediaUrl(office.photo.url) : null,
    })),
    placeholder: raw.placeholder !== false,
  }
})
