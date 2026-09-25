import type { Core } from "@strapi/strapi"

/**
 * Plain-English labels and help text for the edit screens, so editors never
 * meet raw field names like "publishAt". Applied on boot, but only to fields
 * still showing their default label: anything changed later in the admin's
 * "Configure the view" is left alone.
 */
type Field = {
  label: string
  description?: string
  editable?: boolean
  /** An earlier label of ours: a field still showing it is updated too. */
  replaces?: string
}

const PUBLISH_AT: Field = {
  label: "Publish at",
  description:
    "Easiest from the Schedule box on the right. Set a date and time and the draft goes live by itself (first publish only).",
}
const SEO: Field = {
  label: "SEO",
  description:
    "Search and social settings. Leave empty to use the title, summary and cover. Adding it shows the SEO panel on the right.",
}
const READ: Field = { label: "Reading time (minutes)" }
const FEATURED: Field = {
  label: "Featured",
  description:
    "Shown first on its page. If several are featured, the newest wins.",
}
const DATE: Field = {
  label: "Date",
  description: "The publication date readers see.",
}
const BODY: Field = { label: "Article" }
const COMMON: Record<string, Field> = {
  title: { label: "Title" },
  slug: {
    label: "Address (slug)",
    description: "The end of the page address. Filled in from the title.",
  },
  cover: { label: "Cover image" },
  market: { label: "Market" },
}

const LABELS: Record<string, Record<string, Field>> = {
  "api::blog-post.blog-post": {
    ...COMMON,
    format: { label: "Format" },
    excerpt: {
      label: "Excerpt",
      description: "One or two sentences, shown under the title and on cards.",
    },
    readMinutes: READ,
    publishAt: PUBLISH_AT,
    featured: FEATURED,
    date: DATE,
    body: BODY,
    seo: SEO,
  },
  "api::research-article.research-article": {
    ...COMMON,
    topic: { label: "Topic" },
    summary: {
      label: "Summary",
      description: "Shown under the title and on cards.",
    },
    readMinutes: READ,
    publishAt: PUBLISH_AT,
    featured: FEATURED,
    date: DATE,
    body: BODY,
    seo: SEO,
    emailGate: {
      label: "Email gate",
      description:
        "On: readers see the first blocks, then give their email to read the rest. Off by default.",
    },
    previewBlocks: {
      label: "Blocks shown before the gate",
      description:
        "How many paragraphs, headings, lists or tables readers see before the email form.",
    },
  },
  "api::site-setting.site-setting": {
    insightsEnabled: {
      label: "Show Insights (research)",
      description:
        "Off hides the research pages and every link to them. The blog is always public. Editors can still preview a draft article.",
      replaces: "Show Insights (blog and research)",
    },
  },
  "api::seo-setting.seo-setting": {
    siteName: { label: "Site name" },
    titleTemplate: {
      label: "Title template",
      description: "%s is replaced by each page's title.",
    },
    defaultDescription: {
      label: "Default description",
      description: "Used by pages with no description of their own.",
    },
    defaultShareImage: {
      label: "Default share image",
      description:
        "Shown when a page is shared and has no image of its own. 1200 × 630 works best.",
    },
    allowIndexing: {
      label: "Allow search engines",
      description:
        "Off (pre-launch) keeps the whole site out of search results. Switch on at launch.",
    },
    robotsDisallow: {
      label: "Paths to block from crawlers",
      description:
        "One path per line, e.g. /contact/thanks/. Applies once search engines are allowed.",
    },
    googleSiteVerification: {
      label: "Google Search Console code",
      description: "The content value of Google's verification meta tag.",
    },
    bingSiteVerification: {
      label: "Bing Webmaster code",
      description: "The content value of Bing's msvalidate.01 meta tag.",
    },
    twitterHandle: {
      label: "X (Twitter) handle",
      description: "e.g. @sinaispark",
    },
    organizationLegalName: { label: "Company legal name" },
    organizationEmail: { label: "Company email" },
    organizationPhone: { label: "Company phone" },
    organizationAddress: { label: "Company address" },
    organizationProfiles: {
      label: "Company profiles",
      description:
        "LinkedIn, X, Instagram... one URL per line. Tells Google these accounts are yours.",
    },
  },
  "api::page-seo.page-seo": {
    page: { label: "Page", editable: false },
    path: {
      label: "Address on the site",
      description: "Set by the website.",
      editable: false,
    },
    seo: {
      label: "SEO",
      description:
        "Leave empty to keep the page's built-in title and description.",
    },
  },
  "api::enquiry.enquiry": {
    fullName: { label: "Name" },
    service: { label: "Needs" },
    leadStatus: { label: "Status" },
    page: { label: "Came from" },
    notes: { label: "Notes", description: "Private to the team." },
  },
  "api::subscriber.subscriber": {
    newsletter: {
      label: "Newsletter",
      description:
        "Opted in to the newsletter. Unlocking research alone doesn't opt anyone in.",
    },
    firstSource: { label: "First signed up via" },
    unlockedResearch: { label: "Research unlocked" },
    unsubscribedAt: { label: "Unsubscribed at" },
  },
}

export async function applyAdminLabels(strapi: Core.Strapi) {
  const contentTypes = strapi.plugin("content-manager").service("content-types")

  for (const [uid, fields] of Object.entries(LABELS)) {
    const schema = strapi.contentType(uid as never)
    if (!schema) continue
    const config = await contentTypes.findConfiguration(schema)
    let changed = false

    for (const [name, field] of Object.entries(fields)) {
      const meta = config.metadatas?.[name]
      if (!meta?.edit) continue
      const replacing = field.replaces && meta.edit.label === field.replaces
      if (meta.edit.label !== name && !replacing) continue
      meta.edit.label = field.label
      if (field.description && (!meta.edit.description || replacing)) {
        meta.edit.description = field.description
      }
      if (field.editable === false) meta.edit.editable = false
      if (meta.list?.label === name) meta.list.label = field.label
      changed = true
    }

    if (changed) {
      const { uid: _uid, ...rest } = config
      await contentTypes.updateConfiguration(schema, rest)
    }
  }
}
