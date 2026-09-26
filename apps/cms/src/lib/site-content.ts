import path from "node:path"
import type { Core } from "@strapi/strapi"

interface SeedFaq {
  question: string
  answer: string
  category: string
  order: number
  /** Page SEO paths the question also shows on. */
  pages: string[]
}

interface SeedContent {
  faqs: SeedFaq[]
  team: Record<string, unknown>[]
  home: Record<string, unknown>
  contact: Record<string, unknown>
}

/**
 * Fills FAQs, team members, the home page stats and contact details with the
 * copy the website
 * shipped with (scripts/site-content.json), so editors start from the
 * current text instead of an empty list. Testimonials come from the Google
 * import below instead.
 *
 * Each type is seeded once, ever: a flag in the store records it, so an
 * editor who deletes every FAQ doesn't get them back on restart.
 * Runs after ensureSiteDefaults, which creates the Page SEO entries the
 * FAQs point at.
 */
export async function seedSiteContent(strapi: Core.Strapi) {
  const store = strapi.store({ type: "core", name: "sinaispark" })
  const seed: SeedContent = require(
    path.join(strapi.dirs.app.root, "scripts", "site-content.json")
  )

  const once = async (uid: string, fill: () => Promise<void>) => {
    const key = `seeded:${uid}`
    if (await store.get({ key })) return
    const docs = strapi.documents(uid as never)
    if (!(await docs.findFirst())) await fill()
    await store.set({ key, value: true })
  }

  await once("api::faq.faq", async () => {
    const pages = await strapi
      .documents("api::page-seo.page-seo")
      .findMany({ fields: ["path"], limit: 1000 })
    const byPath = new Map(pages.map((page) => [page.path, page.documentId]))

    for (const { pages: paths, ...faq } of seed.faqs) {
      await strapi.documents("api::faq.faq").create({
        data: {
          ...faq,
          pages: paths.flatMap((p) => byPath.get(p) ?? []),
        } as never,
        status: "published",
      })
    }
  })

  await once("api::team-member.team-member", async () => {
    for (const member of seed.team) {
      await strapi
        .documents("api::team-member.team-member")
        .create({ data: member as never, status: "published" })
    }
  })

  await once("api::home-page.home-page", async () => {
    await strapi
      .documents("api::home-page.home-page")
      .create({ data: seed.home as never })
  })

  await once("api::contact-detail.contact-detail", async () => {
    await strapi
      .documents("api::contact-detail.contact-detail")
      .create({ data: seed.contact as never })
  })
}

interface GoogleReview {
  googleReviewId: string
  name: string
  rating: number
  quote: string
  reviewDate: string
  reviewUrl: string
  order: number
}

/**
 * Imports the Google reviews collected in scripts/google-reviews.json as
 * draft testimonials, for editors to pick from and publish. Runs once (a
 * store flag), and skips any review already present by its Google ID, so
 * it never duplicates or brings back one an editor deleted after the
 * import. Testimonials written before these fields existed get a rating
 * and a source.
 */
export async function importGoogleReviews(strapi: Core.Strapi) {
  const store = strapi.store({ type: "core", name: "sinaispark" })
  const key = "imported:google-reviews"
  if (await store.get({ key })) return

  await strapi.db
    .query("api::testimonial.testimonial")
    .updateMany({ where: { rating: null }, data: { rating: 5 } })
  await strapi.db
    .query("api::testimonial.testimonial")
    .updateMany({ where: { source: null }, data: { source: "Manual" } })

  const { reviews }: { reviews: GoogleReview[] } = require(
    path.join(strapi.dirs.app.root, "scripts", "google-reviews.json")
  )
  const docs = strapi.documents("api::testimonial.testimonial")
  const existing = new Set(
    (
      await docs.findMany({
        fields: ["googleReviewId"],
        status: "draft",
        limit: 1000,
      })
    ).map((doc) => doc.googleReviewId)
  )

  let added = 0
  for (const review of reviews) {
    if (existing.has(review.googleReviewId)) continue
    await docs.create({ data: { ...review, source: "Google" } as never })
    added++
  }
  strapi.log.info(`Imported ${added} Google reviews as draft testimonials`)
  await store.set({ key, value: true })
}
