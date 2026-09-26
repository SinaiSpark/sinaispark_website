import { randomUUID } from "node:crypto"

import type { CountryCode } from "libphonenumber-js"

import {
  answerQuestion,
  menuMessage,
  MENU_OPTION,
  topicMessage,
} from "@/lib/assistant/answer"
import {
  getAssistantSettings,
  getTopics,
  type Topic,
} from "@/lib/assistant/content"
import { sql } from "@/lib/assistant/db"
import { completeJson } from "@/lib/assistant/groq"
import {
  countryFromEmail,
  firstName,
  isDecline,
  phoneFromPicker,
  readDetails,
  type LeadDetails,
} from "@/lib/assistant/lead"
import type {
  BotMessage,
  ClientRequest,
  Handoff,
  InputKind,
  Message,
  ServerEvent,
} from "@/lib/assistant/protocol"

/**
 * One visitor action in, a stream of replies out.
 *
 * The flow: the visitor asks something (a menu option or a typed question).
 * Before the first answer the assistant asks, one at a time, for their name,
 * email and phone, then answers the question they asked. Details can come in
 * any order or all at once; a visitor who declines is pointed to WhatsApp and
 * the contact form (pre-filled with whatever they did share) instead.
 */

type Stage = "open" | "name" | "email" | "phone" | "ready" | "declined"

type Pending = { kind: "topic"; id: string } | { kind: "text"; text: string }

export interface Session {
  id: string
  stage: Stage
  name: string | null
  email: string | null
  phone: string | null
  phone_country: string | null
  pending: Pending | null
  topics: string[]
  service: string | null
  market: string | null
  page: string | null
  last_topic: string | null
  has_enquiry: boolean
  generated: number
}

const MARKET_COUNTRY: Record<string, CountryCode> = {
  "Saudi Arabia": "SA",
  "United Arab Emirates": "AE",
  India: "IN",
  "United Kingdom": "GB",
  Bahrain: "BH",
}

/**
 * The phone picker's starting country: one they already used, their email's
 * country, the market they asked about, where they're browsing from, or
 * Saudi Arabia.
 */
function phoneCountry(s: Session, ipCountry: string | null): CountryCode {
  return (s.phone_country ??
    countryFromEmail(s.email) ??
    MARKET_COUNTRY[s.market ?? ""] ??
    ipCountry ??
    "SA") as CountryCode
}

const DECLINE_OPTION = { id: "decline", label: "I'd rather not" }
const DETAILS_OPTION = { id: "details", label: "OK, I'll share them" }

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

async function loadSession(id: string | null, page: string) {
  if (id && UUID.test(id)) {
    // The per-day allowance of generated answers restarts each day.
    const [row] = await sql<Session>(
      `update assistant.sessions
       set generated = case when updated_at::date < now()::date then 0 else generated end,
           updated_at = now()
       where id = $1 returning *`,
      [id]
    )
    if (row) return { session: row, created: false }
  }
  const [row] = await sql<Session>(
    "insert into assistant.sessions (id, page) values ($1, $2) returning *",
    [randomUUID(), page]
  )
  return { session: row!, created: true }
}

async function saveSession(s: Session) {
  await sql(
    `update assistant.sessions set stage = $2, name = $3, email = $4, phone = $5,
       phone_country = $6, pending = $7, topics = $8, service = $9, market = $10,
       last_topic = $11, generated = $12, updated_at = now()
     where id = $1`,
    [
      s.id,
      s.stage,
      s.name,
      s.email,
      s.phone,
      s.phone_country,
      s.pending ? JSON.stringify(s.pending) : null,
      s.topics,
      s.service,
      s.market,
      s.last_topic,
      s.generated,
    ]
  )
}

async function saveMessage(session: string, message: Message) {
  const { role, text, ...meta } = message
  await sql(
    "insert into assistant.messages (session_id, role, content, meta) values ($1, $2, $3, $4)",
    [
      session,
      role,
      text,
      Object.keys(meta).length ? JSON.stringify(meta) : null,
    ]
  )
}

async function loadHistory(session: string, limit = 60): Promise<Message[]> {
  const rows = await sql<{
    role: string
    content: string
    meta: object | null
  }>(
    `select role, content, meta from (
       select id, role, content, meta from assistant.messages
       where session_id = $1 order by id desc limit $2
     ) recent order by id`,
    [session, limit]
  )
  return rows.map((row) =>
    row.role === "user"
      ? { role: "user", text: row.content }
      : ({
          role: "assistant",
          text: row.content,
          ...(row.meta ?? {}),
        } as BotMessage)
  )
}

const missing = (s: Session): "name" | "email" | "phone" | null =>
  !s.name ? "name" : !s.email ? "email" : !s.phone ? "phone" : null

function askFor(
  field: "name" | "email" | "phone",
  s: Session,
  again = false
): BotMessage {
  const first = s.name ? firstName(s.name) : ""
  const text =
    field === "name" && (s.email || s.phone)
      ? "Thanks. And who am I speaking with?"
      : field === "name"
        ? again
          ? "Happy to help with that. I just need a few details first, so a specialist can follow up on anything I can't cover here. What's your name?"
          : s.pending?.kind === "topic"
            ? "Sure, I'll walk you through it. First, who am I speaking with?"
            : "Happy to help with that. Before I answer, who am I speaking with?"
        : field === "email"
          ? `Thanks, ${first}. What's the best email to send you anything useful we cover?`
          : `And a phone number, in case a specialist needs to reach you${first ? `, ${first}` : ""}?`
  return { role: "assistant", text, options: [DECLINE_OPTION] }
}

function declineMessage(): BotMessage {
  return {
    role: "assistant",
    text: "No problem. I can only answer here once there's a way for a specialist to follow up, but you can reach the team directly: message us on WhatsApp, or send your question through the contact form.",
    actions: ["whatsapp", "consult"],
    options: [DETAILS_OPTION],
  }
}

/** Details the rules couldn't read, from a small model; null if it can't help. */
async function readWithModel(
  text: string,
  field: string
): Promise<LeadDetails> {
  if (text.length < 3 || text.length > 300) return {}
  const result = await completeJson<{
    name?: string
    email?: string
    phone?: string
  }>([
    {
      role: "system",
      content: `A website chat asked the visitor for their ${field}. Extract any name, email and phone number they gave from their reply. Use null for anything not given; never guess. Reply as JSON: {"name": string|null, "email": string|null, "phone": string|null}`,
    },
    { role: "user", content: text },
  ])
  if (!result) return {}
  // The model only points at the details; the rules still validate them.
  return readDetails(
    [result.name && `my name is ${result.name}`, result.email, result.phone]
      .filter(Boolean)
      .join(" , ")
  )
}

function apply(s: Session, details: LeadDetails) {
  if (details.name && !s.name) s.name = details.name.slice(0, 120)
  if (details.email && !s.email) s.email = details.email
  if (details.phone && !s.phone) {
    s.phone = details.phone
    s.phone_country = details.phoneCountry ?? s.phone_country
  }
}

function handoffOf(s: Session): Handoff {
  const pendingText = s.pending?.kind === "text" ? s.pending.text : undefined
  return {
    session: s.id,
    ...(s.name ? { name: s.name } : {}),
    ...(s.email ? { email: s.email } : {}),
    ...(s.phone ? { phone: s.phone } : {}),
    ...(s.phone_country ? { phoneCountry: s.phone_country } : {}),
    ...(s.service ? { service: s.service } : {}),
    ...(s.market ? { market: s.market } : {}),
    // Their question, or else what they looked at, as the form's message.
    ...(pendingText
      ? { message: pendingText }
      : s.topics.length
        ? { message: `I asked the assistant about: ${s.topics.join("; ")}.` }
        : {}),
  }
}

export interface Outcome {
  /** Call after the response: create or update the CMS enquiry. */
  lead: "create" | "update" | null
  session: Session
}

export async function handle(
  request: ClientRequest,
  ipCountry: string | null,
  send: (event: ServerEvent) => void
): Promise<Outcome> {
  const { session: s, created } = await loadSession(
    request.session,
    request.page
  )
  if (created) send({ type: "session", id: s.id })
  const [settings, topics] = await Promise.all([
    getAssistantSettings(),
    getTopics(),
  ])
  const byId = new Map(topics.map((t) => [t.id, t]))

  const hadEnquiry = s.has_enquiry
  let completedLead = false

  const say = async (message: BotMessage) => {
    await saveMessage(s.id, message)
    send({ type: "message", message })
  }
  const heard = (text: string) => saveMessage(s.id, { role: "user", text })

  const noteTopic = (topic: Topic) => {
    s.last_topic = topic.id
    if (!s.topics.includes(topic.question))
      s.topics = [...s.topics, topic.question]
    if (topic.service) s.service = topic.service
    if (topic.market) s.market = topic.market
  }

  /** Answers what they asked before the details step. */
  const answerPending = async () => {
    const pending = s.pending
    s.pending = null
    if (!pending) return
    if (pending.kind === "topic") {
      const topic = byId.get(pending.id)
      if (topic) {
        noteTopic(topic)
        await say(topicMessage(topics, topic))
        return
      }
      await say(menuMessage(topics, "What would you like to know?"))
      return
    }
    await answerText(pending.text)
  }

  const answerText = async (text: string) => {
    const history = await loadHistory(s.id, 8)
    const run = answerQuestion(text, {
      topics,
      settings,
      lastTopic: s.last_topic,
      history: history.slice(0, -1),
      generated: s.generated,
    })
    let step = await run.next()
    while (!step.done) {
      send(step.value)
      step = await run.next()
    }
    const result = step.value
    if (result.generated) s.generated += 1
    if (result.topic) noteTopic(result.topic)
    else s.last_topic = null
    await saveMessage(s.id, result.message)
    if (!result.streamed) send({ type: "message", message: result.message })
  }

  /** Starts (or resumes) the details step for something they asked. */
  const gate = async (pending: Pending) => {
    s.pending = pending
    const retry = s.stage === "declined"
    const field = missing(s)
    if (!field) {
      s.stage = "ready"
      return answerPending()
    }
    s.stage = field
    await say(askFor(field, s, retry))
  }

  /** Takes details from a reply during the details step. */
  const capture = async (details: LeadDetails, raw: string | null) => {
    const field = missing(s)!
    let got = details
    const wanted =
      field === "name" ? got.name : field === "email" ? got.email : got.phone
    if (!wanted && raw) {
      if (isDecline(raw)) return decline()
      got = { ...got, ...(await readWithModel(raw, field)) }
    }
    const had = [s.name, s.email, s.phone].filter(Boolean).length
    apply(s, got)
    const next = missing(s)
    // Nothing usable at all: ask again for the one we asked for. (A different
    // detail than the one asked for still counts, e.g. an email first.)
    if ([s.name, s.email, s.phone].filter(Boolean).length === had) {
      s.stage = field
      await say({
        role: "assistant",
        text:
          field === "name"
            ? "Sorry, I didn't catch your name. What should I call you?"
            : field === "email"
              ? "That email doesn't look quite right. Could you check it?"
              : "That number doesn't look right for the country picked. Could you check it, including the country code?",
        options: [DECLINE_OPTION],
      })
      return
    }
    if (next) {
      s.stage = next
      await say(askFor(next, s))
      return
    }
    s.stage = "ready"
    completedLead = true
    await say({
      role: "assistant",
      text: `Thanks, ${firstName(s.name!)}. That's everything I need.`,
    })
    await answerPending()
  }

  const decline = async () => {
    s.stage = "declined"
    await say(declineMessage())
  }

  const event = request.event
  switch (event.type) {
    case "start": {
      const history = await loadHistory(s.id)
      if (history.length) send({ type: "history", messages: history })
      else await say(menuMessage(topics, settings.greeting))
      break
    }
    case "topic": {
      if (event.id === "menu") {
        await heard(MENU_OPTION.label)
        s.last_topic = null
        await say(menuMessage(topics, "What else can I help you with?"))
        break
      }
      if (event.id === "decline") {
        await heard(DECLINE_OPTION.label)
        await decline()
        break
      }
      if (event.id === "details") {
        await heard(DETAILS_OPTION.label)
        const field = missing(s)
        if (field) {
          s.stage = field
          await say(askFor(field, s))
        } else {
          s.stage = "ready"
          await answerPending()
        }
        break
      }
      // An option from a menu shown before an editor changed it: its id is
      // gone, but the same question usually still exists.
      const topic =
        byId.get(event.id) ??
        (event.label
          ? topics.find((t) => t.question === event.label)
          : undefined)
      if (!topic) {
        await say(
          menuMessage(
            topics,
            "That option has changed. Here's the current menu:"
          )
        )
        break
      }
      await heard(topic.question)
      if (s.stage === "ready") {
        noteTopic(topic)
        await say(topicMessage(topics, topic))
      } else {
        if (topic.service) s.service = topic.service
        if (topic.market) s.market = topic.market
        await gate({ kind: "topic", id: topic.id })
      }
      break
    }
    case "text": {
      const text = event.text.trim().slice(0, 500)
      if (!text) break
      await heard(text)
      const country = phoneCountry(s, ipCountry)
      if (s.stage === "name" || s.stage === "email" || s.stage === "phone") {
        await capture(readDetails(text, country), text)
      } else if (s.stage === "ready") {
        await answerText(text)
      } else {
        await gate({ kind: "text", text })
      }
      break
    }
    case "phone": {
      await heard(event.number)
      const parsed = phoneFromPicker(event.country, event.number)
      if (s.stage !== "phone") {
        await say(menuMessage(topics, "What would you like to know?"))
        break
      }
      await capture(
        parsed ? { phone: parsed.phone, phoneCountry: parsed.country } : {},
        null
      )
      break
    }
    case "decline": {
      await heard(DECLINE_OPTION.label)
      await decline()
      break
    }
  }

  await saveSession(s)

  const input: InputKind =
    s.stage === "name" || s.stage === "email" || s.stage === "phone"
      ? s.stage
      : "text"
  send({
    type: "state",
    input,
    ...(input === "phone" ? { country: phoneCountry(s, ipCountry) } : {}),
    handoff: handoffOf(s),
  })

  return {
    lead:
      completedLead && !hadEnquiry ? "create" : hadEnquiry ? "update" : null,
    session: s,
  }
}
