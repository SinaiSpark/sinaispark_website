import type { MetadataRoute } from "next"

import { getSeoSettings } from "@/lib/settings"
import { SITE } from "@/lib/site-config"

/**
 * robots.txt, from the CMS's SEO settings.
 *
 * Pre-launch ("Allow indexing" off) crawlers are refused everywhere and the
 * sitemap is not advertised: pointing crawlers at URLs they are told not to
 * fetch only invites them to index the bare addresses. At launch an admin
 * switches indexing on; the paths in "Robots disallow" (one per line) stay
 * blocked after that.
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const seo = await getSeoSettings()
  if (!seo.allowIndexing) {
    return { rules: { userAgent: "*", disallow: "/" } }
  }

  const disallow = (seo.robotsDisallow ?? "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("/"))

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", ...disallow],
    },
    sitemap: `${SITE.url.replace(/\/$/, "")}/sitemap.xml`,
  }
}
