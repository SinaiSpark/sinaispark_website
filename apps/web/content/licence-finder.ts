import { ROUTES } from "@/content/site"

/**
 * The licence finder — the chip picker that appears on both the home page and
 * the licences hub. Picking a chip swaps the panel; the panel cycles on its own
 * until someone clicks.
 *
 * Answers are indicative. The copy says so, because the final class always
 * depends on activity and capital confirmed at the consultation.
 */

export interface FinderOption {
  id: string
  /** Chip label: how a client would describe their own business. */
  chip: string
  /** Panel kicker. */
  kicker: string
  name: string
  tagline: string
  steps: string[]
  /** Where "read more" points on the licences page. */
  href: string
}

export const FINDER = {
  eyebrow: "Licence finder",
  headline: "Which licence fits your activity?",
  lede: "Pick the closest description. We'll show the licence class that usually applies and how it is issued.",
  chipsLabel: "Your activity",
  /** Default call to action on the home page. */
  cta: { label: "Book a consultation", href: "#contact" },
  /** The India answer is a different route, so it gets its own call to action. */
  indiaCta: { label: "Register my Indian company", href: "#india" },
  /** On the licences page the button jumps to the matching section instead. */
  readCta: "Read this licence",
  indiaReadCta: "See Sinai Spark India",
  footnote:
    "Every case is confirmed at the free consultation — activity and capital decide the final class.",
  /** Milliseconds each option stays on screen while auto-cycling. */
  dwell: 4500,
  options: [
    {
      id: "commercial",
      chip: "Trading, wholesale or retail",
      kicker: "Usually applies",
      name: "Commercial license",
      tagline:
        "Wholesale, retail, and general trading licensing for international enterprises.",
      steps: [
        "Activity & capital assessment",
        "MISA application submission",
        "Ministry approval & license delivery",
      ],
      href: ROUTES.licence("commercial-license"),
    },
    {
      id: "industrial",
      chip: "Manufacturing or an industrial site",
      kicker: "Usually applies",
      name: "Industrial license",
      tagline:
        "Manufacturing, fabrication, and industrial site establishment with full foreign equity.",
      steps: [
        "Technical & feasibility review",
        "Ministry of Industry & MISA approvals",
        "Site leasing & environmental permits",
      ],
      href: ROUTES.licence("industrial-license"),
    },
    {
      id: "entrepreneurial",
      chip: "A venture-backed startup",
      kicker: "Usually applies",
      name: "Entrepreneurial license",
      tagline:
        "Low-capital fast-track entry for venture-backed startups and high-growth innovators.",
      steps: [
        "Innovation / VC endorsement verification",
        "Accelerated MISA issuance",
        "Commercial setup & founder enablement",
      ],
      href: ROUTES.licence("entrepreneurial-license"),
    },
    {
      id: "service",
      chip: "Consulting, IT or professional services",
      kicker: "Usually applies",
      name: "Service license",
      tagline:
        "Professional licensing for IT, engineering, management consulting, healthcare, and education.",
      steps: [
        "Sector regulation & activity scoping",
        "Foreign service license filing",
        "Operational activation",
      ],
      href: ROUTES.licence("service-license"),
    },
    {
      id: "real-estate",
      chip: "Property investment or development",
      kicker: "Usually applies",
      name: "Real estate license",
      tagline:
        "Institutional property investment, real estate development, and asset holding.",
      steps: [
        "Investment model classification",
        "REGA & MISA approvals",
        "Title & asset operational setup",
      ],
      href: ROUTES.licence("real-estate-license"),
    },
    {
      id: "india",
      chip: "An Indian company, as an NRI",
      kicker: "A different route",
      name: "Sinai Spark India",
      tagline:
        "A Private Limited Company, LLP or OPC in India, fully online and NRI friendly.",
      steps: [
        "Choose the structure",
        "Digital signatures & MCA filing",
        "Incorporation & bank account",
      ],
      href: ROUTES.india,
    },
  ] satisfies FinderOption[],
}
