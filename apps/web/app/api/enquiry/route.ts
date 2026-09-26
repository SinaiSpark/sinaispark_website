import { assistantEnabled } from "@/lib/assistant/db"
import { transcript } from "@/lib/assistant/enquiry"
import { cms } from "@/lib/cms"
import { enquirySchema, type Enquiry } from "@/lib/contact-schema"
import { sourceLabel } from "@/lib/enquiry-label"
import { sendMail } from "@/lib/mail"
import { clientIp, rateLimit } from "@/lib/rate-limit"

/**
 * Consultation requests. The team is emailed and the enquiry is stored in the
 * CMS at the same time; the visitor sees success if either worked, so a lead
 * is only lost when both the mail provider and the CMS are down.
 */
export async function POST(request: Request) {
  if (!rateLimit(`enquiry:${clientIp(request)}`, 5, 60 * 60 * 1000)) {
    return Response.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    )
  }

  const parsed = enquirySchema.safeParse(await request.json().catch(() => ({})))
  if (!parsed.success) {
    return Response.json(
      {
        error: "Please check the highlighted fields.",
        fields: parsed.error.issues.map((issue) => String(issue.path[0])),
      },
      { status: 400 }
    )
  }
  const enquiry = parsed.data
  const page = sourceLabel(enquiry.from)

  const fields = {
    fullName: enquiry.name,
    email: enquiry.email,
    phone: enquiry.phone,
    market: enquiry.market,
    service: enquiry.service,
    message: enquiry.message,
    page,
  }
  const [stored, emailed] = await Promise.allSettled([
    enquiry.chat && assistantEnabled()
      ? storeWithChat(enquiry.chat, fields)
      : cms("/enquiries", {
          method: "POST",
          body: JSON.stringify({ data: fields }),
        }),
    notifyTeam(enquiry, page),
  ])

  if (stored.status === "rejected") console.error(stored.reason)
  const delivered =
    stored.status === "fulfilled" ||
    (emailed.status === "fulfilled" && emailed.value)
  if (!delivered) {
    return Response.json(
      { error: "We couldn't send your request. Please email us instead." },
      { status: 502 }
    )
  }

  // The visitor's copy is a courtesy; it never decides success.
  await sendMail({
    to: enquiry.email,
    subject: "We've received your request · Sinai Spark Global",
    text: [
      `Hello ${enquiry.name},`,
      "",
      `Thank you for getting in touch about ${enquiry.market}. A specialist for your market will reply within one business day to set up the call.`,
      "",
      "Sinai Spark Global",
    ].join("\n"),
  })

  return Response.json({ ok: true })
}

/**
 * A visitor who talked to the assistant first: the form updates that
 * conversation's enquiry (or starts one carrying the chat) rather than
 * adding a second lead for the same person.
 */
async function storeWithChat(session: string, fields: Record<string, string>) {
  return cms("/enquiries/chat", {
    method: "PUT",
    body: JSON.stringify({
      data: {
        ...fields,
        chatSession: session,
        channel: "Website form",
        transcript: await transcript(session).catch(() => ""),
      },
    }),
  })
}

function notifyTeam(enquiry: Enquiry, page: string) {
  const to = process.env.ENQUIRY_NOTIFY_TO
  if (!to) return Promise.resolve(false)
  return sendMail({
    to: to.split(",").map((address) => address.trim()),
    replyTo: enquiry.email,
    subject: `New enquiry: ${enquiry.name}, ${enquiry.market}, ${enquiry.service}`,
    text: [
      `Name:    ${enquiry.name}`,
      `Email:   ${enquiry.email}`,
      `Phone:   ${enquiry.phone || "-"}`,
      `Market:  ${enquiry.market}`,
      `Service: ${enquiry.service}`,
      `From:    ${page}`,
      "",
      enquiry.message || "(no message)",
    ].join("\n"),
  })
}
