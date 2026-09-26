import { CORE_SLUGS, LICENCE_SLUGS } from "@/content/pages"
import { getService } from "@/content/services"
import { ROUTES } from "@/content/site"

/**
 * Every page whose search and social settings the CMS can override ("Page
 * SEO"). Blog posts and research articles carry their own SEO section and are
 * not listed here.
 *
 * The CMS seed reads a copy of this list (apps/cms/scripts/site-pages.json);
 * tests/lib/site-pages.test.ts fails if the two drift apart.
 */
export interface SitePage {
  /** Name shown in the admin. */
  page: string
  path: string
}

const titled = (slug: string, prefix: string, path: string): SitePage => ({
  page: `${prefix}: ${getService(slug)?.title ?? slug}`,
  path,
})

export const SITE_PAGES: SitePage[] = [
  { page: "Home", path: ROUTES.home },
  { page: "Services", path: ROUTES.services },
  ...CORE_SLUGS.map((slug) => titled(slug, "Service", ROUTES.service(slug))),
  { page: "Licences", path: ROUTES.licences },
  ...LICENCE_SLUGS.map((slug) => titled(slug, "Licence", ROUTES.licence(slug))),
  { page: "India", path: ROUTES.india },
  { page: "About", path: ROUTES.about },
  { page: "Contact", path: ROUTES.contact },
  { page: "FAQs", path: ROUTES.faq },
  { page: "Blog (index)", path: ROUTES.blog },
  { page: "Research (index)", path: ROUTES.research },
]
