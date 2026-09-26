import path from "node:path"
import type { Core } from "@strapi/strapi"

interface SeedTopic {
  question: string
  answer: string
  alsoAsked?: string
  action?: string
  service?: string
  market?: string
  linkLabel?: string
  linkUrl?: string
  children?: SeedTopic[]
}

interface SeedAssistant {
  settings: Record<string, unknown>
  topics: SeedTopic[]
}

/**
 * Gives the website assistant its settings and a first menu, drafted from
 * the site's own copy (scripts/assistant-content.json), so editors refine
 * answers instead of writing them from nothing.
 *
 * The settings entry is created whenever it's missing, like the other
 * settings. The menu is seeded once, ever (a flag in the store), so an editor
 * who clears it doesn't get it back on restart.
 */
export async function seedAssistantContent(strapi: Core.Strapi) {
  const seed: SeedAssistant = require(
    path.join(strapi.dirs.app.root, "scripts", "assistant-content.json")
  )

  const settings = strapi.documents("api::assistant-setting.assistant-setting")
  if (!(await settings.findFirst())) {
    await settings.create({ data: seed.settings as never })
  }

  const store = strapi.store({ type: "core", name: "sinaispark" })
  const key = "seeded:api::assistant-topic.assistant-topic"
  if (await store.get({ key })) return

  const topics = strapi.documents("api::assistant-topic.assistant-topic")
  if (!(await topics.findFirst())) {
    const create = async (topic: SeedTopic, order: number, parent?: string) => {
      const { children = [], ...data } = topic
      const created = await topics.create({
        data: { ...data, order, parent } as never,
        status: "published",
      })
      for (const [i, child] of children.entries()) {
        await create(child, (i + 1) * 10, created.documentId)
      }
    }
    for (const [i, topic] of seed.topics.entries()) {
      await create(topic, (i + 1) * 10)
    }
  }
  await store.set({ key, value: true })
}
