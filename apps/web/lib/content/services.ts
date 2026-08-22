import type { ImageKey } from "@/lib/images"

/**
 * Service page content — seeded from the client's revised content document
 * (§4). Dispute-support copy is scoped ONLY to Business Setup in Saudi
 * Arabia (developer note: never duplicate it onto Legal Services).
 */

export interface ServiceContent {
  slug: string
  /** Page H1 and <title> (without the site suffix). */
  title: string
  navTitle: string
  metaDescription: string
  keywords: string[]
  imageKey: ImageKey | null
  intro: string[]
  bullets: string[]
  /** Rendered only when true — see dispute-support scoping note above. */
  disputeSupport?: boolean
  closingNote?: { title: string; body: string }
}

const CONTENT: Record<string, Omit<ServiceContent, "slug">> = {
  "administrative-solutions": {
    title: "Business Setup in Saudi Arabia",
    navTitle: "Business Setup in Saudi Arabia",
    metaDescription:
      "Company formation and MISA registration in Saudi Arabia, handled end to end by Sinai Spark Global, including entity structuring and dispute support.",
    // PENDING_CLIENT_DATA — source document reads "end to start"; flagged for client confirmation.
    keywords: [
      "business setup Saudi Arabia",
      "MISA registration",
      "company formation Saudi Arabia",
      "entity structuring Saudi Arabia",
    ],
    imageKey: "serviceBusinessSetup",
    intro: [
      "This is usually the first page a new client reads closely, so it answers the practical question straight away: what does it actually take to get a company registered here? Sinai Spark Global manages the full formation process for foreign investors: MISA (Ministry of Investment) registration, commercial registration, and picking the right entity type for what the client is trying to build.",
      "It is a process that is easy to get wrong the first time and expensive to redo, which is why most clients hire it out rather than attempt it themselves.",
    ],
    bullets: [
      "MISA investment license registration",
      "Commercial registration (CR) with the Ministry of Commerce",
      "Entity structuring guidance: LLC, branch, or representative office",
      "Document preparation, attestation and government submission",
      "Dispute support guidance and referrals for contract or regulatory disputes that come up during market entry",
    ],
    disputeSupport: true,
  },
  "legal-services": {
    title: "Legal & Regulatory Advisory",
    navTitle: "Legal Services",
    metaDescription:
      "Contract review, regulatory interpretation and structuring advice from Sinai Spark Global, keeping compliance ahead of problems rather than reacting to them.",
    keywords: [
      "legal advisory Saudi Arabia",
      "regulatory compliance KSA",
      "contract review Saudi Arabia",
    ],
    imageKey: "serviceLegal",
    intro: [
      "Legal risk in Saudi Arabia is rarely dramatic. It tends to build up quietly, through a contract clause nobody checked or a filing requirement nobody flagged. This service exists to catch that early: reviewing contracts, interpreting regulation as it applies to the client's specific business, and staying involved in structuring decisions rather than only signing off at the end.",
    ],
    bullets: [
      "Contract drafting and review",
      "Regulatory interpretation and structuring advice",
      "Liaison support with government and legal bodies",
    ],
  },
  "commercial-license": {
    title: "Commercial License",
    navTitle: "Commercial License",
    metaDescription:
      "Commercial licensing in Saudi Arabia from Sinai Spark Global, matched to the right category from the start.",
    keywords: [
      "commercial license Saudi Arabia",
      "business license Saudi Arabia",
    ],
    imageKey: null,
    intro: [
      "For internationally established companies entering Saudi Arabia's commercial sector, the commercial license is the foundation of legal operation. Getting the category right from the start avoids rework later.",
    ],
    bullets: [
      "Eligibility assessment and activity selection",
      "Application preparation and Ministry submission",
      "Renewal tracking through our compliance service",
    ],
  },
  "industrial-license": {
    title: "Industrial License",
    navTitle: "Industrial License",
    metaDescription:
      "Industrial licensing in Saudi Arabia for foreign investors setting up manufacturing operations, with full foreign ownership available.",
    keywords: ["industrial license Saudi Arabia", "manufacturing license KSA"],
    imageKey: null,
    intro: [
      "For foreign investors setting up manufacturing operations, the industrial license opens Saudi Arabia's industrial sector, with full foreign ownership available for qualifying activities.",
    ],
    bullets: [
      "Manufacturing activity classification",
      "Coordination with relevant industrial authorities",
      "Site, staffing and compliance considerations at application stage",
    ],
  },
  "entrepreneurial-license": {
    title: "Entrepreneurial License",
    navTitle: "Entrepreneurial License",
    metaDescription:
      "The entrepreneurial license supports startups and first time founders establishing an entity in Saudi Arabia.",
    keywords: ["entrepreneurial license Saudi Arabia", "startup license KSA"],
    imageKey: null,
    intro: [
      "For startups and first time founders establishing an entity, the entrepreneurial license offers a structured entry point into the Saudi market.",
    ],
    bullets: [
      "Founder eligibility review",
      "Entity setup aligned to the license conditions",
      "Ongoing compliance from day one",
    ],
  },
  "service-license": {
    title: "Service License",
    navTitle: "Service License",
    metaDescription:
      "Service licensing in Saudi Arabia for companies delivering construction, technology, education, healthcare or tourism services.",
    keywords: [
      "service license Saudi Arabia",
      "professional services license KSA",
    ],
    imageKey: null,
    intro: [
      "For companies delivering services in construction, technology, education, healthcare or tourism, the service license matches the business to the correct regulated category.",
    ],
    bullets: [
      "Activity mapping across regulated service sectors",
      "Application preparation and authority liaison",
      "License condition briefing on approval",
    ],
  },
  "real-estate-license": {
    title: "Real Estate License",
    navTitle: "Real Estate License",
    metaDescription:
      "Real estate licensing in Saudi Arabia for property investment and development activity.",
    keywords: ["real estate license Saudi Arabia", "property license KSA"],
    imageKey: null,
    intro: [
      "For property investment and development activity, the real estate license regulates participation in one of the Kingdom's most active sectors.",
    ],
    bullets: [
      "Investment versus development activity structuring",
      "Regulatory approvals and registration",
      "Property management handoff where required",
    ],
  },
  "pro-visa-services": {
    title: "PRO & Visa Services",
    navTitle: "PRO & Visa Services",
    metaDescription:
      "Ongoing work visa processing, labor documentation and government liaison from Sinai Spark Global, so operations are never held up by an expired renewal.",
    keywords: [
      "PRO services Saudi Arabia",
      "visa processing KSA",
      "labor documentation Saudi Arabia",
    ],
    imageKey: "serviceProVisa",
    intro: [
      "Once a company is up and running, someone still has to keep the visas, labor documents and Ministry paperwork current. Sinai Spark Global takes on that ongoing government liaison (PRO) role, so a client's operations are never held up by an expired document or a renewal that slipped through.",
    ],
    bullets: [
      "Work visa processing and renewals",
      "Labor and immigration documentation",
      "Liaison with the Ministry of Labor and related bodies",
    ],
  },
  compliance: {
    title: "Compliance",
    navTitle: "Compliance",
    metaDescription:
      "Ongoing regulatory compliance, renewals and filing support in Saudi Arabia, tracked by Sinai Spark Global so nothing is missed after formation.",
    keywords: [
      "regulatory compliance Saudi Arabia",
      "business compliance KSA",
      "license renewal Saudi Arabia",
    ],
    imageKey: null,
    intro: [
      "Formation is a one time event. Staying compliant is not. This service tracks renewal dates, filing deadlines and regulatory changes on an ongoing basis, so clients do not have to keep a mental calendar of government requirements themselves.",
    ],
    bullets: [
      "License and registration renewals",
      "Ongoing regulatory monitoring",
      "Annual filing support",
    ],
  },
  "property-management": {
    title: "Property Management",
    navTitle: "Property Management",
    metaDescription:
      "Commercial and residential property management in Saudi Arabia from Sinai Spark Global, covering tenant relations, maintenance and day to day oversight.",
    keywords: [
      "property management Saudi Arabia",
      "commercial property management KSA",
      "residential property management Saudi Arabia",
    ],
    imageKey: "serviceProperty",
    intro: [
      "For clients who hold commercial or residential property in Saudi Arabia, this service covers tenant relations, maintenance oversight, and the general day to day running of the property, so ownership stays an investment rather than a second job.",
    ],
    bullets: [
      "Tenant relations and leasing support",
      "Maintenance oversight",
      "Day to day operational management",
    ],
  },
}

export function getService(slug: string): ServiceContent | undefined {
  const entry = CONTENT[slug]
  return entry ? { slug, ...entry } : undefined
}

export function getAllServices(): ServiceContent[] {
  return Object.keys(CONTENT).map((slug) => ({ slug, ...CONTENT[slug]! }))
}
