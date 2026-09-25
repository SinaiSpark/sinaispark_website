/**
 * Creates the "Website" API token the Next.js site uses, scoped to exactly
 * what the site does: read blog, research, settings and page SEO, create
 * enquiries and add emails to the list. Prints the key once; put it in the
 * site's env as CMS_API_TOKEN.
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
  "api::site-setting.site-setting.find",
  "api::seo-setting.seo-setting.find",
  "api::page-seo.page-seo.find",
  "api::page-seo.page-seo.findOne",
  "api::enquiry.enquiry.create",
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
