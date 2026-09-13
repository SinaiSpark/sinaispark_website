import { ROUTES } from "@/content/site"

/**
 * Blog copy.
 *
 * PENDING_CLIENT_DATA: the posts below are sample entries written to show the
 * three formats the blog runs and the range of markets it covers. Nothing here
 * has been published, there are no article pages yet, and the page says so —
 * replace `posts` when the editorial calendar is agreed.
 */

export type PostFormat = "Regulatory update" | "Guide" | "Market news"

export interface Post {
  format: PostFormat
  market: string
  image: string
  date: string
  readTime: string
  title: string
  excerpt: string
}

export const BLOG = {
  hero: {
    image: "/images/services/service-legal.jpg",
    crumb: "Blog",
    headline: "Regulatory updates, before they become problems.",
    lede: "Short, practical notes from the desk: what changed at the ministries this week, how it affects a foreign-owned company, and what to do about it.",
    primary: { label: "Get the updates by email", href: "#newsletter" },
    secondary: { label: "Deeper reading: research", href: ROUTES.research },
    stats: [
      { value: 3, label: "Formats" },
      { value: 5, label: "Markets covered" },
      { text: "Weekly", label: "Publishing rhythm" },
    ],
  },

  filter: {
    all: "All posts",
    /** Plural labels for the format pills; the singular is the post's own tag. */
    labels: {
      "Regulatory update": "Regulatory updates",
      Guide: "Guides",
      "Market news": "Market news",
    } as Record<PostFormat, string>,
    count: (n: number) => `${n} ${n === 1 ? "post" : "posts"}`,
    empty: "Nothing in this format yet.",
    reset: "Show all posts",
  },

  featuredTag: "Latest",
  allPosts: "All posts",
  note: "Sample posts — editorial calendar and article pages pending",

  formats: [
    "Regulatory update",
    "Guide",
    "Market news",
  ] as const satisfies readonly PostFormat[],

  posts: [
    {
      format: "Regulatory update",
      market: "Saudi Arabia",
      image: "/images/home/riyadh-skyline-kafd-dusk.jpg",
      date: "12 Sep 2026",
      readTime: "6 min",
      title:
        "MISA moves more licence renewals online: what changes for foreign-owned LLCs",
      excerpt:
        "The renewal window, the documents that are no longer requested, and the one attestation that still has to happen in person.",
    },
    {
      format: "Guide",
      market: "Saudi Arabia",
      image: "/images/services/service-pro-visa.jpg",
      date: "4 Sep 2026",
      readTime: "9 min",
      title:
        "Nitaqat explained: how Saudization bands shape your first ten hires",
      excerpt:
        "Why the colour of your band decides how fast you can bring in visas, and how to plan the first hires around it.",
    },
    {
      format: "Regulatory update",
      market: "Saudi Arabia",
      image: "/images/services/service-compliance.jpg",
      date: "28 Aug 2026",
      readTime: "5 min",
      title: "ZATCA e-invoicing: is your entity in the next integration wave?",
      excerpt:
        "Which revenue thresholds trigger the next phase, what the integration actually requires and how long it takes.",
    },
    {
      format: "Market news",
      market: "UAE",
      image: "/images/countries/uae-dubai.jpg",
      date: "19 Aug 2026",
      readTime: "7 min",
      title:
        "UAE corporate tax, year two: what Saudi-headquartered groups are asking",
      excerpt:
        "Transfer pricing files, free-zone qualifying income and the questions that come up when the group runs from Riyadh.",
    },
    {
      format: "Guide",
      market: "India",
      image: "/images/india/mumbai-business-district.jpg",
      date: "8 Aug 2026",
      readTime: "8 min",
      title:
        "MCA V3 filings for NRI directors: the three forms that stall incorporations",
      excerpt:
        "DIR-3, INC-9 and the apostille chain, and how a Gulf-resident director gets through all three without flying.",
    },
    {
      format: "Market news",
      market: "Saudi Arabia",
      image: "/images/countries/saudi-arabia-riyadh.jpg",
      date: "30 Jul 2026",
      readTime: "6 min",
      title:
        "RHQ programme momentum: why more multinationals are moving the regional seat to Riyadh",
      excerpt:
        "The tax holiday is the headline; the practical draw is procurement access. What the move involves on the ground.",
    },
    {
      format: "Guide",
      market: "Saudi Arabia",
      image: "/images/services/service-legal.jpg",
      date: "22 Jul 2026",
      readTime: "7 min",
      title:
        "Bilingual contracts in the Kingdom: which version wins when the Arabic and English disagree",
      excerpt:
        "Governing-language clauses, court practice and the drafting habits that keep both versions saying the same thing.",
    },
  ] satisfies Post[],

  /**
   * The recurring Saudi filing calendar, beside the featured post. It is the
   * one piece of reference on the page that does not go out of date, and it
   * earns the compliance link under it.
   */
  rhythm: {
    kicker: "Filing rhythm · Saudi Arabia",
    headline: "What a compliant company files, and how often.",
    footnote: "Our compliance service tracks every one of these for clients.",
    link: { label: "How it works", href: ROUTES.service("compliance") },
    items: [
      {
        cadence: "Monthly",
        title: "GOSI contributions",
        body: "Social insurance for every registered employee, due each month.",
      },
      {
        cadence: "Monthly / quarterly",
        title: "ZATCA VAT return",
        body: "Filing frequency follows annual taxable supplies.",
      },
      {
        cadence: "Quarterly",
        title: "Nitaqat band review",
        body: "Saudization ratio recalculated; visa quota follows it.",
      },
      {
        cadence: "Annual",
        title: "CR and licence renewals",
        body: "Commercial registration, MISA licence, Chamber membership.",
      },
    ],
  },

  newsletter: {
    eyebrow: "Updates by email",
    headline: "One email when something changes.",
    lede: "Regulatory updates as they land, guides when we finish them. Nothing else.",
    picks: [
      "Ministry changes, explained in plain English within the week",
      "Guides written from live casework, not press releases",
      "Unsubscribe in one click",
    ],
  },

  deeper: {
    eyebrow: "Deeper reading",
    headline: "When a blog post is not enough.",
    kicker: "Research & insights",
    title: "Original reports on entering the Kingdom and beyond",
    body: "Annual outlooks, licence comparisons and cross-border tax guides.",
    href: ROUTES.research,
  },

  cta: {
    eyebrow: "Something changed for you?",
    headline: "Ask us what it means.",
    lede: "If a ministry update touches your company, a free call is faster than reading about it.",
    secondary: { label: "Read the research", href: ROUTES.research },
    primary: { label: "Book a free consultation", href: ROUTES.consult },
  },
} as const
