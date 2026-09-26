import { ROUTES } from "@/content/site"

/**
 * Home page copy, section by section, in the order the page renders them.
 * Every string here is lifted verbatim from the approved design (home.html),
 * so editing a value here changes the page and nothing else.
 *
 * Sections flagged `pending` below are still awaiting client sign-off and are
 * tracked in PENDING_CLIENT_DATA.md.
 */

export const LOADER = {
  word: "Sinai Spark Global",
} as const

export const HERO = {
  eyebrow: "Welcome to Sinai Spark Global",
  headline: "Expand with confidence, wherever you're growing.",
  lede: "From company formation and licensing to legal advisory and PRO support, we manage the regulatory groundwork across five global markets, so you can focus on the business, not the paperwork.",
  primary: { label: "Book a free consultation", href: ROUTES.consult },
  secondary: { label: "Explore our services", href: "#services" },
  video: {
    /** Local file first, CDN copy as the fallback source. */
    sources: [
      "/video/hero.mp4",
      "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4",
    ],
    poster: "/images/home/riyadh-skyline-kafd-dusk.jpg",
    label: "City skyline, day to dusk",
  },
  clocksLabel: "On the ground · live",
} as const

/**
 * Scrolling bands of regulators and industries. Both carry a visible caveat
 * because the lists are not client-confirmed yet.
 */
export const GOV = {
  regulators: {
    label: "We file with",
    note: "To confirm with client",
    items: [
      "MISA",
      "Ministry of Commerce",
      "ZATCA",
      "GOSI",
      "Qiwa",
      "Absher",
      "Muqeem",
      "Ministry of Industry",
      "REGA",
    ],
  },
  industries: {
    label: "Industries served",
    note: "Placeholder",
    items: [
      "Manufacturing",
      "Trading & distribution",
      "Technology",
      "Professional services",
      "Real estate",
      "Healthcare",
      "Education",
    ],
  },
} as const

export const MARKETS = {
  eyebrow: "Where we work",
  headline:
    "Wherever your business is headed, we already have a team on the ground.",
  body: "Five markets, one accountable partner. Saudi Arabia is our flagship; the rest of the footprint is built the same way — local people, local licences, local answers.",
  cardCta: "Enter the market",
  cards: [
    {
      name: "Saudi Arabia",
      tag: "Flagship market",
      flagship: true,
      description:
        "Company formation, MISA registration and complete corporate solutions.",
      image: "/images/countries/saudi-arabia-riyadh.jpg",
      alt: "Riyadh",
      href: ROUTES.services,
    },
    {
      name: "United Arab Emirates",
      tag: "Active operations",
      flagship: false,
      description: "Market entry across the Gulf's commercial hub.",
      image: "/images/countries/uae-dubai.jpg",
      alt: "Dubai",
      href: ROUTES.services,
    },
    {
      name: "India",
      tag: "NRI specialists",
      flagship: false,
      description: "Company registration for NRIs and cross-border founders.",
      image: "/images/india/mumbai-business-district.jpg",
      alt: "Mumbai",
      href: ROUTES.india,
    },
    {
      name: "United Kingdom",
      tag: "Active operations",
      flagship: false,
      description: "UK expansion and compliance support.",
      image: "/images/countries/uk-london.jpg",
      alt: "London",
      href: ROUTES.services,
    },
    {
      name: "Bahrain",
      tag: "Active operations",
      flagship: false,
      description: "GCC market entry with local insight.",
      image: "/images/countries/bahrain-manama.jpg",
      alt: "Manama",
      href: ROUTES.services,
    },
  ],
} as const

export const WHO = {
  eyebrow: "Who we are",
  headline:
    "A business advisory and corporate solutions firm built for market entry.",
  lede: "Sinai Spark Global helps entrepreneurs, investors and international companies establish a compliant, lasting presence in the markets that matter to them, with Saudi Arabia as our flagship market and a growing footprint across the globe.",
  quote:
    "“We work as a local partner in each market rather than a paperwork processor, translating an unfamiliar regulatory system into a clear, predictable path to market entry.”",
  images: [
    {
      src: "/images/about/sinaispark-meeting.jpg",
      alt: "Sinai Spark team in a client meeting",
      speed: "0.9",
    },
    {
      src: "/images/about/sinaispark-handshake.jpg",
      alt: "Handshake closing an engagement",
      speed: "1.15",
    },
    {
      src: "/images/about/team-strategy-meeting.jpg",
      alt: "Strategy session",
      speed: "1.05",
    },
  ],
  chip: { badge: "KSA", text: "Flagship market since day one" },
} as const

export const BRAND_INTERLUDE = {
  eyebrow: "The mark",
  headline: "One partner. Every market.",
  lede: "Two currents meeting in the middle — your business and the market you're entering — with the spark where they touch. It is the shape of what we do.",
  /** Caption while drawing; {pct} is replaced as the mark fills in. */
  caption: "Drawing · {pct}%",
  /** Caption once the mark is complete. */
  captionDone: "Sinai Spark Global · The mark",
} as const

export const MISSION_VISION = {
  eyebrow: "Mission & vision",
  headline: "Why we do this, and where it is going.",
  lede: "Two sentences the whole firm is measured against, in every market we operate in.",
  panels: [
    {
      badge: "M",
      label: "Our mission",
      text: "To give businesses a fast, fully compliant route into new markets, backed by expert guidance, hands-on operational support and a genuine commitment to client outcomes, wherever they choose to expand.",
      tags: ["Fast", "Fully compliant", "Hands-on", "Outcome-led"],
    },
    {
      badge: "V",
      label: "Our vision",
      text: "To be the most trusted global partner for business setup and expansion, known for efficiency, integrity and long-term client success in every market we operate in.",
      tags: ["Most trusted", "Efficient", "Integrity", "Long-term"],
    },
  ],
} as const

export const STATS = {
  eyebrow: "Track record",
  items: [
    { value: 12, suffix: "+", label: "Years of experience" },
    { value: 250, suffix: "+", label: "Happy clients" },
    { value: 5, suffix: "", label: "Countries served" },
    { value: 40, suffix: "+", label: "Skilled professionals" },
  ],
} as const

export const SERVICES_STACK = {
  eyebrow: "What we do",
  headline: "Complete strategic solutions for market leadership.",
  cta: { label: "All services", href: ROUTES.services },
  cardCta: "Explore",
  cards: [
    {
      kicker: "Incorporation",
      title: "Business incorporation & establishment",
      body: "Company formation and MISA registration for foreign investors, handled end to end — strategy, attestation, ministry filings and CR issuance.",
      image: "/images/services/service-business-setup.jpg",
      href: ROUTES.service("administrative-solutions"),
    },
    {
      kicker: "Legal",
      title: "Legal & regulatory advisory",
      body: "Contract drafting and review, regulatory interpretation and structuring advice from people who read the regulation in its own language.",
      image: "/images/services/service-legal.jpg",
      href: ROUTES.service("legal-services"),
    },
    {
      kicker: "Licensing",
      title:
        "Commercial, industrial, entrepreneurial, service & real estate licences",
      body: "The right licence class for your activity and capital, filed with MISA and delivered with the approvals you need to operate.",
      image: "/images/services/service-licensing.jpg",
      href: ROUTES.licences,
    },
    {
      kicker: "PRO & visa",
      title: "PRO & visa services",
      body: "Government liaison, work visa processing and labour documentation — the daily relationship with the ministries, handled for you.",
      image: "/images/services/service-pro-visa.jpg",
      href: ROUTES.service("pro-visa-services"),
    },
    {
      kicker: "Compliance",
      title: "Ongoing compliance",
      body: "Regulatory upkeep, renewals and annual filings on a calendar we own, so nothing lapses.",
      image: "/images/services/service-compliance.jpg",
      href: ROUTES.service("compliance"),
    },
    {
      kicker: "Property",
      title: "Property management",
      body: "Complete management of commercial and residential property for owners based anywhere in the world.",
      image: "/images/services/service-property.jpg",
      href: ROUTES.service("property-management"),
    },
  ],
} as const

export const PROCESS = {
  eyebrow: "How it works",
  headline: "From first call to first day of operation.",
  lede: "One accountable team from the first conversation to the day you are licensed, and after.",
  steps: [
    {
      icon: "chat",
      title: "Free consultation",
      body: "We learn your goals and recommend the right structure.",
      outcome: "A recommended structure",
    },
    {
      icon: "check",
      title: "Choose your service",
      body: "Formation, licensing, legal, PRO or compliance.",
      outcome: "Clear scope, clear pricing",
    },
    {
      icon: "file",
      title: "We handle the process",
      body: "Documentation, filings and government liaison.",
      outcome: "Filings and liaison handled",
    },
    {
      icon: "flag",
      title: "You're ready to operate",
      body: "Licensed, compliant and supported going forward.",
      outcome: "Licensed and supported",
    },
  ],
} as const

export const WHY = {
  eyebrow: "Why Sinai Spark Global",
  headline: "A partner invested in your outcome.",
  lede: "Six reasons clients stay with us long after the licence is issued.",
  link: { label: "Talk to us", href: ROUTES.consult },
  rows: [
    {
      kicker: "Reach",
      title: "Global reach, local insight",
      body: "Active operations across five markets.",
      marks: ["Riyadh", "Dubai", "Mumbai", "London", "Manama"],
    },
    {
      kicker: "Partnership",
      title: "Complete partnership",
      body: "Support from first consultation through to ongoing operations.",
    },
    {
      kicker: "Strategy",
      title: "Client-focused strategy",
      body: "Solutions shaped around your specific goals.",
    },
    {
      kicker: "Track record",
      title: "Proven track record",
      body: "A consistent record of successful market entries.",
    },
    {
      kicker: "Trust",
      title: "Transparent, trust-based relationships",
      body: "Clear pricing and clear communication throughout.",
    },
    {
      kicker: "Support",
      title: "Responsive support",
      body: "A dedicated point of contact for every client.",
    },
  ],
} as const

export const REGIONS = {
  eyebrow: "Regional coverage in Saudi Arabia",
  headline: "On the ground in the Kingdom's three economic centres.",
  tiles: [
    {
      kicker: "Capital",
      name: "Riyadh",
      body: "The Kingdom's capital and economic centre. Licensing, PRO and GRO services, and project support.",
      image: "/images/countries/saudi-arabia-riyadh.jpg",
    },
    {
      kicker: "Trade gateway",
      name: "Jeddah",
      body: "Tax, compliance and corporate advisory for import- and export-facing businesses.",
      image: "/images/regional/jeddah-corniche.jpg",
    },
    {
      kicker: "Industrial hub",
      name: "Dammam",
      body: "The Eastern Province's industrial hub. Complete legal and operational support.",
      image: "/images/regional/dammam-waterfront.jpg",
    },
  ],
} as const

export const CONSULT = {
  eyebrow: "Book a free consultation",
  headline: "Tell us where you're headed.",
  lede: "Thirty minutes with the right specialist, no obligation.",
  steps: [
    "We read your note and match you with the right specialist.",
    "A 30-minute call to map the structure, licence and timeline.",
    "A clear scope and clear pricing, in writing.",
  ],
  officeLabel: "Your local office",
  localTimeLabel: "local time",
  /** Market select — each option also drives the local-office readout. */
  markets: [
    { label: "Saudi Arabia", office: "Riyadh", timeZone: "Asia/Riyadh" },
    { label: "United Arab Emirates", office: "Dubai", timeZone: "Asia/Dubai" },
    { label: "India", office: "Mumbai", timeZone: "Asia/Kolkata" },
    { label: "United Kingdom", office: "London", timeZone: "Europe/London" },
    { label: "Bahrain", office: "Manama", timeZone: "Asia/Bahrain" },
  ],
  services: [
    "Business setup / company formation",
    "A licence (commercial, industrial, entrepreneurial, service, real estate)",
    "Legal & regulatory advisory",
    "PRO & visa services",
    "Compliance",
    "Property management",
    "Indian company registration (NRI)",
    "Not sure yet",
  ],
  fields: {
    name: { label: "Name", placeholder: "Your name" },
    email: { label: "Email", placeholder: "you@company.com" },
    phone: { label: "Phone", placeholder: "+966 ..." },
    market: { label: "Market" },
    service: { label: "What do you need?" },
    message: {
      label: "A few lines about the business",
      placeholder:
        "What you do, where you're based, and when you'd like to be operating.",
    },
  },
  submit: "Send request",
  disclaimer:
    "We reply within one business day. Your details are only used to answer this request.",
  /** Shown when the request could not be sent at all. */
  failure:
    "We couldn't send your request just now. Please try again in a moment.",
  done: {
    title: "Request received.",
    body: "A specialist for your market will be in touch to set up the call.",
  },
} as const

export const CLOSING_CTA = {
  eyebrow: "Start the conversation",
  headline: "Still have questions?",
  lede: "Explore our detailed FAQs or speak to our experts for personalised guidance.",
  secondary: { label: "View FAQs", href: ROUTES.faq },
  primary: { label: "Contact us", href: ROUTES.consult },
} as const
