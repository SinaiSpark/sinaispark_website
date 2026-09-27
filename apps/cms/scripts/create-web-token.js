/**
 * Creates the "Website" API token the Next.js site uses, scoped to exactly
 * what the site does: read blog, research, events, settings, page SEO, FAQs, team,
 * testimonials, contact details, the home page stats and the assistant's
 * menu, settings and documents, create enquiries (and the assistant's) and
 * add emails to the list. Prints the key once; put it in the site's env
 * as CMS_API_TOKEN.
 *
 *   pnpm --filter cms token:web            # create, or update an existing
 *                                          # token's permissions (same key)
 *   pnpm --filter cms token:web --rotate   # replace it with a new key
 */
const { createStrapi, compileStrapi } = require("@strapi/strapi")

const NAME = "Website"
const PERMISSIONS = [
  "api::blog-post.blog-post.find",
  "api::blog-post.blog-post.findOne",
  "api::research-article.research-article.find",
  "api::research-article.research-article.findOne",
  "api::event.event.find",
  "api::event.event.findOne",
  "api::site-setting.site-setting.find",
  "api::seo-setting.seo-setting.find",
  "api::page-seo.page-seo.find",
  "api::page-seo.page-seo.findOne",
  "api::faq.faq.find",
  "api::team-member.team-member.find",
  "api::testimonial.testimonial.find",
  "api::contact-detail.contact-detail.find",
  "api::home-page.home-page.find",
  "api::enquiry.enquiry.create",
  "api::enquiry.enquiry.chat",
  "api::assistant-topic.assistant-topic.find",
  "api::assistant-setting.assistant-setting.find",
  "api::knowledge-document.knowledge-document.find",
  "api::subscriber.subscriber.subscribe",
  "plugin::upload.content-api.find",
  "plugin::upload.content-api.findOne",
]

async function main() {
  const app = await createStrapi(await compileStrapi()).load()
  app.log.level = "error"
  const tokens = app.service("admin::api-token")

  const existing = await tokens.getByName(NAME)
  if (existing && !process.argv.includes("--rotate")) {
    // New content types need new permissions; the key stays the same.
    await tokens.update(existing.id, { permissions: PERMISSIONS })
    console.log(`"${NAME}" token permissions updated; the key is unchanged.`)
  } else {
    if (existing) await tokens.revoke(existing.id)
    const token = await tokens.create({
      name: NAME,
      description: "Next.js site: reads content, submits forms.",
      type: "custom",
      lifespan: null,
      permissions: PERMISSIONS,
    })
    console.log(`\nCMS_API_TOKEN=${token.accessKey}\n`)
  }

  await app.destroy()
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
