import { cms } from "@/lib/cms"

/**
 * The assistant's menu and settings from the CMS ("Assistant menu",
 * "Assistant settings"). Cached under the "assistant" tag, which the CMS
 * refreshes on publish. Like the site settings these never throw: without
 * the CMS the assistant falls back to defaults and hides its launcher rather
 * than breaking the page.
 */

const HOUR = 60 * 60
const cached = {
  cache: "force-cache" as const,
  next: { tags: ["assistant"], revalidate: HOUR },
}

export type TopicAction = "None" | "Book a consultation" | "WhatsApp"

export interface Topic {
  id: string
  question: string
  answer: string
  alsoAsked: string[]
  parent: string | null
  order: number
  link: { label: string; href: string } | null
  action: TopicAction
  service: string | null
  market: string | null
}

export interface AssistantSettings {
  enabled: boolean
  name: string
  greeting: string
  fallback: string
  whatsappLabel: string
}

export const SETTINGS_DEFAULTS: AssistantSettings = {
  enabled: false,
  name: "Spark Assistant",
  greeting:
    "Hi, I'm Spark Assistant from Sinai Spark Global. Pick a topic below or type your question.",
  fallback:
    "That one is best answered by a specialist, so I'd rather not guess. A free consultation will get you a precise answer, or we can talk on WhatsApp.",
  whatsappLabel: "Chat on WhatsApp",
}

export async function getAssistantSettings(): Promise<AssistantSettings> {
  try {
    const res = await cms<{ data: Partial<AssistantSettings> | null }>(
      "/assistant-setting",
      cached
    )
    return res.data
      ? {
          enabled: res.data.enabled ?? true,
          name: res.data.name || SETTINGS_DEFAULTS.name,
          greeting: res.data.greeting || SETTINGS_DEFAULTS.greeting,
          fallback: res.data.fallback || SETTINGS_DEFAULTS.fallback,
          whatsappLabel:
            res.data.whatsappLabel || SETTINGS_DEFAULTS.whatsappLabel,
        }
      : SETTINGS_DEFAULTS
  } catch (error) {
    console.error("[assistant] settings unavailable:", error)
    return SETTINGS_DEFAULTS
  }
}

type RawTopic = {
  documentId: string
  question: string
  answer: string
  alsoAsked?: string | null
  order?: number | null
  linkLabel?: string | null
  linkUrl?: string | null
  action?: TopicAction | null
  service?: string | null
  market?: string | null
  parent?: { documentId: string } | null
}

/** Only site paths and https links; anything else is dropped. */
const safeHref = (url: string | null | undefined) =>
  url && (/^\/(?!\/)/.test(url) || /^https:\/\//.test(url)) ? url : null

export async function getTopics(): Promise<Topic[]> {
  try {
    const fields = [
      "question",
      "answer",
      "alsoAsked",
      "order",
      "linkLabel",
      "linkUrl",
      "action",
      "service",
      "market",
    ]
    const res = await cms<{ data: RawTopic[] }>(
      `/assistant-topics?${fields.map((f, i) => `fields[${i}]=${f}`).join("&")}&populate[parent][fields][0]=documentId&sort[0]=order:asc&sort[1]=id:asc&pagination[pageSize]=200`,
      cached
    )
    return res.data.map((raw) => {
      const href = safeHref(raw.linkUrl)
      return {
        id: raw.documentId,
        question: raw.question,
        answer: raw.answer,
        alsoAsked: (raw.alsoAsked ?? "")
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean),
        parent: raw.parent?.documentId ?? null,
        order: raw.order ?? 10,
        link: href && raw.linkLabel ? { label: raw.linkLabel, href } : null,
        action: raw.action ?? "Book a consultation",
        service: raw.service ?? null,
        market: raw.market ?? null,
      }
    })
  } catch (error) {
    console.error("[assistant] menu unavailable:", error)
    return []
  }
}

/** The options offered after `parent`'s answer (the first menu for null). */
export function childrenOf(topics: Topic[], parent: string | null) {
  return topics.filter((t) => t.parent === parent)
}
