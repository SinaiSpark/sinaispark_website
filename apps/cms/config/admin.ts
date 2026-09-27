import type { Core } from "@strapi/strapi"

/** Where each previewable content type lives on the website. */
const PREVIEW_PATHS: Record<string, (slug: string) => string> = {
  "api::blog-post.blog-post": (slug) => `/blog/${slug}/`,
  "api::research-article.research-article": (slug) => `/research/${slug}/`,
  "api::event.event": (slug) => `/events/${slug}/`,
}

const config = ({
  env,
}: Core.Config.Shared.ConfigParams): Core.Config.Admin => ({
  auth: {
    secret: env("ADMIN_JWT_SECRET")!,
  },
  apiToken: {
    salt: env("API_TOKEN_SALT")!,
  },
  transfer: {
    token: {
      salt: env("TRANSFER_TOKEN_SALT")!,
    },
  },
  secrets: {
    encryptionKey: env("ENCRYPTION_KEY")!,
  },
  /**
   * The "Open preview" button on blog posts, research articles and events.
   * It opens the real page through the site's /api/preview/ route, which
   * switches on Next.js draft mode so the unpublished version is shown.
   */
  preview: {
    enabled: true,
    config: {
      allowedOrigins: [env("WEB_URL", "http://localhost:3100")],
      async handler(uid, { documentId, status }) {
        const toPath = PREVIEW_PATHS[uid]
        if (!toPath) return null
        const doc = await strapi
          .documents(uid as "api::blog-post.blog-post")
          .findOne({
            documentId,
            status: status === "published" ? "published" : "draft",
            fields: ["slug"],
          })
        if (!doc?.slug) return null
        const params = new URLSearchParams({
          secret: env("PREVIEW_SECRET", ""),
          path: toPath(doc.slug),
          status: status ?? "draft",
        })
        return `${env("WEB_URL", "http://localhost:3100")}/api/preview/?${params}`
      },
    },
  },
  // One-off scripts and their data must not restart the dev server.
  watchIgnoreFiles: ["**/scripts/**"],
  flags: {
    nps: env.bool("FLAG_NPS", false),
    promoteEE: env.bool("FLAG_PROMOTE_EE", false),
    docLinks: env.bool("FLAG_DOC_LINKS", true),
  },
})

export default config
