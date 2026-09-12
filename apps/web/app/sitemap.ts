import type { MetadataRoute } from "next"

import { CORE_SLUGS, LICENCE_SLUGS } from "@/content/pages"
import { ROUTES } from "@/content/site"
import { SITE } from "@/lib/site-config"

/** Every route the site actually publishes, in priority order. */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url.replace(/\/$/, "")
  const now = new Date()

  const entry = (path: string, priority: number) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority,
  })

  return [
    entry(ROUTES.home, 1),
    entry(ROUTES.services, 0.9),
    entry(ROUTES.licences, 0.9),
    entry(ROUTES.india, 0.9),
    ...CORE_SLUGS.map((slug) => entry(ROUTES.service(slug), 0.8)),
    ...LICENCE_SLUGS.map((slug) => entry(ROUTES.licence(slug), 0.8)),
  ]
}
