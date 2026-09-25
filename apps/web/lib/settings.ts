import { cache } from "react"

import { cms } from "@/lib/cms"
import type { Seo } from "@/lib/seo"

/**
 * Site-wide settings from the CMS: the feature switches ("Site settings"),
 * the SEO defaults ("SEO settings") and each page's own SEO ("Page SEO").
 *
 * Unlike articles, these never throw. Every page needs them, so a CMS outage
 * falls back to safe defaults (Insights hidden, default SEO) instead of
 * taking the whole site down; the hourly refresh restores the real values.
 */

const HOUR = 60 * 60

export interface SiteSettings {
  /** Research, and every link to it. Off until an admin enables it. The blog is always public. */
  insightsEnabled: boolean
}

export interface SeoSettings {
  siteName: string
  titleTemplate: string
  defaultDescription: string | null
  defaultShareImage: { url: string } | null
  allowIndexing: boolean
  robotsDisallow: string | null
  googleSiteVerification: string | null
  bingSiteVerification: string | null
  twitterHandle: string | null
  organizationLegalName: string | null
  organizationEmail: string | null
  organizationPhone: string | null
  organizationAddress: string | null
  organizationProfiles: string | null
}

const SITE_DEFAULTS: SiteSettings = { insightsEnabled: false }

export const SEO_DEFAULTS: SeoSettings = {
  siteName: "Sinai Spark Global",
  titleTemplate: "%s | Sinai Spark Global",
  defaultDescription: null,
  defaultShareImage: null,
  // Fail closed: an outage must never open a pre-launch site to search engines.
  allowIndexing: false,
  robotsDisallow: null,
  googleSiteVerification: null,
  bingSiteVerification: null,
  twitterHandle: null,
  organizationLegalName: null,
  organizationEmail: null,
  organizationPhone: null,
  organizationAddress: null,
  organizationProfiles: null,
}

const cached = (tag: string) => ({
  cache: "force-cache" as const,
  next: { tags: [tag], revalidate: HOUR },
})

async function orDefault<T>(load: () => Promise<T>, fallback: T, what: string) {
  try {
    return (await load()) ?? fallback
  } catch (error) {
    console.error(`[settings] ${what} unavailable, using defaults:`, error)
    return fallback
  }
}

export const getSiteSettings = cache(() =>
  orDefault(
    async () => {
      const res = await cms<{ data: Partial<SiteSettings> | null }>(
        "/site-setting?fields[0]=insightsEnabled",
        cached("settings")
      )
      return { ...SITE_DEFAULTS, ...res.data }
    },
    SITE_DEFAULTS,
    "site settings"
  )
)

export const getSeoSettings = cache(() =>
  orDefault(
    async () => {
      const res = await cms<{ data: Partial<SeoSettings> | null }>(
        "/seo-setting?populate[defaultShareImage][fields][0]=url",
        cached("seo")
      )
      return { ...SEO_DEFAULTS, ...res.data } as SeoSettings
    },
    SEO_DEFAULTS,
    "SEO settings"
  )
)

const SEO_POPULATE =
  "populate[seo][populate][metaImage][fields][0]=url" +
  "&populate[seo][populate][openGraph][populate][ogImage][fields][0]=url"

/** Every Page SEO entry, fetched once and shared by all pages. */
const getAllPageSeo = cache(() =>
  orDefault(
    async () => {
      const res = await cms<{ data: { path: string; seo: Seo | null }[] }>(
        `/page-seos?pagination[pageSize]=200&fields[0]=path&${SEO_POPULATE}`,
        cached("seo")
      )
      return new Map(res.data.map((entry) => [entry.path, entry.seo]))
    },
    new Map<string, Seo | null>(),
    "page SEO"
  )
)

export async function getPageSeo(path: string) {
  return (await getAllPageSeo()).get(path) ?? null
}

export { SEO_POPULATE }
