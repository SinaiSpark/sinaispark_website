import { ROUTES } from "@/content/site"

/**
 * "Research & insights" on the home page: one feature card and two rows.
 *
 * PENDING_CLIENT_DATA: the reports below are drawn from the research content
 * set and have no destination pages yet, so every card currently points at the
 * consultation anchor. Give an item a real `href` once the report exists.
 */

export interface Insight {
  tags: string[]
  title: string
  /** Feature card only. */
  summary?: string
  meta: string
  gated: boolean
  image: string
  href: string
}

export const INSIGHTS = {
  eyebrow: "Research & insights",
  headline: "What we're reading into.",
  cta: { label: "All research", href: ROUTES.contact },
  gatedLabel: "Gated",
  feature: {
    tags: ["Market entry", "Saudi Arabia"],
    title: "Saudi Arabia Foreign Investment & MISA Licensing Outlook 2026–2027",
    summary:
      "Annual flagship analysis of foreign capital inflows, regulatory streamlining under Vision 2030, and licensing volume trends across Riyadh, Jeddah and the Eastern Province.",
    meta: "24-page whitepaper · 18 min read",
    gated: true,
    image: "/images/home/riyadh-skyline-kafd-dusk.jpg",
    href: ROUTES.contact,
  } satisfies Insight,
  rows: [
    {
      tags: ["Licensing", "Saudi Arabia"],
      title:
        "Complete Guide to 100% Foreign Ownership under the New Saudi Investment Law",
      meta: "12 min read",
      gated: false,
      image: "/images/countries/saudi-arabia-riyadh.jpg",
      href: ROUTES.contact,
    },
    {
      tags: ["Taxation", "India"],
      title: "Cross-Border Tax & FEMA Guide for Gulf NRIs Investing in India",
      meta: "15 min read",
      gated: true,
      image: "/images/india/mumbai-business-district.jpg",
      href: ROUTES.contact,
    },
  ] satisfies Insight[],
}
