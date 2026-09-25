import { ROUTES } from "@/content/site"

/**
 * Copy for the two hub pages (services, licences) and the shared per-page
 * furniture: scroll-spy labels, the licence comparison matrix and the
 * "up next" block on detail pages.
 *
 * The per-service and per-licence bodies themselves live in content/services.ts,
 * which is the client-approved source and is rendered as-is.
 */

/** Short labels used by the scroll-spy bar and sibling cards. */
export const SHORT_TITLES: Record<string, string> = {
  "administrative-solutions": "Business setup",
  "legal-services": "Legal advisory",
  "pro-visa-services": "PRO & visa",
  compliance: "Compliance",
  "property-management": "Property",
  "commercial-license": "Commercial",
  "industrial-license": "Industrial",
  "entrepreneurial-license": "Entrepreneurial",
  "service-license": "Service",
  "real-estate-license": "Real estate",
}

/** Hero/section imagery per slug, mapped to the repo's own assets. */
export const SLUG_IMAGE: Record<string, string> = {
  "administrative-solutions": "/images/services/service-business-setup.jpg",
  "legal-services": "/images/services/service-legal.jpg",
  "pro-visa-services": "/images/services/service-pro-visa.jpg",
  compliance: "/images/services/service-compliance.jpg",
  "property-management": "/images/services/service-property.jpg",
  "commercial-license": "/images/countries/saudi-arabia-riyadh.jpg",
  "industrial-license": "/images/regional/dammam-waterfront.jpg",
  "entrepreneurial-license": "/images/services/service-business-setup.jpg",
  "service-license": "/images/about/team-strategy-meeting.jpg",
  "real-estate-license": "/images/services/service-property.jpg",
}

export const CORE_SLUGS = [
  "administrative-solutions",
  "legal-services",
  "pro-visa-services",
  "compliance",
  "property-management",
] as const

export const LICENCE_SLUGS = [
  "commercial-license",
  "industrial-license",
  "entrepreneurial-license",
  "service-license",
  "real-estate-license",
] as const

export const SERVICES_PAGE = {
  crumb: "Core service",
  headline: "Everything between the idea and the licence.",
  lede: "Five services, one accountable team: from the first MISA filing to the day-to-day of running a compliant company in the Kingdom and beyond.",
  hero: "/images/services/service-business-setup.jpg",
  meta: [
    { value: 5, label: "Services" },
    { value: 5, label: "Markets" },
    { value: 1, label: "Point of contact" },
  ],
  spyExtra: { label: "Licences", href: ROUTES.licences },
  teaser: {
    eyebrow: "Business licensing",
    headline: "Five licence classes. One right answer.",
    cta: { label: "Compare the licences", href: ROUTES.licences },
  },
  sectionCtas: {
    consult: { label: "Book a free consultation", href: ROUTES.consult },
    full: "Read the full page",
    compare: {
      label: "Compare the five licence classes",
      href: ROUTES.licences,
    },
  },
} as const

export const LICENCES_PAGE = {
  crumb: "Business licensing",
  headline: "Five licence classes. One right answer.",
  lede: "Saudi Arabia issues five distinct foreign-investment licence classes. Picking the wrong one costs months later, so we start every engagement by matching your activity and capital to the right class.",
  primary: { label: "Find my licence", href: "#finder" },
  secondary: { label: "Compare all five", href: "#matrix" },
  spyExtra: { label: "Services", href: ROUTES.services },
  matrix: {
    eyebrow: "Side by side",
    headline: "The five classes, compared.",
    lede: "What each licence is for, who has to approve it, and what it unlocks. Hover a column to follow one licence down the table.",
    scrollHint: "Scroll sideways to compare →",
    rows: {
      ownership: "Ownership & capital",
      regulators: "Regulators involved",
      issued: "How it is issued",
      highlights: "Highlights",
      where: "Where",
    },
    readCta: "Read the licence",
  },
} as const

/** Per-licence facts shown in the matrix and on each licence page. */
export const LICENCE_FACTS: Record<
  string,
  { audience: string; ownership: string; regulators: string[] }
> = {
  "commercial-license": {
    audience: "Wholesale, retail and general trading",
    ownership: "Full foreign trading allowed",
    regulators: ["MISA", "Ministry of Commerce", "Chamber of Commerce"],
  },
  "industrial-license": {
    audience: "Manufacturing, fabrication and industrial sites",
    ownership: "100% foreign ownership",
    regulators: [
      "MISA",
      "Ministry of Industry (MIM)",
      "MODON / Royal Commission",
    ],
  },
  "entrepreneurial-license": {
    audience: "Venture-backed startups and first-time founders",
    ownership: "Zero minimum capital deposit",
    regulators: ["MISA startup portal"],
  },
  "service-license": {
    audience: "IT, engineering, consulting, healthcare, education",
    ownership: "100% equity for professional services",
    regulators: ["MISA", "Sector ministries", "Balady"],
  },
  "real-estate-license": {
    audience: "Property investment, development and asset holding",
    ownership: "Institutional asset holding",
    regulators: ["REGA", "MISA", "Ministry of Justice"],
  },
}

/** Section labels for the per-service and per-licence pages. */
export const DETAIL_PAGE = {
  spy: [
    { id: "overview", label: "Overview" },
    { id: "process", label: "How it runs" },
    { id: "where", label: "Where" },
    { id: "faq", label: "FAQ" },
    { id: "next", label: "Up next" },
  ],
  overviewHeading: {
    service: "What the service covers.",
    licence: "What the licence is for.",
  },
  blocks: {
    included: "What's included",
    regulators: "Regulators involved",
  },
  note: {
    service: {
      title: "One accountable team, start to finish.",
      body: "You get a single point of contact who owns the timeline, the filings and the follow-ups, so nothing falls between departments.",
    },
    licenceBody:
      "Activity and capital decide the final class. We confirm the fit at the free consultation before anything is filed.",
  },
  process: {
    eyebrow: "How it runs",
    headline: (n: number) => `${n} steps, one owner.`,
    stepLabel: "Step",
    cta: { label: "Start with a free consultation", href: ROUTES.consult },
    note: "Realistic timelines are confirmed at the first call.",
  },
  where: {
    eyebrow: "Where we deliver it",
    single: (name: string) => `On the ground in ${name}.`,
    many: (n: number) => `Delivered across ${n} locations.`,
    link: { label: "See Sinai Spark India", href: ROUTES.india },
  },
  faq: {
    eyebrow: "FAQ",
    headline: (subject: string) => `Questions about ${subject}.`,
    lede: "Short answers here; the full set lives on the homepage FAQ.",
    link: { label: "All FAQs", href: ROUTES.faq },
  },
  next: {
    eyebrow: "Up next",
    headline: {
      service: "The rest of the practice.",
      licence: "The other licence classes.",
    },
    kicker: { service: "Next service", licence: "Next licence" },
    readCta: "Read",
    openCta: "Open",
    allCta: {
      service: "All five services",
      licence: "Compare all five licences",
    },
  },
} as const

/**
 * Which market tiles a slug's "Where" section shows, derived from the
 * jurisdictions in content/services.ts.
 */
export const PLACES: Record<
  string,
  {
    name: string
    kicker: string
    image: string
    timeZone: string
    body: string
  }
> = {
  saudi: {
    name: "Saudi Arabia",
    kicker: "Flagship market",
    image: "/images/countries/saudi-arabia-riyadh.jpg",
    timeZone: "Asia/Riyadh",
    body: "Our flagship market. Complete business setup, licensing, PRO and compliance support across Riyadh, Jeddah and Dammam.",
  },
  riyadh: {
    name: "Riyadh",
    kicker: "Capital",
    image: "/images/countries/saudi-arabia-riyadh.jpg",
    timeZone: "Asia/Riyadh",
    body: "The Kingdom's capital and economic centre. Licensing, PRO and GRO services, and project support.",
  },
  jeddah: {
    name: "Jeddah",
    kicker: "Trade gateway",
    image: "/images/regional/jeddah-corniche.jpg",
    timeZone: "Asia/Riyadh",
    body: "Tax, compliance and corporate advisory for import- and export-facing businesses.",
  },
  dammam: {
    name: "Dammam & Jubail",
    kicker: "Industrial hub",
    image: "/images/regional/dammam-waterfront.jpg",
    timeZone: "Asia/Riyadh",
    body: "The Eastern Province's industrial hub. Complete legal and operational support.",
  },
  uae: {
    name: "United Arab Emirates",
    kicker: "Gulf hub",
    image: "/images/countries/uae-dubai.jpg",
    timeZone: "Asia/Dubai",
    body: "Market entry across the Gulf's commercial hub. A full UAE practice page is in preparation.",
  },
  uk: {
    name: "United Kingdom",
    kicker: "Europe",
    image: "/images/countries/uk-london.jpg",
    timeZone: "Europe/London",
    body: "UK expansion and compliance support for international businesses.",
  },
  india: {
    name: "India",
    kicker: "Sinai Spark India",
    image: "/images/india/mumbai-business-district.jpg",
    timeZone: "Asia/Kolkata",
    body: "Private Limited, LLP or OPC incorporation — fully online and NRI friendly.",
  },
  bahrain: {
    name: "Bahrain",
    kicker: "GCC",
    image: "/images/countries/bahrain-manama.jpg",
    timeZone: "Asia/Bahrain",
    body: "GCC market entry with local insight. A dedicated Bahrain page is in preparation.",
  },
  gcc: {
    name: "GCC cross-border",
    kicker: "Regional",
    image: "/images/countries/uae-dubai.jpg",
    timeZone: "Asia/Dubai",
    body: "Cross-border structuring and compliance across the Gulf Cooperation Council states.",
  },
}

/** Maps a jurisdiction string from content/services.ts onto PLACES keys. */
export function placesFor(jurisdictions: readonly string[]) {
  const keys: string[] = []
  const add = (k: string) => {
    if (!keys.includes(k)) keys.push(k)
  }
  for (const j of jurisdictions) {
    const cities = j.match(/^Saudi Arabia \((.+)\)$/)?.[1] ?? ""
    if (cities && !/Flagship/.test(cities)) {
      if (/Riyadh/.test(cities)) add("riyadh")
      if (/Jeddah/.test(cities)) add("jeddah")
      if (/Dammam|Jubail/.test(cities)) add("dammam")
      continue
    }
    if (/^Saudi Arabia/.test(j)) add("saudi")
    else if (/UAE/.test(j)) add("uae")
    else if (/UK/.test(j)) add("uk")
    else if (/India/.test(j)) add("india")
    else if (/Bahrain/.test(j)) add("bahrain")
    else if (/GCC/.test(j)) add("gcc")
  }
  return keys.flatMap((k) => PLACES[k] ?? [])
}

/** Which FAQs each detail page shows, by index into content/faqs.ts. */
export const FAQ_PICK: Record<string, number[]> = {
  "administrative-solutions": [0, 1, 3, 5],
  "legal-services": [0, 3, 6, 2],
  "pro-visa-services": [4, 5, 6, 1],
  compliance: [5, 4, 6, 0],
  "property-management": [3, 6, 1, 0],
  "commercial-license": [2, 0, 1, 3],
  "industrial-license": [3, 2, 1, 0],
  "entrepreneurial-license": [2, 1, 0, 3],
  "service-license": [2, 3, 0, 1],
  "real-estate-license": [2, 3, 6, 1],
}
