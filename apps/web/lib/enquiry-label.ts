import { DIRECT_SOURCE } from "@/lib/enquiry-source"
import { SITE_PAGES } from "@/lib/site-pages"

/**
 * The "Came from" value stored on an enquiry: the page's admin name and its
 * path, e.g. "Service: Business Setup in Saudi Arabia (/services/…/)".
 * Server only: SITE_PAGES pulls in every service page's copy.
 */
export function sourceLabel(path: string | null | undefined) {
  if (!path || !path.startsWith("/")) return DIRECT_SOURCE
  const page = SITE_PAGES.find((p) => p.path === path)?.page
  const article = path.match(/^\/(blog|research)\/([^/]+)\/?$/)
  const name =
    page ??
    (article
      ? `${article[1] === "blog" ? "Blog" : "Research"}: ${article[2]}`
      : null)
  return (name ? `${name} (${path})` : path).slice(0, 200)
}
