import { ROUTES } from "@/content/site"
import type { FaqCategory } from "@/lib/site-content"

/**
 * FAQ page copy. The questions themselves live in the CMS (FAQ), where each
 * one has a category, which decides its section here, and the pages that
 * repeat it in their own FAQ block.
 */
export const FAQ_PAGE = {
  hero: {
    image: "/images/services/licensing-documents.jpg",
    crumb: "FAQs",
    headline: "Questions we hear every week.",
    lede: "Straight answers on company setup, licences, visas and compliance across Saudi Arabia, the UAE, the UK, India and Bahrain. If yours isn't here, ask us directly.",
    primary: { label: "Ask your own question", href: ROUTES.consult },
    secondary: { label: "All services", href: ROUTES.services },
  },
  spyExtra: { label: "Contact", href: ROUTES.contact },
  link: { label: "Ask your own question", href: ROUTES.consult },
  /** Each category's section, keyed by the CMS category. */
  sections: {
    General: {
      id: "general",
      headline: "Working with us.",
      lede: "How the first call runs and where we operate.",
    },
    "Company setup": {
      id: "setup",
      headline: "Setting up in Saudi Arabia.",
      lede: "What registration takes, how long it runs and who can own what.",
    },
    Licensing: {
      id: "licensing",
      headline: "Choosing the right licence.",
      lede: "The licence classes and how we match one to your activity.",
    },
    "PRO & visas": {
      id: "pro",
      headline: "Government relations and visas.",
      lede: "What PRO services cover and when you need them.",
    },
    Compliance: {
      id: "compliance",
      headline: "Staying compliant.",
      lede: "What happens after formation: renewals, filings and deadlines.",
    },
    India: {
      id: "india",
      headline: "Registering in India.",
      lede: "For NRIs and Gulf-based founders setting up an Indian company.",
    },
  } satisfies Record<
    FaqCategory,
    { id: string; headline: string; lede: string }
  >,
  cta: {
    eyebrow: "Still have questions?",
    headline: "Ask the specialist for your market.",
    lede: "A free thirty-minute call answers the questions specific to your business.",
    secondary: { label: "All services", href: ROUTES.services },
    primary: { label: "Book the call", href: ROUTES.consult },
  },
} as const
