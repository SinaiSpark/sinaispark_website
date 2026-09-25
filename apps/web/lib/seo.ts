import type { Metadata } from "next"

import { mediaUrl } from "@/lib/content-api"
import { getPageSeo, getSeoSettings, type SeoSettings } from "@/lib/settings"
import { SITE } from "@/lib/site-config"

/**
 * Turns the CMS's SEO fields (the `shared.seo` component from
 * @strapi-community/plugin-seo) into Next.js metadata, with the page's own
 * content as the fallback for anything left empty.
 */

export interface Seo {
  metaTitle?: string | null
  metaDescription?: string | null
  metaImage?: { url: string } | null
  openGraph?: {
    ogTitle?: string | null
    ogDescription?: string | null
    ogImage?: { url: string } | null
    ogUrl?: string | null
    ogType?: string | null
  } | null
  keywords?: string | null
  metaRobots?: string | null
  metaViewport?: string | null
  canonicalURL?: string | null
  structuredData?: unknown
}

export interface SeoFallback {
  title: string
  /** Use the title as-is, without the site-wide template (the home page). */
  absoluteTitle?: boolean
  description?: string
  path: string
  image?: string
  type?: "website" | "article"
  publishedTime?: string
}

/** Robots for the whole site: the SEO settings switch always wins. */
export function siteRobots(settings: SeoSettings): Metadata["robots"] {
  return settings.allowIndexing
    ? undefined
    : {
        index: false,
        follow: false,
        nocache: true,
        googleBot: { index: false, follow: false },
      }
}

/** "noindex, nofollow" → { index: false, follow: false } */
function parseRobots(value: string | null | undefined) {
  if (!value?.trim()) return undefined
  const flags = value
    .toLowerCase()
    .split(",")
    .map((f) => f.trim())
  return {
    index: !flags.includes("noindex") && !flags.includes("none"),
    follow: !flags.includes("nofollow") && !flags.includes("none"),
  }
}

export function toMetadata(
  seo: Seo | null,
  fallback: SeoFallback,
  settings: SeoSettings
): Metadata {
  const og = seo?.openGraph
  const description = seo?.metaDescription || fallback.description
  const image =
    mediaUrl(og?.ogImage?.url) ||
    mediaUrl(seo?.metaImage?.url) ||
    fallback.image ||
    mediaUrl(settings.defaultShareImage?.url) ||
    undefined
  const ogTitle = og?.ogTitle || seo?.metaTitle || fallback.title
  const ogDescription = og?.ogDescription || description

  return {
    // An editor's meta title is the whole title, as the SEO panel previews it.
    title: seo?.metaTitle
      ? { absolute: seo.metaTitle }
      : fallback.absoluteTitle
        ? { absolute: fallback.title }
        : fallback.title,
    description,
    keywords: seo?.keywords
      ?.split(",")
      .map((k) => k.trim())
      .filter(Boolean),
    alternates: { canonical: seo?.canonicalURL || fallback.path },
    robots: siteRobots(settings) ?? parseRobots(seo?.metaRobots),
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: og?.ogUrl || fallback.path,
      type: (og?.ogType as "website" | "article") || fallback.type || "website",
      siteName: settings.siteName,
      images: image ? [image] : undefined,
      ...(fallback.publishedTime
        ? { publishedTime: fallback.publishedTime }
        : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: ogTitle,
      description: ogDescription,
      images: image ? [image] : undefined,
      site: settings.twitterHandle
        ? `@${settings.twitterHandle.replace(/^@/, "")}`
        : undefined,
    },
  }
}

/** Metadata for one of the site's own pages, from its Page SEO entry. */
export async function pageMetadata(fallback: SeoFallback): Promise<Metadata> {
  const [seo, settings] = await Promise.all([
    getPageSeo(fallback.path),
    getSeoSettings(),
  ])
  return toMetadata(seo, fallback, settings)
}

/** Extra JSON-LD an editor pasted into a page's SEO → "Structured data". */
export async function pageStructuredData(path: string) {
  return (await getPageSeo(path))?.structuredData ?? null
}

/** The Organization block every page carries, from SEO settings. */
export function organizationJsonLd(settings: SeoSettings) {
  const profiles = (settings.organizationProfiles ?? "")
    .split(/\s+/)
    .filter((url) => /^https?:\/\//.test(url))
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.organizationLegalName || settings.siteName,
    url: SITE.url,
    logo: `${SITE.url}/brand/logo.svg`,
    ...(settings.organizationEmail
      ? { email: settings.organizationEmail }
      : {}),
    ...(settings.organizationPhone
      ? { telephone: settings.organizationPhone }
      : {}),
    ...(settings.organizationAddress
      ? { address: settings.organizationAddress }
      : {}),
    ...(profiles.length ? { sameAs: profiles } : {}),
  }
}
