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

/** What the website assistant may set on the enquiry for its conversation. */
const CHAT_FIELDS = [...FORM_FIELDS, "topics", "transcript"] as const

const CHANNELS = new Set(["Website form", "Assistant"])

function pick(input: Record<string, unknown>, fields: readonly string[]) {
  const data: Record<string, string> = {}
  for (const field of fields) {
    const value = input[field]
    if (typeof value === "string" && value.trim()) data[field] = value.trim()
  }
  return data
}

export default factories.createCoreController(
  "api::enquiry.enquiry",
  ({ strapi }) => ({
    async create(ctx) {
      const input = (ctx.request.body?.data ?? {}) as Record<string, unknown>
      await strapi.documents("api::enquiry.enquiry").create({
        data: { ...pick(input, FORM_FIELDS), leadStatus: "New" } as never,
      })
      ctx.status = 201
      ctx.body = { ok: true }
    },

    /**
     * One enquiry per assistant conversation: the first call creates it,
     * later ones (a longer transcript, the contact form sent after the chat)
     * update the same entry instead of adding a duplicate lead.
     */
    async chat(ctx) {
      const input = (ctx.request.body?.data ?? {}) as Record<string, unknown>
      const session = String(input.chatSession ?? "")
      if (!/^[0-9a-f-]{36}$/i.test(session))
        return ctx.badRequest("chatSession")

      const data: Record<string, string> = pick(input, CHAT_FIELDS)
      const channel = String(input.channel ?? "")

      const enquiries = strapi.documents("api::enquiry.enquiry")
      const existing = await enquiries.findFirst({
        filters: { chatSession: session },
        fields: ["documentId"],
      })
      if (existing) {
        await enquiries.update({
          documentId: existing.documentId,
          data: data as never,
        })
        ctx.body = { ok: true, created: false }
        return
      }
      if (!data.fullName || !data.email)
        return ctx.badRequest("fullName, email")
      await enquiries.create({
        data: {
          // Where the lead started; a later form submission doesn't change it.
          channel: CHANNELS.has(channel) ? channel : "Assistant",
          ...data,
          chatSession: session,
          leadStatus: "New",
        } as never,
      })
      ctx.status = 201
      ctx.body = { ok: true, created: true }
    },
  })
)
