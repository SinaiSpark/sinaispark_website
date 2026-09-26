import { sql } from "@/lib/assistant/db"
import { cms } from "@/lib/cms"
import { sourceLabel } from "@/lib/enquiry-label"
import { sendMail } from "@/lib/mail"

/**
 * The assistant's leads, stored as Enquiries in the CMS (channel
 * "Assistant"), one per conversation: created once the visitor has given
 * their name, email and phone, then kept up to date with the transcript.
 */

export interface SessionLead {
  id: string
  name: string
  email: string
  phone: string | null
  service: string | null
  market: string | null
  page: string | null
  topics: string[]
}

/** The conversation as plain text, for the enquiry. */
export async function transcript(session: string) {
  const rows = await sql<{ role: string; content: string; created_at: Date }>(
    "select role, content, created_at from assistant.messages where session_id = $1 order by id",
    [session]
  )
  return rows
    .map((row) => {
      const time = row.created_at.toISOString().slice(11, 16)
      return `[${time}] ${row.role === "user" ? "Visitor" : "Assistant"}: ${row.content}`
    })
    .join("\n\n")
    .slice(-60_000)
}

async function firstQuestion(session: string) {
  const [row] = await sql<{ content: string }>(
    "select content from assistant.messages where session_id = $1 and role = 'user' order by id limit 1",
    [session]
  )
  return row?.content ?? ""
}

/** Creates the Enquiry and emails the team. */
export async function createLead(lead: SessionLead) {
  const page = sourceLabel(lead.page)
  const question = await firstQuestion(lead.id)
  await cms("/enquiries/chat", {
    method: "PUT",
    body: JSON.stringify({
      data: {
        chatSession: lead.id,
        channel: "Assistant",
        fullName: lead.name,
        email: lead.email,
        phone: lead.phone ?? "",
        service: lead.service ?? "",
        market: lead.market ?? "",
        message: question.slice(0, 2000),
        page,
        topics: lead.topics.join("\n"),
        transcript: await transcript(lead.id),
      },
    }),
  })
  await sql("update assistant.sessions set has_enquiry = true where id = $1", [
    lead.id,
  ])

  const to = process.env.ENQUIRY_NOTIFY_TO
  if (!to) return
  await sendMail({
    to: to.split(",").map((address) => address.trim()),
    replyTo: lead.email,
    subject: `New assistant lead: ${lead.name}${lead.service ? `, ${lead.service}` : ""}`,
    text: [
      `Name:    ${lead.name}`,
      `Email:   ${lead.email}`,
      `Phone:   ${lead.phone || "-"}`,
      `Market:  ${lead.market || "-"}`,
      `Service: ${lead.service || "-"}`,
      `From:    ${page}`,
      lead.topics.length ? `Topics:  ${lead.topics.join(", ")}` : "",
      "",
      `Their question: ${question || "(picked from the menu)"}`,
      "",
      "The full conversation is on the enquiry in the CMS and updates as it continues.",
    ]
      .filter((line, i, all) => line || all[i - 1] !== "")
      .join("\n"),
  })
}

/** Refreshes the Enquiry's transcript and topics after each exchange. */
export async function updateLead(session: string, topics: string[]) {
  await cms("/enquiries/chat", {
    method: "PUT",
    body: JSON.stringify({
      data: {
        chatSession: session,
        topics: topics.join("\n"),
        transcript: await transcript(session),
      },
    }),
  })
}
