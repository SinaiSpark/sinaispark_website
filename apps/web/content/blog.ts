import { ROUTES } from "@/content/site"

/**
 * Blog page copy. The posts themselves come from the CMS (lib/content-api.ts).
 */

export type PostFormat = "Regulatory update" | "Guide" | "Market news"

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
    /** Before the first post is published. */
    none: "The first posts are on their way.",
    reset: "Show all posts",
  },

  /** Around the text on a post page. */
  article: {
    back: "All posts",
    more: "More from the blog",
    ctaHeadline: "Does this change touch your company?",
    ctaBody:
      "A free call is faster than reading about it. Tell us your set-up and we'll tell you what to do.",
    cta: { label: "Book a free consultation", href: ROUTES.consult },
  },

  featuredTag: "Latest",
  allPosts: "All posts",

  formats: [
    "Regulatory update",
    "Guide",
    "Market news",
  ] as const satisfies readonly PostFormat[],

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
