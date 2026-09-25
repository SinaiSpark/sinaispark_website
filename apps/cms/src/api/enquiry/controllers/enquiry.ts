import { factories } from "@strapi/strapi"

/** What a website form may set. Status and notes belong to the team. */
const FORM_FIELDS = [
  "fullName",
  "email",
  "phone",
  "market",
  "service",
  "message",
  "page",
] as const

export default factories.createCoreController(
  "api::enquiry.enquiry",
  ({ strapi }) => ({
    async create(ctx) {
      const input = (ctx.request.body?.data ?? {}) as Record<string, unknown>
      const data: Record<string, string> = {}
      for (const field of FORM_FIELDS) {
        const value = input[field]
        if (typeof value === "string" && value.trim())
          data[field] = value.trim()
      }

      await strapi.documents("api::enquiry.enquiry").create({
        data: { ...data, leadStatus: "New" } as never,
      })
      ctx.status = 201
      ctx.body = { ok: true }
    },
  })
)
