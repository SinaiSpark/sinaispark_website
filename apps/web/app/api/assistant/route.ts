import { after } from "next/server"
import { z } from "zod"

import { handle } from "@/lib/assistant/conversation"
import { assistantEnabled } from "@/lib/assistant/db"
import { createLead, updateLead } from "@/lib/assistant/enquiry"
import type { ServerEvent } from "@/lib/assistant/protocol"
import { clientIp, rateLimit } from "@/lib/rate-limit"

/**
 * The website assistant (components/assistant). Each visitor action is one
 * POST; the reply streams back as newline-delimited JSON so a generated
 * answer appears word by word. The protocol is in lib/assistant/protocol.ts.
 */

export const runtime = "nodejs"
export const maxDuration = 60

const request = z.object({
  session: z.string().max(64).nullable(),
  page: z
    .string()
    .max(200)
    .regex(/^\/[\w\-./]*$/)
    .catch("/"),
  event: z.discriminatedUnion("type", [
    z.object({ type: z.literal("start") }),
    z.object({
      type: z.literal("topic"),
      id: z.string().max(64),
      label: z.string().max(120).optional(),
    }),
    z.object({ type: z.literal("text"), text: z.string().max(2000) }),
    z.object({
      type: z.literal("phone"),
      country: z.string().regex(/^[A-Z]{2}$/),
      number: z.string().max(40),
    }),
    z.object({ type: z.literal("decline") }),
  ]),
})

export async function POST(req: Request) {
  if (!assistantEnabled()) {
    return Response.json(
      { error: "The assistant is not set up." },
      { status: 503 }
    )
  }
  // Generous for a person, tight for a script: 40 actions per 10 minutes.
  if (!rateLimit(`assistant:${clientIp(req)}`, 40, 10 * 60 * 1000)) {
    return Response.json(
      { error: "You're sending messages quickly. Please wait a moment." },
      { status: 429 }
    )
  }
  const parsed = request.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return Response.json({ error: "Bad request" }, { status: 400 })
  }

  const country = req.headers.get("cf-ipcountry")
  const ipCountry =
    country && /^[A-Z]{2}$/.test(country) && country !== "XX" ? country : null

  const encoder = new TextEncoder()
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: ServerEvent) =>
        controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`))
      try {
        const outcome = await handle(parsed.data, ipCountry, send)
        const s = outcome.session
        if (outcome.lead === "create") {
          after(() =>
            createLead({
              id: s.id,
              name: s.name!,
              email: s.email!,
              phone: s.phone,
              service: s.service,
              market: s.market,
              page: s.page,
              topics: s.topics,
            }).catch((error) => console.error("[assistant] lead:", error))
          )
        } else if (outcome.lead === "update") {
          after(() =>
            updateLead(s.id, s.topics).catch((error) =>
              console.error("[assistant] lead update:", error)
            )
          )
        }
      } catch (error) {
        console.error("[assistant]", error)
        send({
          type: "error",
          message:
            "Something went wrong on our side. Please try again, or message us on WhatsApp.",
        })
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      "content-type": "application/x-ndjson; charset=utf-8",
      "cache-control": "no-store",
      // Stop proxies (nginx) holding the stream back until it ends.
      "x-accel-buffering": "no",
    },
  })
}
