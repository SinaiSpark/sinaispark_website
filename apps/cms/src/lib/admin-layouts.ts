import type { Core } from "@strapi/strapi"

/**
 * The columns and default order of each list screen in the content manager:
 * a cover thumbnail and the useful fields first, newest on top.
 *
 * Applied once per LAYOUT_VERSION, so anything changed afterwards in the
 * admin's "Configure the view" stays. Bump the version to re-apply.
 */
const LAYOUT_VERSION = 6

type Layout = {
  columns: string[]
  /** Labels set whenever the layout is (re)applied, e.g. after a rename. */
  labels?: Record<string, { label: string; description?: string }>
  sortBy: string
  order: "ASC" | "DESC"
  pageSize?: number
  /** The field shown when an entry is picked in a relation, e.g. an FAQ's pages. */
  mainField?: string
}

const LAYOUTS: Record<string, Layout> = {
  "api::blog-post.blog-post": {
    columns: ["cover", "title", "format", "market", "date", "publishAt"],
    sortBy: "date",
    order: "DESC",
  },
  "api::research-article.research-article": {
    columns: ["cover", "title", "topic", "market", "date", "emailGate"],
    sortBy: "date",
    order: "DESC",
  },
  "api::event.event": {
    columns: ["cover", "title", "role", "city", "startDate", "publishAt"],
    sortBy: "startDate",
    order: "DESC",
  },
  "api::enquiry.enquiry": {
    columns: [
      "fullName",
      "leadStatus",
      "channel",
      "service",
      "market",
      "page",
      "createdAt",
    ],
    sortBy: "createdAt",
    order: "DESC",
    pageSize: 20,
    labels: {
      // Named leadStatus: a field called "status" is shown by Strapi 5 as
      // the draft/published badge.
      leadStatus: {
        label: "Status",
        description: "Where this lead stands. New enquiries arrive as New.",
      },
      page: {
        label: "Came from",
        description:
          "The page the visitor was on before the contact form, or the contact page if they opened it directly.",
      },
    },
  },
  "api::assistant-topic.assistant-topic": {
    columns: ["question", "parent", "action", "order", "updatedAt"],
    sortBy: "order",
    order: "ASC",
    pageSize: 50,
    mainField: "question",
  },
  "api::knowledge-document.knowledge-document": {
    columns: ["title", "file", "updatedAt"],
    sortBy: "updatedAt",
    order: "DESC",
  },
  "api::subscriber.subscriber": {
    columns: ["email", "newsletter", "firstSource", "createdAt"],
    sortBy: "createdAt",
    order: "DESC",
    pageSize: 50,
  },
  "api::page-seo.page-seo": {
    columns: ["page", "path", "updatedAt"],
    sortBy: "path",
    order: "ASC",
    pageSize: 50,
    mainField: "page",
  },
  "api::faq.faq": {
    columns: ["question", "category", "order", "pages"],
    sortBy: "order",
    order: "ASC",
    pageSize: 50,
    mainField: "question",
  },
  "api::team-member.team-member": {
    columns: ["photo", "name", "role", "order"],
    sortBy: "order",
    order: "ASC",
    mainField: "role",
  },
  "api::testimonial.testimonial": {
    columns: ["name", "rating", "source", "reviewDate", "order"],
    sortBy: "order",
    order: "ASC",
    pageSize: 100,
    mainField: "name",
  },
}

export async function applyAdminLayouts(strapi: Core.Strapi) {
  const store = strapi.store({ type: "core", name: "sinaispark" })
  const applied = Number(await store.get({ key: "admin-layouts" })) || 0
  if (applied >= LAYOUT_VERSION) return

  const contentTypes = strapi.plugin("content-manager").service("content-types")
  for (const [uid, layout] of Object.entries(LAYOUTS)) {
    const schema = strapi.contentType(uid as never)
    if (!schema) continue
    const config = await contentTypes.findConfiguration(schema)
    const { attributes = {} } = schema as unknown as {
      attributes?: Record<string, unknown>
    }
    const known = (name: string) =>
      name in attributes || name === "createdAt" || name === "updatedAt"

    const { uid: _uid, ...rest } = config
    for (const [name, { label, description }] of Object.entries(
      layout.labels ?? {}
    )) {
      const meta = rest.metadatas?.[name]
      if (!meta) continue
      if (meta.edit) {
        meta.edit.label = label
        if (description) meta.edit.description = description
      }
      if (meta.list) meta.list.label = label
    }
    await contentTypes.updateConfiguration(schema, {
      ...rest,
      settings: {
        ...rest.settings,
        defaultSortBy: layout.sortBy,
        defaultSortOrder: layout.order,
        ...(layout.pageSize ? { pageSize: layout.pageSize } : {}),
        ...(layout.mainField ? { mainField: layout.mainField } : {}),
      },
      layouts: { ...rest.layouts, list: layout.columns.filter(known) },
    })
  }
  // v2 renamed the enquiry's "status" to "leadStatus": earlier rows start as New.
  await strapi.db
    .query("api::enquiry.enquiry")
    .updateMany({ where: { leadStatus: null }, data: { leadStatus: "New" } })

  await store.set({ key: "admin-layouts", value: LAYOUT_VERSION })
}
