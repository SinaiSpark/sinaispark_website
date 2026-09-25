import { ROUTES } from "@/content/site"

/**
 * Research page copy. The articles themselves come from the CMS
 * (lib/content-api.ts): written there like blog posts, and optionally gated
 * behind an email address.
 */

/** Matches the CMS's market and topic lists. */
export type Market =
  | "Saudi Arabia"
  | "UAE"
  | "India"
  | "United Kingdom"
  | "Bahrain"
  | "GCC"
export type Topic = "Market entry" | "Licensing" | "Taxation" | "Compliance"

export const RESEARCH = {
  hero: {
    image: "/images/home/riyadh-skyline-kafd-dusk.jpg",
    crumb: "Research",
    headline: "Original research on entering the Kingdom, and beyond.",
    lede: "Annual outlooks, licence comparisons and cross-border tax guides, written from live casework at the ministries. Longer shelf life than the blog; deeper than a briefing.",
    primary: { label: "Browse the library", href: "#library" },
    secondary: { label: "New research by email", href: "#newsletter" },
    /** Labels for the counts computed from the published articles. */
    stats: {
      articles: "Articles",
      markets: "Markets covered",
      minutes: "Minutes of reading",
    },
  },

  spy: [
    { id: "featured", label: "Featured" },
    { id: "library", label: "Library" },
    { id: "method", label: "How we research" },
    { id: "newsletter", label: "Updates" },
  ],
  spyExtra: { label: "The blog", href: ROUTES.blog },

  featured: {
    eyebrow: "Featured research",
    gatedNote: "Free with your email",
    primary: "Read the research",
    link: (n: number) => `See all ${n} articles`,
  },

  library: {
    eyebrow: "Library",
    headline: "Every article, by market and topic.",
    marketLabel: "Market",
    topicLabel: "Topic",
    all: "All",
    count: (shown: number, total: number) => `${shown} of ${total} articles`,
    empty: "No article matches both filters yet.",
    /** Before the first article is published. */
    none: "The first articles are being written.",
    reset: "Clear filters",
    gatedLabel: "Email to read",
    read: "Read",
    /** Markets in the order the chips list them; empty ones are left out. */
    markets: [
      "Saudi Arabia",
      "UAE",
      "India",
      "United Kingdom",
      "Bahrain",
      "GCC",
    ] as const satisfies readonly Market[],
    topics: [
      "Market entry",
      "Licensing",
      "Taxation",
      "Compliance",
    ] as const satisfies readonly Topic[],
  },

  /** The email gate under a gated article's preview. */
  gate: {
    eyebrow: "Keep reading",
    headline: "The full article is free with your email.",
    body: "Enter your email and the rest opens straight away, along with every other gated article on this site.",
    emailLabel: "Work email",
    placeholder: "you@company.com",
    newsletter: "Also email me when new research is published",
    submit: "Read the full article",
    disclaimer:
      "We use your email to open the article. The newsletter is only sent if you tick the box.",
    failure: "We couldn't open the article just now. Please try again.",
  },

  /** Around the text on an article page. */
  article: {
    back: "All research",
    more: "More research",
    ctaHeadline: "Want this applied to your company?",
    ctaBody:
      "Every article comes from live casework. Bring it to a free consultation and we'll walk through your case.",
    cta: { label: "Book a free consultation", href: ROUTES.consult },
  },

  method: {
    eyebrow: "How we research",
    headline: "Regulation first, then what the ministries actually do.",
    lede: "Every report is built the same way, so a reader in Dubai and a reader in London get the same footing.",
    steps: [
      {
        title: "Primary regulation",
        body: "The law, the implementing regulations and the ministerial decisions, read in Arabic and cross-checked against the official English where one exists.",
      },
      {
        title: "Ministry practice",
        body: "How MISA, the Ministry of Commerce, ZATCA and the labour offices apply it this quarter, which is not always what the text says.",
      },
      {
        title: "Client casework",
        body: "Anonymised timelines and outcomes from our own files, so the numbers are what happened, not what was promised.",
      },
    ],
  },

  newsletter: {
    eyebrow: "New reports first",
    headline: "One email per publication.",
    lede: "When a report is finished you hear about it first, gated ones included. No newsletters in between.",
    picks: [
      "Annual outlook each autumn",
      "Licence and tax guides as the rules change",
      "Reply to any email and reach the author",
    ],
  },

  cta: {
    eyebrow: "Beyond the report",
    headline: "The research is the map. We walk the route with you.",
    lede: "Everything in the library comes from live casework. Bring the report to a free consultation and we apply it to your case.",
    secondary: { label: "Read the blog", href: ROUTES.blog },
    primary: { label: "Book a free consultation", href: ROUTES.consult },
  },
} as const
