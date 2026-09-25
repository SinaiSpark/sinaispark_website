import type { MetadataRoute } from "next"

import { getPosts, getReports } from "@/lib/content-api"
import { isInsightsLink } from "@/lib/insights-links"
import { getPageSeo, getSiteSettings } from "@/lib/settings"
import { SITE } from "@/lib/site-config"
import { SITE_PAGES } from "@/lib/site-pages"

/**
 * Every route the site publishes, in priority order. Left out: research
 * while Insights is switched off, and any page an editor has marked
 * "noindex" in its SEO. The blog is always listed.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url.replace(/\/$/, "")
  const now = new Date()
  const { insightsEnabled } = await getSiteSettings()

  const entry = (path: string, lastModified = now) => ({
    url: `${base}${path}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: path === "/" ? 1 : path.split("/").length > 3 ? 0.6 : 0.8,
  })

  const noindex = async (path: string) =>
    /noindex|none/i.test((await getPageSeo(path))?.metaRobots ?? "")

  const pages = []
  for (const page of SITE_PAGES) {
    if (!insightsEnabled && isInsightsLink(page.path)) continue
    if (await noindex(page.path)) continue
    pages.push(entry(page.path))
  }

  // A sitemap without the articles beats no sitemap, so a CMS outage only
  // drops them from this copy. Research is listed only while Insights is on.
  const [posts, reports] = await Promise.all([
    getPosts().catch(() => []),
    insightsEnabled ? getReports().catch(() => []) : [],
  ])

  return [
    ...pages,
    ...reports.map((r) => entry(r.href, new Date(r.isoDate))),
    ...posts.map((p) => entry(p.href, new Date(p.isoDate))),
  ]
}
