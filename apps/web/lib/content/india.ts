import type { ImageKey } from "@/lib/images"

/**
 * India Landing Page content — client-supplied verbatim in the revised
 * content document §7. Fees are PENDING_CLIENT_DATA.
 */

export const INDIA = {
  hero: {
    eyebrow: "Trusted by NRIs and Entrepreneurs Across the Gulf",
    headline: "Register Your Indian Company, From Anywhere in the World",
    subheadline:
      "Set up a Private Limited Company, LLP or OPC in India without visiting a government office. Fully online, NRI friendly, with support in Hindi and English.",
    primaryCta: { label: "Register My Indian Company", href: "/contact/" },
    secondaryCta: { label: "See How It Works", href: "#how-it-works" },
    trustStrip: [
      "100% Online",
      "MCA Compliant",
      "NRI Friendly",
      "Hindi Support",
    ],
  },
  audiences: {
    title: "Who this page is for",
    items: [
      "NRIs in Saudi Arabia who want a legal Indian entity while based in the Gulf",
      "Saudi businesses entering India, expanding operations into India's market",
      "First time Indian founders starting their first registered business",
      "Freelancers going formal, moving from informal freelance work to a registered company",
      "India and Gulf cross border businesses operating across both markets",
    ],
  },
  structures: {
    title: "Choosing a structure",
    headers: ["Structure", "Best For", "Key Points"],
    rows: [
      {
        structure: "Private Limited Company",
        popular: true,
        bestFor: "Startups, investment ready ventures",
        keyPoints:
          "Separate legal identity, limited liability, easiest to raise investment",
      },
      {
        structure: "Limited Liability Partnership",
        popular: false,
        bestFor: "Professionals, consultants, partners",
        keyPoints: "Lower compliance than Pvt Ltd, flexible profit sharing",
      },
      {
        structure: "One Person Company",
        popular: false,
        bestFor: "Solo founders",
        keyPoints:
          "Single founder control, limited liability, lower compliance",
      },
      {
        structure: "Sole Proprietorship",
        popular: false,
        bestFor: "Small traders, early stage testing",
        keyPoints: "Cheapest and fastest to start, full owner control",
      },
    ],
  },
  servicesList: [
    "Private Limited Company registration (MOA, AOA, DIN, DSC, Certificate of Incorporation)",
    "LLP formation, including LLP agreement drafting and ROC filing",
    "One Person Company (OPC) incorporation with nominee director arrangement",
    "GST registration and GSTIN issuance",
    "Trademark registration",
    "Import Export Code (IEC) registration",
    "ROC compliance and annual filings",
    "Business bank account assistance",
  ],
  process: {
    title: "How It Works",
    steps: [
      {
        title: "Free Consultation",
        body: "We recommend the right structure for your goals.",
      },
      {
        title: "Document Preparation",
        body: "KYC collection, MOA/AOA drafting, DIN and DSC application.",
      },
      {
        title: "MCA Filing",
        body: "Filing with the Ministry of Corporate Affairs, Certificate of Incorporation issued.",
      },
      {
        title: "Post Incorporation Setup",
        body: "GST, PAN, TAN, bank account and trademark as needed.",
      },
    ],
  },
  nri: {
    title: "For NRIs and Gulf Based Indians",
    intro:
      "NRIs based in Saudi Arabia or elsewhere in the Gulf are fully eligible to register and own a company in India, entirely online, with no travel required. Sinai Spark Global India understands the specific documentation Gulf based NRIs need and structures every company to be FEMA compliant, so profits can be repatriated to a Gulf account without complication.",
    points: [
      "100% online process, nothing requires a visit to India",
      "NRI specific documentation (passport, OCI or PIO card, overseas address proof)",
      "FEMA compliant structuring for smooth repatriation",
    ],
  },
  whyUs: [
    "100% online, no office visits required, wherever you are",
    "Fast turnaround, Private Limited companies typically incorporated in 7 to 10 working days",
    "Hindi and English support with no legal jargon",
    "Always MCA compliant filings",
    "A dedicated account manager from start to finish",
    "Dual expertise across India and Saudi Arabia for cross border founders",
  ],
  pricing: {
    // PENDING_CLIENT_DATA — fees must be inserted before publishing; quote
    // actual pricing, never placeholders (revised doc developer note).
    published: false,
    packages: [
      {
        name: "Starter",
        popular: false,
        bestFor: "Solo founders starting out",
        structure: "OPC / Sole Proprietorship",
        includes:
          "Company registration, DIN and DSC for one director, Certificate of Incorporation",
        fee: null,
      },
      {
        name: "Professional",
        popular: true,
        bestFor: "Startups and growing businesses",
        structure: "Private Limited Company",
        includes:
          "Full MCA incorporation, DIN and DSC for two directors, MOA/AOA drafting, Certificate of Incorporation",
        fee: null,
      },
      {
        name: "Partnership",
        popular: false,
        bestFor: "Partners and professionals",
        structure: "LLP Formation",
        includes:
          "LLP agreement drafting, DPIN for two partners, Certificate of Incorporation, PAN",
        fee: null,
      },
    ],
  },
  faqs: [
    {
      question:
        "Can an NRI living in Saudi Arabia register a company in India?",
      answer:
        "Yes. NRIs are fully eligible to incorporate a company in India, and the entire process can be completed online without visiting India.",
    },
    {
      question: "How long does registration take?",
      answer:
        "A Private Limited Company typically takes 7 to 10 working days once all documents are submitted.",
    },
    {
      question: "What documents does an NRI need?",
      answer:
        "A passport, OCI or PIO card, overseas address proof, and Indian address proof if available. A full personalized checklist is provided after the free consultation.",
    },
    {
      question: "Private Limited Company or LLP, which is right for me?",
      answer:
        "A Private Limited Company suits businesses planning to raise investment and scale quickly. An LLP suits professionals and small partnerships with lower compliance needs.",
    },
    {
      question: "Is GST registration mandatory?",
      answer:
        "GST registration is required once annual turnover crosses 20 lakh rupees, or 10 lakh in special category states, or for businesses selling goods or services online.",
    },
    {
      question:
        "Can a Saudi national or company hold shares in an Indian company?",
      answer:
        "Yes, subject to FDI guidelines under FEMA. Most sectors permit full FDI, and the right structure is confirmed during the free consultation.",
    },
    {
      question:
        "Does Sinai Spark Global India handle ongoing compliance after registration?",
      answer:
        "Yes. ROC compliance, annual filings, GST filings and director KYC updates are all handled on an ongoing basis.",
    },
  ] satisfies Array<{ question: string; answer: string }>,
  closingCta: {
    title: "Ready to Register Your Indian Company?",
    subheadline:
      "Free consultation, zero commitment, complete clarity on the right structure for your business.",
  },
  trustStrip2: [
    "Hindi and English Support",
    "100% Online Process",
    "Reply within 24 hours",
    "Fully Confidential",
  ],
} as const

export const INDIA_IMAGE_KEY: ImageKey = "indiaMumbai"
