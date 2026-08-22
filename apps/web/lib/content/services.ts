import type { ImageKey } from "@/lib/images"

/**
 * Service page content — seeded from the client's revised content document
 * (§4) and enhanced with structured delivery phases, category tags, and assurance metrics.
 */

export interface ServicePhase {
  title: string
  description: string
}

export interface ServiceContent {
  slug: string
  /** Page H1 and <title> (without the site suffix). */
  title: string
  navTitle: string
  category: "core" | "license"
  tagline: string
  metaDescription: string
  keywords: string[]
  imageKey: ImageKey | null
  intro: string[]
  bullets: string[]
  assurances: string[]
  phases: ServicePhase[]
  jurisdictions: string[]
  /** Rendered only when true — dispute support scoped ONLY to Business Setup KSA. */
  disputeSupport?: boolean
  closingNote?: { title: string; body: string }
}

const CONTENT: Record<string, Omit<ServiceContent, "slug">> = {
  "administrative-solutions": {
    title: "Business Setup in Saudi Arabia",
    navTitle: "Business Setup in Saudi Arabia",
    category: "core",
    tagline:
      "End-to-end foreign investment licensing, MISA registration, and corporate formation.",
    metaDescription:
      "Company formation and MISA registration in Saudi Arabia, handled end to end by Sinai Spark Global, including entity structuring and dispute support.",
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
      "MISA investment license registration and approvals",
      "Commercial registration (CR) with the Ministry of Commerce",
      "Entity structuring guidance: LLC, branch, or representative office",
      "Document preparation, legal translation, and government attestation",
      "Dispute support guidance and referrals for contract or regulatory disputes that come up during market entry",
    ],
    assurances: [
      "100% Foreign Equity Permitted",
      "7–14 Days Ministry Turnaround",
      "Direct MISA & MoC Liaison",
      "Dedicated Corporate Case Lead",
    ],
    phases: [
      {
        title: "1. Strategy & Entity Structuring",
        description:
          "We evaluate your commercial model and recommend the optimal legal form (100% Foreign LLC, Branch, or Rep Office) under the Saudi Investment Law.",
      },
      {
        title: "2. Document Preparation & Attestation",
        description:
          "Drafting Articles of Association (AoA), legal translation of parent documentation, and embassy/apostille authentication.",
      },
      {
        title: "3. Ministry Filings & CR Issuance",
        description:
          "Securing the MISA foreign investment license, followed by Commercial Registration issuance with the Ministry of Commerce.",
      },
      {
        title: "4. Statutory Tax, Labor & Banking Handoff",
        description:
          "Enrollment in ZATCA (Tax/Zakat), Chamber of Commerce, Qiwa, Muqeem, GOSI, and corporate bank account introduction.",
      },
    ],
    jurisdictions: ["Saudi Arabia (Flagship)", "GCC Cross-Border"],
    disputeSupport: true,
  },
  "legal-services": {
    title: "Legal & Regulatory Advisory",
    navTitle: "Legal Services",
    category: "core",
    tagline:
      "Corporate contracts, regulatory interpretation, and preventative compliance structuring.",
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
      "Commercial contract drafting, bilingual review, and negotiation",
      "Regulatory interpretation across ministerial decrees and Saudization rules",
      "Corporate governance, shareholder agreements, and board resolutions",
      "Liaison support with government and legal bodies",
    ],
    assurances: [
      "Bilingual Legal Counsel (EN/AR)",
      "Pre-Emptive Risk Mitigation",
      "KSA Commercial Code Aligned",
      "Fast 48h Contract Review SLA",
    ],
    phases: [
      {
        title: "1. Diagnostic Risk Assessment",
        description:
          "Review of proposed operations, commercial agreements, and existing entity agreements against local jurisprudence.",
      },
      {
        title: "2. Contract Drafting & Customization",
        description:
          "Tailoring bilingual agreements that protect IP, enforce dispute mechanisms, and comply with Saudi contract laws.",
      },
      {
        title: "3. Regulatory Clarification & Liaison",
        description:
          "Engaging relevant authorities where statutory ambiguities exist to ensure definitive operational legality.",
      },
      {
        title: "4. Ongoing Governance Retainer",
        description:
          "Continuous counsel on regulatory amendments, board governance, and counterparty compliance.",
      },
    ],
    jurisdictions: ["Saudi Arabia", "UAE", "UK", "India", "Bahrain"],
  },
  "commercial-license": {
    title: "Commercial License",
    navTitle: "Commercial License",
    category: "license",
    tagline:
      "Wholesale, retail, and general trading licensing for international enterprises.",
    metaDescription:
      "Commercial licensing in Saudi Arabia from Sinai Spark Global, matched to the right category from the start.",
    keywords: [
      "commercial license Saudi Arabia",
      "business license Saudi Arabia",
      "trading license KSA",
    ],
    imageKey: "countrySaudiArabia",
    intro: [
      "For internationally established companies entering Saudi Arabia's commercial sector, the commercial license is the foundation of legal operation. Getting the category right from the start avoids rework later.",
    ],
    bullets: [
      "Eligibility assessment and ISIC commercial activity selection",
      "Application dossier preparation and Ministry submission",
      "Import/export integration and customs clearance advisory",
      "Renewal tracking through our compliance service",
    ],
    assurances: [
      "Full Foreign Trading Allowed",
      "ISIC4 Activity Classification",
      "Integrated Customs Code",
      "Annual Renewal Shield",
    ],
    phases: [
      {
        title: "1. Activity & Capital Assessment",
        description:
          "Matching your planned goods and sales channels with official ISIC codes and required capital investment thresholds.",
      },
      {
        title: "2. MISA Application Submission",
        description:
          "Submitting the formal commercial licensing dossier with verified parent company trade track record.",
      },
      {
        title: "3. Ministry Approval & License Delivery",
        description:
          "Issuance of the foreign commercial investment license and synchronization with Chamber of Commerce trade registers.",
      },
    ],
    jurisdictions: ["Saudi Arabia (Flagship)"],
  },
  "industrial-license": {
    title: "Industrial License",
    navTitle: "Industrial License",
    category: "license",
    tagline:
      "Manufacturing, fabrication, and industrial site establishment with full foreign equity.",
    metaDescription:
      "Industrial licensing in Saudi Arabia for foreign investors setting up manufacturing operations, with full foreign ownership available.",
    keywords: ["industrial license Saudi Arabia", "manufacturing license KSA"],
    imageKey: "regionalDammam",
    intro: [
      "For foreign investors setting up manufacturing operations, the industrial license opens Saudi Arabia's industrial sector, with full foreign ownership available for qualifying activities.",
    ],
    bullets: [
      "Manufacturing activity classification and industrial code mapping",
      "Coordination with the Ministry of Industry and Mineral Resources (MIM)",
      "MODON industrial city land application and utility allocation",
      "Customs duty exemptions on industrial raw materials and equipment",
    ],
    assurances: [
      "100% Foreign Ownership",
      "MODON Land Allocation Support",
      "Raw Material Duty Exemptions",
      "Industrial Fund (SIDF) Alignment",
    ],
    phases: [
      {
        title: "1. Technical & Feasibility Review",
        description:
          "Reviewing production capacity, raw materials, utility requirements, and equipment imports.",
      },
      {
        title: "2. Ministry of Industry & MISA Approvals",
        description:
          "Securing dual approval from MISA and the Ministry of Industry and Mineral Resources.",
      },
      {
        title: "3. Site Leasing & Environmental Permits",
        description:
          "Liaison with MODON or Royal Commission for factory plot lease agreements and civil defense clearances.",
      },
    ],
    jurisdictions: ["Saudi Arabia (Dammam, Jubail, Riyadh, Jeddah)"],
  },
  "entrepreneurial-license": {
    title: "Entrepreneurial License",
    navTitle: "Entrepreneurial License",
    category: "license",
    tagline:
      "Low-capital fast-track entry for venture-backed startups and high-growth innovators.",
    metaDescription:
      "The entrepreneurial license supports startups and first time founders establishing an entity in Saudi Arabia.",
    keywords: ["entrepreneurial license Saudi Arabia", "startup license KSA"],
    imageKey: "indiaMumbai",
    intro: [
      "For startups and first time founders establishing an entity, the entrepreneurial license offers a structured entry point into the Saudi market.",
    ],
    bullets: [
      "Founder eligibility review and incubator/VC support letter validation",
      "Fast-track entity setup aligned to the license conditions",
      "Waived initial capital deposit requirements",
      "Ongoing compliance and milestone reporting from day one",
    ],
    assurances: [
      "Zero Minimum Capital Deposit",
      "Venture & Incubator Friendly",
      "Specialized Tech & Innovation Codes",
      "Streamlined Founder Visas",
    ],
    phases: [
      {
        title: "1. Innovation / VC Endorsement Verification",
        description:
          "Verifying startup patents, accelerator acceptance, or VC investment letters required for entrepreneurial category.",
      },
      {
        title: "2. Accelerated MISA Issuance",
        description:
          "Fast-tracked application through MISA's startup portal with reduced government processing timelines.",
      },
      {
        title: "3. Commercial Setup & Founder Enablement",
        description:
          "Issuing CR, founder residency visas, and connecting with local Saudi tech ecosystem hubs.",
      },
    ],
    jurisdictions: ["Saudi Arabia"],
  },
  "service-license": {
    title: "Service License",
    navTitle: "Service License",
    category: "license",
    tagline:
      "Professional licensing for IT, engineering, management consulting, healthcare, and education.",
    metaDescription:
      "Service licensing in Saudi Arabia for companies delivering construction, technology, education, healthcare or tourism services.",
    keywords: [
      "service license Saudi Arabia",
      "professional services license KSA",
    ],
    imageKey: "aboutTeam",
    intro: [
      "For companies delivering services in construction, technology, education, healthcare or tourism, the service license matches the business to the correct regulated category.",
    ],
    bullets: [
      "Activity mapping across regulated service sectors",
      "Application preparation and sector-specific authority liaison",
      "Professional accreditation and engineers/consultants council registration",
      "License condition briefing and operational guidelines on approval",
    ],
    assurances: [
      "Professional Services 100% Equity",
      "Tech, Engineering & Healthcare Aligned",
      "Flexible Branch Expansion",
      "Rapid Ministry Sign-Off",
    ],
    phases: [
      {
        title: "1. Sector Regulation & Activity Scoping",
        description:
          "Confirming if your service requires additional ministry permits (e.g. Health, Education, Transport).",
      },
      {
        title: "2. Foreign Service License Filing",
        description:
          "Preparing credential documentation, practitioner resumes, and corporate resolutions for MISA approval.",
      },
      {
        title: "3. Operational Activation",
        description:
          "Finalizing municipal commercial office licensing (Balady) and national address registration.",
      },
    ],
    jurisdictions: ["Saudi Arabia", "GCC"],
  },
  "real-estate-license": {
    title: "Real Estate License",
    navTitle: "Real Estate License",
    category: "license",
    tagline:
      "Institutional property investment, real estate development, and asset holding.",
    metaDescription:
      "Real estate licensing in Saudi Arabia for property investment and development activity.",
    keywords: ["real estate license Saudi Arabia", "property license KSA"],
    imageKey: "serviceProperty",
    intro: [
      "For property investment and development activity, the real estate license regulates participation in one of the Kingdom's most active sectors.",
    ],
    bullets: [
      "Investment versus development activity structuring",
      "Real Estate General Authority (REGA) approvals and registration",
      "Foreign investment non-Saudi real estate ownership approvals",
      "Property management handoff where required",
    ],
    assurances: [
      "REGA Regulatory Alignment",
      "Large-Scale Development Ready",
      "Institutional Asset Holding",
      "Seamless Property Management Integration",
    ],
    phases: [
      {
        title: "1. Investment Model Classification",
        description:
          "Differentiating direct development vs investment fund asset holding under foreign ownership rules.",
      },
      {
        title: "2. REGA & MISA Approvals",
        description:
          "Filing real estate development permissions with the General Authority and investment authorities.",
      },
      {
        title: "3. Title & Asset Operational Setup",
        description:
          "Notarization and structuring of deeds with the Ministry of Justice and municipal entities.",
      },
    ],
    jurisdictions: ["Saudi Arabia"],
  },
  "pro-visa-services": {
    title: "PRO & Visa Services",
    navTitle: "PRO & Visa Services",
    category: "core",
    tagline:
      "Government liaison, residency visas, labor quotas, and executive immigration management.",
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
      "Executive and employee work visa processing and Iqama issuance",
      "Qiwa platform workforce management, Ajeer permits, and contract authentication",
      "Muqeem portal management, exit/re-entry permits, and final exit procedures",
      "Ministry of Human Resources (MHRSD) liaison and Saudization quota management",
    ],
    assurances: [
      "Dedicated On-The-Ground GRO/PRO",
      "Qiwa & Muqeem Portal Managed",
      "Nitaqat (Saudization) Optimization",
      "Zero Renewal Lapse Guarantee",
    ],
    phases: [
      {
        title: "1. Visa Quota (Block Visa) Allocation",
        description:
          "Applying for initial foreign labor quotas with MHRSD based on company activity and capital.",
      },
      {
        title: "2. Consular Processing & Medicals",
        description:
          "Coordinating embassy work authorization stamps and Gulf health clearances in country of origin.",
      },
      {
        title: "3. In-Kingdom Iqama Issuance",
        description:
          "Completing fingerprinting, medical tests, and issuing resident identity cards (Iqamas) within statutory windows.",
      },
      {
        title: "4. Ongoing Workforce Portal Administration",
        description:
          "Handling digital employment contracts, Saudization calculation, and annual renewals.",
      },
    ],
    jurisdictions: ["Saudi Arabia (Flagship)", "UAE", "Bahrain"],
  },
  compliance: {
    title: "Compliance",
    navTitle: "Compliance",
    category: "core",
    tagline:
      "Year-round statutory filings, license upkeep, ZATCA tax, and corporate secretarial management.",
    metaDescription:
      "Ongoing regulatory compliance, renewals and filing support in Saudi Arabia, tracked by Sinai Spark Global so nothing is missed after formation.",
    keywords: [
      "regulatory compliance Saudi Arabia",
      "business compliance KSA",
      "license renewal Saudi Arabia",
    ],
    imageKey: "serviceLegal",
    intro: [
      "Formation is a one time event. Staying compliant is not. This service tracks renewal dates, filing deadlines and regulatory changes on an ongoing basis, so clients do not have to keep a mental calendar of government requirements themselves.",
    ],
    bullets: [
      "Commercial registration and MISA investment license renewals",
      "ZATCA tax, VAT, and Zakat annual filing coordination",
      "National Address, Chamber of Commerce, and municipal license upkeep",
      "Ongoing regulatory monitoring for new ministerial decrees and commercial codes",
    ],
    assurances: [
      "365-Day Renewal Calendar",
      "ZATCA E-Invoicing & Filing Support",
      "Zero Penalty Compliance Record",
      "Executive Regulatory Updates",
    ],
    phases: [
      {
        title: "1. Compliance Audit & Calendar Setup",
        description:
          "Mapping all mandatory renewal dates, tax milestones, and portal obligations across your entity.",
      },
      {
        title: "2. Milestone Tracking & Pre-Filing",
        description:
          "60-day advance notice and preparation for upcoming license expiries and statutory reporting.",
      },
      {
        title: "3. Official Submission & Proof of Good Standing",
        description:
          "Filing with municipal, tax, and investment authorities to maintain unbroken operational certificates.",
      },
    ],
    jurisdictions: ["Saudi Arabia", "UAE", "UK", "India", "Bahrain"],
  },
  "property-management": {
    title: "Property Management",
    navTitle: "Property Management",
    category: "core",
    tagline:
      "Commercial headquarters leasing, facility operations, and physical asset oversight.",
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
      "Commercial office sourcing, Ejar lease contract drafting, and validation",
      "Tenant relations, rent collection, and statutory lease renewals",
      "Facility management, maintenance coordination, and utility services",
      "Day-to-day operational management and property compliance",
    ],
    assurances: [
      "Certified Ejar Network Member",
      "KSA Commercial District Sourcing",
      "Full Facility Oversight",
      "Transparent Yield & Maintenance Reporting",
    ],
    phases: [
      {
        title: "1. Asset Onboarding & Inspection",
        description:
          "Detailed inventory, structural condition reporting, and compliance verification under municipal building codes.",
      },
      {
        title: "2. Tenant & Ejar Lease Execution",
        description:
          "Executing legally binding commercial or residential lease contracts registered on the official Ejar platform.",
      },
      {
        title: "3. Day-to-Day Operations & Maintenance",
        description:
          "Vendor management, routine facility upkeep, and 24/7 emergency response handling.",
      },
    ],
    jurisdictions: ["Saudi Arabia (Riyadh, Jeddah, Dammam)"],
  },
}

export function getService(slug: string): ServiceContent | undefined {
  const entry = CONTENT[slug]
  return entry ? { slug, ...entry } : undefined
}

export function getAllServices(): ServiceContent[] {
  return Object.keys(CONTENT).map((slug) => ({ slug, ...CONTENT[slug]! }))
}
