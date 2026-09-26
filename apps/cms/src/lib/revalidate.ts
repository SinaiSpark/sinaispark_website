import type { Core } from "@strapi/strapi"

/**
 * Content types the website renders, and the Next.js cache tag each one feeds.
 * The site tags its fetches with these names (apps/web/lib/content-api.ts,
 * apps/web/lib/settings.ts and apps/web/lib/site-content.ts).
 */
export const SITE_TAGS: Record<string, string> = {
  "api::blog-post.blog-post": "blog",
  "api::research-article.research-article": "research",
  "api::site-setting.site-setting": "settings",
  "api::seo-setting.seo-setting": "seo",
  "api::page-seo.page-seo": "seo",
  "api::faq.faq": "faqs",
  "api::team-member.team-member": "team",
  "api::testimonial.testimonial": "testimonials",
  "api::contact-detail.contact-detail": "contact",
  "api::home-page.home-page": "home",
}

/**
 * Tags whose old pages must not be served even once more. Switching Insights
 * off should hide it for the very next visitor, not the one after.
 */
const IMMEDIATE = new Set(["settings"])

/** Actions that change the live site, with and without draft & publish. */
const PUBLISHED_ACTIONS = new Set(["publish", "unpublish", "delete"])
const SAVED_ACTIONS = new Set(["create", "update", "delete"])

/**
 * Tells the Next.js site to refresh the pages built from `tag`. Fire and
 * forget: a site that is down or slow must never block an editor's save.
 */
export function notifySite(strapi: Core.Strapi, tag: string) {
  const url = process.env.WEB_REVALIDATE_URL
  const secret = process.env.WEB_REVALIDATE_SECRET
  if (!url || !secret) return

  fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-revalidate-secret": secret,
    },
    body: JSON.stringify({ tags: [tag], now: IMMEDIATE.has(tag) }),
    signal: AbortSignal.timeout(5000),
  })
    .then((res) => {
      if (!res.ok)
        strapi.log.warn(`Site refresh for "${tag}" returned ${res.status}`)
    })
    .catch((error: Error) => {
      strapi.log.warn(`Site refresh for "${tag}" failed: ${error.message}`)
    })
}

/**
 * Document Service middleware: refresh the site whenever something it shows
 * changes. With draft & publish that is publishing, unpublishing or deleting
 * (saving a draft changes nothing live); without it, every save.
 */
export function registerSiteRefresh(strapi: Core.Strapi) {
  strapi.documents.use(async (context, next) => {
    const result = await next()
    const tag = SITE_TAGS[context.uid]
    if (tag) {
      const drafts = strapi.contentType(context.uid)?.options?.draftAndPublish
      const live = drafts ? PUBLISHED_ACTIONS : SAVED_ACTIONS
      if (live.has(context.action)) notifySite(strapi, tag)
    }
    return result
  })
}
