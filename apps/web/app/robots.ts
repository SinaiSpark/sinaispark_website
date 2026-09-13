import type { MetadataRoute } from "next"

/**
 * Closed to crawlers while the site is pre-launch.
 *
 * The sitemap is deliberately not advertised here — pointing crawlers at a
 * list of URLs they are told not to fetch only invites them to index the URLs
 * without ever seeing the pages. `app/sitemap.ts` still builds, so this is one
 * edit to undo at launch, alongside the `robots` block in `app/layout.tsx`.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: "/",
    },
  }
}
