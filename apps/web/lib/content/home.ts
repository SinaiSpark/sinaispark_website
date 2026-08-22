import type { ImageKey } from "@/lib/images"

/**
 * Home page content — seeded verbatim from the client's revised content
 * document (website content reviswd.pdf §3). Values flagged
 * PENDING_CLIENT_DATA must be replaced before launch.
 */

export const HOME = {
  hero: {
    eyebrow: "Welcome to Sinai Spark Global",
    headline: "Expand with Confidence, Wherever You're Growing.",
    subheadline:
      "From company formation and licensing to legal advisory and PRO support, Sinai Spark Global manages the regulatory groundwork across five global markets, so you can focus on the business, not the paperwork.",
    primaryCta: { label: "Book a Free Consultation", href: "/contact/" },
    secondaryCta: { label: "Explore Our Services", href: "/services/" },
  },
  globalPresence: {
    intro:
      "Wherever your business is headed, we already have a team on the ground.",
    markets: [
      {
        name: "Saudi Arabia",
        tag: "Flagship market",
        description:
          "Company formation, MISA registration and complete corporate solutions.",
        imageKey: "countrySaudiArabia",
        href: "/where-we-work/saudi-arabia/",
      },
      {
        name: "United Arab Emirates",
        tag: "Active operations",
        description: "Market entry across the Gulf's commercial hub.",
        imageKey: "countryUae",
        href: "/where-we-work/uae/",
      },
      {
        name: "India",
        tag: "NRI specialists",
        description: "Company registration for NRIs and cross-border founders.",
        imageKey: "indiaMumbai",
        href: "/sinai-spark-india/",
      },
      {
        name: "United Kingdom",
        tag: "Active operations",
        description: "UK expansion and compliance support.",
        imageKey: "countryUk",
        href: "/where-we-work/uk/",
      },
      {
        name: "Bahrain",
        tag: "Active operations",
        description: "GCC market entry with local insight.",
        imageKey: "countryBahrain",
        href: "/where-we-work/bahrain/",
      },
    ] satisfies Array<{
      name: string
      tag: string
      description: string
      imageKey: ImageKey
      href: string
    }>,
  },
  whoWeAre: {
    eyebrow: "Who We Are",
    title:
      "A business advisory and corporate solutions firm built for market entry",
    body: "Sinai Spark Global is a business advisory and corporate solutions firm that helps entrepreneurs, investors and international companies establish a compliant, lasting presence in the markets that matter to them, with Saudi Arabia as our flagship market and a growing footprint across the globe.",
    pullQuote:
      "We work as a local partner in each market rather than a paperwork processor, translating an unfamiliar regulatory system into a clear, predictable path to market entry.",
  },
  missionVision: {
    mission: {
      title: "Our Mission",
      body: "To give businesses a fast, fully compliant route into new markets, backed by expert guidance, hands on operational support, and a genuine commitment to client outcomes, wherever they choose to expand.",
    },
    vision: {
      title: "Our Vision",
      body: "To be the most trusted global partner for business setup and expansion, known for efficiency, integrity, and long term client success in every market we operate in.",
    },
  },
  stats: [
    // PENDING_CLIENT_DATA — replace all figures with verified numbers before launch.
    { value: 12, suffix: "+", label: "Years of Experience", pending: true },
    { value: 250, suffix: "+", label: "Happy Clients", pending: true },
    { value: 5, suffix: "", label: "Countries Served", pending: false },
    { value: 40, suffix: "+", label: "Skilled Professionals", pending: true },
  ],
  whatWeDo: {
    eyebrow: "What We Do",
    title: "Complete strategic solutions for market leadership",
    items: [
      {
        title: "Business Incorporation & Establishment",
        description:
          "Company formation and MISA registration for foreign investors, handled end to end.",
        href: "/services/administrative-solutions/",
        imageKey: "serviceBusinessSetup",
      },
      {
        title: "Legal & Regulatory Advisory",
        description:
          "Contract drafting and review, regulatory interpretation and structuring advice.",
        href: "/services/legal-services/",
        imageKey: "serviceLegal",
      },
      {
        title: "Licensing",
        description:
          "Commercial, Industrial, Entrepreneurial, Service and Real Estate licenses.",
        href: "/services/commercial-license/",
        imageKey: "serviceLicensing",
      },
      {
        title: "PRO & Visa Services",
        description:
          "Government liaison, work visa processing and labor documentation.",
        href: "/services/pro-visa-services/",
        imageKey: "serviceProVisa",
      },
      {
        title: "Compliance",
        description: "Ongoing regulatory upkeep, renewals and annual filings.",
        href: "/services/compliance/",
        imageKey: null,
      },
      {
        title: "Property Management",
        description:
          "Complete management of commercial and residential property.",
        href: "/services/property-management/",
        imageKey: "serviceProperty",
      },
    ] satisfies Array<{
      title: string
      description: string
      href: string
      imageKey: ImageKey | null
    }>,
  },
  whyChooseUs: {
    eyebrow: "Why Choose Sinai Spark Global",
    title: "A partner invested in your outcome",
    points: [
      {
        title: "Global Reach, Local Insight",
        description: "Active operations across five markets.",
      },
      {
        title: "Complete Partnership",
        description:
          "Support from first consultation through to ongoing operations.",
      },
      {
        title: "Client Focused Strategy",
        description: "Solutions shaped around your specific goals.",
      },
      {
        title: "Proven Track Record",
        description: "A consistent record of successful market entries.",
      },
      {
        title: "Transparent, Trust Based Relationships",
        description: "Clear pricing and clear communication throughout.",
      },
      {
        title: "Responsive Support",
        description: "A dedicated point of contact for every client.",
      },
    ],
  },
  howItWorks: {
    eyebrow: "How It Works",
    title: "From first call to first day of operation",
    steps: [
      {
        title: "Free Consultation",
        description: "We learn your goals and recommend the right structure.",
      },
      {
        title: "Choose Your Service",
        description: "Formation, licensing, legal, PRO or compliance.",
      },
      {
        title: "We Handle the Process",
        description: "Documentation, filings and government liaison.",
      },
      {
        title: "You're Ready to Operate",
        description: "Licensed, compliant and supported going forward.",
      },
    ],
  },
  testimonials: {
    eyebrow: "Testimonials",
    title: "What Our Clients Say",
    subheadline:
      "Real feedback from founders and investors we have helped enter new markets.",
    /** PENDING_CLIENT_DATA — section stays hidden until verified quotes arrive from BDM/sales. */
    published: false,
  },
  regionalCoverage: {
    eyebrow: "Regional Coverage in Saudi Arabia",
    title: "On the ground in the Kingdom's three economic centers",
    regions: [
      {
        city: "Riyadh",
        description:
          "The Kingdom's capital and economic center. Licensing, PRO and GRO services, and project support.",
        imageKey: "countrySaudiArabia",
      },
      {
        city: "Jeddah",
        description:
          "The Kingdom's trade gateway. Tax, compliance and corporate advisory for import and export facing businesses.",
        imageKey: "regionalJeddah",
      },
      {
        city: "Dammam",
        description:
          "The Eastern Province's industrial hub. Complete legal and operational support.",
        imageKey: "regionalDammam",
      },
    ] satisfies Array<{
      city: string
      description: string
      imageKey: ImageKey
    }>,
  },
  closingCta: {
    title: "Still Have Questions?",
    subheadline:
      "Explore our detailed FAQs or speak to our experts for personalized guidance.",
    buttons: [
      { label: "View FAQs", href: "/faqs/", variant: "secondary" as const },
      { label: "Contact Us", href: "/contact/", variant: "gold" as const },
    ],
  },
} as const
