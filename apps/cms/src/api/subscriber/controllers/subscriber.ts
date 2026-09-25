import { factories } from "@strapi/strapi"

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
const SOURCES = ["Newsletter", "Research gate"] as const
type Source = (typeof SOURCES)[number]

export default factories.createCoreController(
  "api::subscriber.subscriber",
  ({ strapi }) => ({
    /**
     * Adds an email to the list, or updates the existing entry.
     *
     * One address is one row however many times it signs up: a newsletter
     * sign-up turns `newsletter` on (and never off), and each research unlock
     * is added to `unlockedResearch`. Unlocking research alone does not opt
     * anyone into the newsletter.
     */
    async subscribe(ctx) {
      const body = (ctx.request.body ?? {}) as {
        email?: unknown
        newsletter?: unknown
        source?: unknown
        research?: unknown
      }

      const email =
        typeof body.email === "string" ? body.email.trim().toLowerCase() : ""
      if (!EMAIL.test(email) || email.length > 254) {
        return ctx.badRequest("A valid email address is required.")
      }
      const source: Source = SOURCES.includes(body.source as Source)
        ? (body.source as Source)
        : "Newsletter"
      const newsletter = body.newsletter === true || source === "Newsletter"

      let researchId: string | undefined
      if (typeof body.research === "string" && body.research) {
        const article = await strapi
          .documents("api::research-article.research-article")
          .findOne({
            documentId: body.research,
            status: "published",
            fields: ["documentId"],
          })
        if (!article) return ctx.badRequest("Unknown research article.")
        researchId = article.documentId
      }

      const subscribers = strapi.documents("api::subscriber.subscriber")
      const [existing] = await subscribers.findMany({
        filters: { email },
        limit: 1,
      })
      const unlock = researchId ? { connect: [researchId] } : undefined

      if (!existing) {
        await subscribers.create({
          data: {
            email,
            newsletter,
            firstSource: source,
            unlockedResearch: unlock,
          },
        })
      } else {
        await subscribers.update({
          documentId: existing.documentId,
          data: {
            newsletter: existing.newsletter || newsletter,
            // Signing up again after unsubscribing re-subscribes. The generated
            // input type leaves out null, but null is how Strapi clears a date.
            // Undefined leaves the field as it is.
            unsubscribedAt: newsletter
              ? (null as unknown as undefined)
              : undefined,
            unlockedResearch: unlock,
          },
        })
      }

      ctx.body = { ok: true }
    },
  })
)
