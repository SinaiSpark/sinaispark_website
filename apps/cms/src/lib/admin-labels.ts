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
const ORDER: Field = {
  label: "Order",
  description:
    "Lower numbers come first. Steps of 10 leave room to slot one in.",
}
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
  "api::event.event": {
    ...COMMON,
    cover: {
      label: "Cover image",
      description: "The main photo, on the card and behind the title.",
    },
    role: {
      label: "Our role",
      description:
        "Organised: an event we hosted. Attended: one our team went to or spoke at.",
    },
    format: { label: "Format" },
    summary: {
      label: "Summary",
      description: "One or two sentences, shown under the title and on cards.",
    },
    startDate: {
      label: "Date",
      description:
        "The (first) day of the event. Future dates are listed under Coming up.",
    },
    endDate: {
      label: "End date",
      description: "Only for events longer than a day.",
    },
    city: { label: "City" },
    venue: { label: "Venue", description: "Optional, e.g. Hilton Riyadh." },
    gallery: {
      label: "Photos and video clips",
      description:
        "Drag in as many as you like, in the order they should appear. Add alt text to each photo in the media library.",
    },
    videos: {
      label: "YouTube or Vimeo videos",
      description:
        "Paste the video's link as you copy it from the browser or the Share button.",
    },
    highlights: {
      label: "In numbers",
      description:
        "Up to four figures shown above the write-up, e.g. 120 + Attendees.",
    },
    body: {
      label: "Write-up",
      description: "Optional. What happened, who spoke, what we took away.",
    },
    registrationUrl: {
      label: "Registration link",
      description:
        "For upcoming events: the organiser's sign-up page. Shown until the event has passed.",
    },
    publishAt: PUBLISH_AT,
    featured: FEATURED,
    seo: SEO,
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
  "api::faq.faq": {
    question: { label: "Question" },
    answer: { label: "Answer" },
    category: {
      label: "Category",
      description: "The heading it sits under on the FAQ page.",
    },
    order: ORDER,
    pages: {
      label: "Also show on",
      description:
        "Every published question is on the FAQ page. Pick pages here to show it in their FAQ section too.",
    },
  },
  "api::team-member.team-member": {
    name: {
      label: "Name",
      description: 'Leave empty to show "Name pending" until it is confirmed.',
    },
    role: { label: "Role" },
    bio: { label: "Short bio", description: "One sentence." },
    photo: {
      label: "Photo",
      description: "Portrait, 4:5. Without one the card shows the brand mark.",
    },
    linkedin: { label: "LinkedIn profile URL" },
    order: ORDER,
  },
  "api::testimonial.testimonial": {
    quote: {
      label: "Review text",
      description:
        "Reviews without text aren't shown on the site. Long ones are cut to six lines on the card; the link opens the full review.",
      replaces: "Quote",
    },
    name: {
      label: "Name",
      description: "As shown on the card, e.g. Ahmed K.",
    },
    rating: { label: "Stars (1–5)" },
    role: {
      label: "Role and company",
      description:
        'Optional. Google reviews show "Google review" here instead.',
    },
    market: { label: "Market", description: "Optional, e.g. Saudi Arabia." },
    source: {
      label: "Source",
      description: "Google for imported reviews, Manual for ones added here.",
    },
    reviewUrl: {
      label: "Link to the review",
      description:
        "Clicking the card opens this in a new tab. Set for every imported Google review; optional for manual ones.",
    },
    reviewDate: {
      label: "Review date",
      description:
        'For imported Google reviews this is approximate: Google only shows "4 months ago".',
    },
    googleReviewId: {
      label: "Google review ID",
      description: "Set by the import, so a review is never imported twice.",
      editable: false,
    },
    order: ORDER,
  },
  "api::home-page.home-page": {
    stats: {
      label: "Track record stats",
      description:
        "The figures that count up on the home page, up to four. Suffix is what follows the number, e.g. + or %.",
    },
  },
  "api::contact-detail.contact-detail": {
    email: { label: "Email" },
    phone: {
      label: "Phone",
      description: "As it should read, e.g. +966 51 001 3160.",
    },
    whatsapp: {
      label: "WhatsApp number",
      description:
        "Digits only with the country code, e.g. 966510013160. Empty hides WhatsApp.",
    },
    linkedin: { label: "LinkedIn URL", description: "Empty hides it." },
    instagram: { label: "Instagram URL", description: "Empty hides it." },
    youtube: { label: "YouTube URL", description: "Empty hides it." },
    offices: {
      label: "Offices",
      description: "The office tiles on the contact page, in this order.",
    },
    placeholder: {
      label: "Still placeholder details",
      description:
        "On: the contact page marks the phone and addresses as pending. Switch off once the real details are in.",
    },
  },
  "api::enquiry.enquiry": {
    fullName: { label: "Name" },
    service: { label: "Needs" },
    leadStatus: { label: "Status" },
    page: { label: "Came from" },
    notes: { label: "Notes", description: "Private to the team." },
    channel: {
      label: "Channel",
      description: "The contact form, or a conversation with the assistant.",
    },
    topics: {
      label: "Assistant topics",
      description: "The menu options the visitor picked in the assistant.",
    },
    transcript: {
      label: "Assistant conversation",
      description: "The whole chat, kept up to date while it continues.",
    },
  },
  "api::assistant-topic.assistant-topic": {
    question: {
      label: "Option",
      description:
        "The button the visitor taps, worded as they'd ask it. Keep it short.",
    },
    answer: {
      label: "Answer",
      description:
        'What the assistant replies, word for word. Start a line with "- " for a bullet or "1. " for a numbered step; wrap words in ** for bold.',
    },
    alsoAsked: {
      label: "Also asked as",
      description:
        "Other ways people type this question, one per line. A typed question close to any of them gets this answer.",
    },
    parent: {
      label: "Shown after",
      description:
        "The topic whose answer offers this one as a next option. Leave empty to show it on the first menu.",
    },
    children: { label: "Next options" },
    order: ORDER,
    linkLabel: {
      label: "Link text",
      description: "Optional link under the answer, e.g. to the service page.",
    },
    linkUrl: {
      label: "Link address",
      description: "A page on the site, such as /services/compliance/.",
    },
    action: {
      label: "Button",
      description: "The button under the answer.",
    },
    service: {
      label: "Service",
      description:
        "Preselected on the contact form when the visitor continues there.",
    },
    market: {
      label: "Market",
      description:
        "Preselected on the contact form when the visitor continues there.",
    },
  },
  "api::assistant-setting.assistant-setting": {
    enabled: {
      label: "Show the assistant",
      description: "Off hides it on every page.",
    },
    name: { label: "Name", description: "What the assistant calls itself." },
    greeting: {
      label: "Greeting",
      description: "The first message, above the menu.",
    },
    fallback: {
      label: "When it can't answer",
      description:
        "Shown when a question isn't covered by the site or the documents, next to the consultation and WhatsApp buttons.",
    },
    whatsappLabel: { label: "WhatsApp button text" },
  },
  "api::knowledge-document.knowledge-document": {
    title: { label: "Title" },
    file: {
      label: "File",
      description: "A PDF, Word (.docx), text or Markdown file.",
    },
    text: {
      label: "Text",
      description: "Or paste the content here. Both are used if you fill both.",
    },
    link: {
      label: "Link for answers",
      description:
        "Optional page the assistant can point to when it uses this document.",
    },
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
