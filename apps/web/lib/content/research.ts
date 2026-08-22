import type { ImageKey } from "@/lib/images"

/**
 * Research landing page content (revised doc §8) — a dedicated home for
 * original research and reports, visually distinct from the Blog.
 * PENDING_CLIENT_DATA: no reports exist yet; the page ships with an honest
 * empty state until the first publication lands.
 */

export interface Report {
  slug: string
  title: string
  summary: string
  market: "Saudi Arabia" | "UAE" | "UK" | "India" | "Bahrain"
  topic: "Licensing" | "Compliance" | "Taxation" | "Visas" | "Market Entry"
  date: string
  readTime: string
  /** Gated reports require an email before download (tooling TBD, plan §9). */
  gated: boolean
  imageKey?: ImageKey
}

/** Placeholder catalog — replaced when real publications arrive. */
export const REPORTS: Report[] = [
  {
    slug: "saudi-foreign-investment-misa-outlook-2026",
    title: "Saudi Arabia Foreign Investment & MISA Licensing Outlook 2026-2027",
    summary:
      "Annual flagship analysis of foreign capital inflows, regulatory streamlining under Vision 2030, and licensing volume trends across Riyadh, Jeddah, and the Eastern Province.",
    market: "Saudi Arabia",
    topic: "Market Entry",
    date: "2026-08-01",
    readTime: "24-Page Whitepaper · 18 min read",
    gated: true,
    imageKey: "homeHero",
  },
  {
    slug: "100-percent-foreign-ownership-saudi-law",
    title:
      "Complete Guide to 100% Foreign Ownership under the New Saudi Investment Law",
    summary:
      "A comprehensive legal breakdown of full foreign equity ownership, negative list exemptions, and fast-track MISA approvals for international corporations.",
    market: "Saudi Arabia",
    topic: "Licensing",
    date: "2026-07-20",
    readTime: "12 min read",
    gated: false,
    imageKey: "countrySaudiArabia",
  },
  {
    slug: "cross-border-tax-fema-guide-nri-india",
    title: "Cross-Border Tax & FEMA Guide for Gulf NRIs Investing in India",
    summary:
      "Navigating NRE/NRO account compliance, Double Tax Avoidance Agreements (DTAA), and RBI profit repatriation mechanisms for Gulf-based entrepreneurs.",
    market: "India",
    topic: "Taxation",
    date: "2026-07-10",
    readTime: "15 min read",
    gated: true,
    imageKey: "indiaMumbai",
  },
  {
    slug: "industrial-manufacturing-dammam-jubail",
    title:
      "Setting Up Industrial & Manufacturing Operations in Dammam & Jubail",
    summary:
      "Site selection, MODON industrial land allocation, customs exemptions, and environmental permits for manufacturing plants in the Eastern Province.",
    market: "Saudi Arabia",
    topic: "Market Entry",
    date: "2026-06-28",
    readTime: "18 min read",
    gated: false,
    imageKey: "regionalDammam",
  },
  {
    slug: "commercial-vs-service-licenses-riyadh",
    title:
      "Commercial vs Service Licenses in Riyadh: Cost & Timeline Comparison",
    summary:
      "Comparative analysis of capital requirements, qualification criteria, and government fee schedules between commercial trade and professional services.",
    market: "Saudi Arabia",
    topic: "Licensing",
    date: "2026-06-15",
    readTime: "8 min read",
    gated: false,
    imageKey: "regionalJeddah",
  },
  {
    slug: "rhq-program-saudi-arabia-tax-holidays",
    title:
      "Regional Headquarters (RHQ) Program in Saudi Arabia: Eligibility & Tax Holidays",
    summary:
      "Requirements for multinational corporations establishing Middle East regional HQs in Riyadh, including the 30-year 0% corporate tax holiday package.",
    market: "Saudi Arabia",
    topic: "Compliance",
    date: "2026-06-02",
    readTime: "20 min read",
    gated: true,
    imageKey: "aboutTeam",
  },
  {
    slug: "uae-bahrain-expansion-playbook",
    title: "UAE & Bahrain Expansion Playbook for Established Saudi Entities",
    summary:
      "Cross-GCC operational scaling, dual-licensing opportunities, and streamlined customs clearances across Riyadh, Dubai, and Manama.",
    market: "UAE",
    topic: "Market Entry",
    date: "2026-05-18",
    readTime: "10 min read",
    gated: false,
    imageKey: "countryUae",
  },
]

export const MARKETS = [
  "Saudi Arabia",
  "UAE",
  "UK",
  "India",
  "Bahrain",
] as const
export const TOPICS = [
  "Licensing",
  "Compliance",
  "Taxation",
  "Visas",
  "Market Entry",
] as const
