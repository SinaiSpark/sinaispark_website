import { ROUTES } from "@/content/site"

/**
 * Research page copy.
 *
 * The report titles and summaries come from the approved content document
 * (§8). PENDING_CLIENT_DATA: none of them has been published yet, so the
 * catalogue is illustrative, page counts are indicative, and every card leads
 * to the contact page rather than a download.
 */

export type Market = "Saudi Arabia" | "UAE" | "India"
export type Topic = "Market entry" | "Licensing" | "Taxation" | "Compliance"

export interface Report {
  title: string
  summary: string
  market: Market
  topic: Topic
  date: string
  readTime: string
  /** Indicative length; drives the outlined numeral on the card. */
  pages: number
  /** Gated reports ask for an email before the download (provider TBD). */
  gated: boolean
  image: string
}

export const REPORTS: Report[] = [
  {
    title: "Saudi Arabia Foreign Investment & MISA Licensing Outlook 2026–2027",
    summary:
      "Annual flagship analysis of foreign capital inflows, regulatory streamlining under Vision 2030, and licensing volume trends across Riyadh, Jeddah and the Eastern Province.",
    market: "Saudi Arabia",
    topic: "Market entry",
    date: "Aug 2026",
    readTime: "18 min",
    pages: 24,
    gated: true,
    image: "/images/home/riyadh-skyline-kafd-dusk.jpg",
  },
  {
    title:
      "Complete Guide to 100% Foreign Ownership under the New Saudi Investment Law",
    summary:
      "A comprehensive legal breakdown of full foreign equity ownership, negative-list exemptions and fast-track MISA approvals for international corporations.",
    market: "Saudi Arabia",
    topic: "Licensing",
    date: "Jul 2026",
    readTime: "12 min",
    pages: 16,
    gated: false,
    image: "/images/countries/saudi-arabia-riyadh.jpg",
  },
  {
    title: "Cross-Border Tax & FEMA Guide for Gulf NRIs Investing in India",
    summary:
      "Navigating NRE/NRO account compliance, Double Tax Avoidance Agreements and RBI profit repatriation mechanisms for Gulf-based entrepreneurs.",
    market: "India",
    topic: "Taxation",
    date: "Jul 2026",
    readTime: "15 min",
    pages: 20,
    gated: true,
    image: "/images/india/mumbai-business-district.jpg",
  },
  {
    title:
      "Setting Up Industrial & Manufacturing Operations in Dammam & Jubail",
    summary:
      "Site selection, MODON industrial land allocation, customs exemptions and environmental permits for manufacturing plants in the Eastern Province.",
    market: "Saudi Arabia",
    topic: "Market entry",
    date: "Jun 2026",
    readTime: "18 min",
    pages: 22,
    gated: false,
    image: "/images/regional/dammam-waterfront.jpg",
  },
  {
    title:
      "Commercial vs Service Licenses in Riyadh: Cost & Timeline Comparison",
    summary:
      "Comparative analysis of capital requirements, qualification criteria and government fee schedules between commercial trade and professional services.",
    market: "Saudi Arabia",
    topic: "Licensing",
    date: "Jun 2026",
    readTime: "8 min",
    pages: 10,
    gated: false,
    image: "/images/regional/jeddah-corniche.jpg",
  },
  {
    title:
      "Regional Headquarters (RHQ) Program in Saudi Arabia: Eligibility & Tax Holidays",
    summary:
      "Requirements for multinational corporations establishing Middle East regional HQs in Riyadh, including the 30-year 0% corporate tax holiday package.",
    market: "Saudi Arabia",
    topic: "Compliance",
    date: "Jun 2026",
    readTime: "20 min",
    pages: 26,
    gated: true,
    image: "/images/services/service-property.jpg",
  },
  {
    title: "UAE & Bahrain Expansion Playbook for Established Saudi Entities",
    summary:
      "Cross-GCC operational scaling, dual-licensing opportunities and streamlined customs clearances across Riyadh, Dubai and Manama.",
    market: "UAE",
    topic: "Market entry",
    date: "May 2026",
    readTime: "10 min",
    pages: 14,
    gated: false,
    image: "/images/countries/uae-dubai.jpg",
  },
]

const featured = REPORTS[0]!

export const RESEARCH = {
  hero: {
    image: "/images/home/riyadh-skyline-kafd-dusk.jpg",
    crumb: "Research",
    headline: "Original research on entering the Kingdom, and beyond.",
    lede: "Annual outlooks, licence comparisons and cross-border tax guides, written from live casework at the ministries. Longer shelf life than the blog; deeper than a briefing.",
    primary: { label: "Browse the library", href: "#library" },
    secondary: { label: "Get new reports first", href: "#newsletter" },
    stats: [
      { value: REPORTS.length, label: "Reports" },
      {
        value: REPORTS.reduce((total, report) => total + report.pages, 0),
        label: "Pages published",
      },
      {
        value: REPORTS.filter((report) => report.gated).length,
        label: "Gated",
      },
    ],
  },

  spy: [
    { id: "featured", label: "Featured" },
    { id: "library", label: "Library" },
    { id: "method", label: "How we research" },
    { id: "newsletter", label: "Updates" },
  ],
  spyExtra: { label: "The blog", href: ROUTES.blog },

  featured: {
    eyebrow: "Featured report",
    report: featured,
    /** The mock cover in the hero of the section. */
    cover: {
      kicker: "Annual outlook",
      edition: "2026–27",
      footnote: "Riyadh · Jeddah · Eastern Province",
    },
    gatedNote: "Gated · email to download",
    inside: [
      "Foreign capital inflows by sector, with the licence class each one came in under.",
      "Where MISA processing times moved in the last twelve months, and why.",
      "What Vision 2030 programmes mean for the next two licensing cycles.",
    ],
    primary: { label: "Request the report", href: ROUTES.consult },
    link: { label: `See all ${REPORTS.length} reports`, href: "#library" },
  },

  library: {
    eyebrow: "Library",
    headline: "Every report, by market and topic.",
    note: "Catalogue is illustrative — first publications pending",
    marketLabel: "Market",
    topicLabel: "Topic",
    all: "All",
    count: (shown: number, total: number) => `${shown} of ${total} reports`,
    empty: "No report matches both filters yet.",
    reset: "Clear filters",
    gatedLabel: "Gated",
    request: "Request access",
    download: "Download",
    /** Both filters lead to the contact page: nothing is downloadable yet. */
    href: ROUTES.consult,
    markets: [
      "Saudi Arabia",
      "UAE",
      "India",
    ] as const satisfies readonly Market[],
    topics: [
      "Market entry",
      "Licensing",
      "Taxation",
      "Compliance",
    ] as const satisfies readonly Topic[],
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
