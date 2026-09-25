import type { Core } from "@strapi/strapi"

/** Content types whose `slug` is derived from `title`. */
const SLUGGED = new Set([
  "api::blog-post.blog-post",
  "api::research-article.research-article",
])

/**
 * The admin fills a slug in as the editor types the title, but documents
 * created any other way (imports, scripts) arrive without one and could never
 * be published. Fill it in from the title, unique within the content type.
 */
export function registerSlugFill(strapi: Core.Strapi) {
  strapi.documents.use(async (context, next) => {
    if (
      SLUGGED.has(context.uid) &&
      (context.action === "create" || context.action === "update")
    ) {
      const params = context.params as { data?: Record<string, unknown> }
      const data = params.data
      if (data && typeof data.title === "string" && !data.slug) {
        data.slug = await strapi
          .plugin("content-manager")
          .service("uid")
          .generateUIDField({
            contentTypeUID: context.uid,
            field: "slug",
            data,
          })
      }
    }
    return next()
  })
}
