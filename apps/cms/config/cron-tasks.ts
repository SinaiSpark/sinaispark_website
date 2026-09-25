import type { Core } from "@strapi/strapi"

/** Content types with a "Publish at" field. */
const SCHEDULED = [
  "api::blog-post.blog-post",
  "api::research-article.research-article",
] as const

export default {
  /**
   * Scheduled publishing. Strapi's own "Releases" is a paid feature, so each
   * article carries a `publishAt` date instead: once it passes, a draft that
   * has never been published goes live. Already-published articles are left
   * alone, so editing one later never republishes it by surprise.
   */
  publishScheduled: {
    task: async ({ strapi }: { strapi: Core.Strapi }) => {
      const now = new Date().toISOString()
      for (const uid of SCHEDULED) {
        const documents = strapi.documents(uid)
        const due = await documents.findMany({
          status: "draft",
          filters: { publishAt: { $notNull: true, $lte: now } },
          fields: ["documentId", "title"],
        })
        for (const draft of due) {
          const live = await documents.findOne({
            documentId: draft.documentId,
            status: "published",
            fields: ["documentId"],
          })
          if (live) continue
          try {
            await documents.publish({ documentId: draft.documentId })
            strapi.log.info(`Scheduled publish: ${uid} "${draft.title}"`)
          } catch (error) {
            // Usually a required field left empty. Keep going with the rest;
            // the draft is retried every minute until someone fixes it.
            strapi.log.error(
              `Scheduled publish failed for "${draft.title}": ${(error as Error).message}`
            )
          }
        }
      }
    },
    options: { rule: "* * * * *" },
  },
}
