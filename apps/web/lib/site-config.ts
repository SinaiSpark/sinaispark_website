/**
 * Site-wide configuration — Sinai Spark Global.
 * Values marked PENDING_CLIENT_DATA are placeholders seeded from available
 * sources and must be replaced before launch (IMPLEMENTATION_PLAN.md §9).
 */

export const SITE = {
  name: "Sinai Spark Global",
  shortName: "Sinai Spark",
  tagline: "Your Vision, Our Mission",
  url: "https://sinaispark.com",
  description:
    "Sinai Spark Global handles company formation, MISA registration, licensing and PRO services in Saudi Arabia, the UAE, the UK, India and Bahrain.",
  email: "info@sinaispark.com",
  /** PENDING_CLIENT_DATA — seeded from current live site; confirm with client. */
  phone: "+966 51 001 3160",
  whatsappNumber: "9665100131600",
  socials: {
    instagram: "https://instagram.com/sinaispark",
    linkedin: "https://linkedin.com/company/sinaispark",
    youtube: "https://youtube.com/@sinaispark",
  },
  offices: [
    { city: "Riyadh", label: "Riyadh", note: "Capital & economic center" },
    { city: "Jeddah", label: "Jeddah", note: "Kingdom's trade gateway" },
    { city: "Dammam", label: "Dammam", note: "Eastern Province industrial hub" },
  ],
} as const

export interface ServiceNavItem {
  title: string
  href: string
  description?: string
}

/** All ten approved service/license routes (Decision #2/#3). */
export const SERVICES: ServiceNavItem[] = [
  {
    title: "Business Setup in Saudi Arabia",
    href: "/services/administrative-solutions/",
    description: "Company formation, MISA registration and dispute support.",
  },
  {
    title: "Legal & Regulatory Advisory",
    href: "/services/legal-services/",
    description: "Contracts, regulatory interpretation and structuring advice.",
  },
  {
    title: "Commercial License",
    href: "/services/commercial-license/",
  },
  {
    title: "Industrial License",
    href: "/services/industrial-license/",
  },
  {
    title: "Entrepreneurial License",
    href: "/services/entrepreneurial-license/",
  },
  {
    title: "Service License",
    href: "/services/service-license/",
  },
  {
    title: "Real Estate License",
    href: "/services/real-estate-license/",
  },
  {
    title: "PRO & Visa Services",
    href: "/services/pro-visa-services/",
    description: "Government liaison, work visas and labor documentation.",
  },
  {
    title: "Compliance",
    href: "/services/compliance/",
    description: "Ongoing regulatory compliance, renewals and filings.",
  },
  {
    title: "Property Management",
    href: "/services/property-management/",
    description: "Commercial and residential property management.",
  },
]

export const NAV_LINKS = [
  { title: "Home", href: "/" },
  { title: "About Us", href: "/about-us/" },
  { title: "India", href: "/sinai-spark-india/" },
  { title: "Research", href: "/research/" },
  { title: "Blog", href: "/blog/" },
  { title: "FAQs", href: "/faqs/" },
] as const

export const CTA_LABEL = "Book a Free Consultation"
