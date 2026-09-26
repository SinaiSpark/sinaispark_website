import { ROUTES } from "@/content/site"

/**
 * Contact page copy. The details themselves (email, phone, WhatsApp, social
 * links and the offices) are edited in the CMS under Contact details; while
 * its "Still placeholder details" switch is on, the page flags them as
 * pending rather than presenting them as confirmed.
 */

/**
 * A desk's working week, used to show "open now" or "closed" beside its clock.
 * `days` are JavaScript weekday numbers (0 = Sunday), and the hours are local
 * to that desk — Saudi Arabia and Bahrain run Sunday to Thursday, the rest
 * Monday to Friday.
 */
export interface Desk {
  city: string
  hours: string
  timeZone: string
  days: number[]
  opensAt: number
  closesAt: number
}

const GULF_WEEK = [0, 1, 2, 3, 4]
const WESTERN_WEEK = [1, 2, 3, 4, 5]

export const CONTACT = {
  hero: {
    image: "/images/home/riyadh-skyline-kafd-dusk.jpg",
    crumb: "Contact",
    headline: "Tell us where you're headed.",
    lede: "A free thirty-minute consultation with the specialist for your market, then a clear scope and clear pricing in writing. Or just pick up the phone.",
    primary: { label: "Book the call", href: "#form" },
    /** Links to WhatsApp; left out when no number is set. */
    secondary: { label: "WhatsApp us" },
  },

  spy: [
    { id: "form", label: "Book a call" },
    { id: "direct", label: "Direct lines" },
    { id: "offices", label: "Offices" },
    { id: "faq", label: "FAQ" },
  ],
  spyExtra: { label: "All services", href: ROUTES.services },

  /** The live status card in the hero. */
  desks: {
    label: "On the ground · live",
    count: "5 desks",
    reply: "We reply within one business day, in English, Arabic or Hindi.",
    open: "Open now",
    closed: "Closed",
    pending: "…",
    items: [
      {
        city: "Riyadh",
        hours: "Sun–Thu · 09:00–18:00",
        timeZone: "Asia/Riyadh",
        days: GULF_WEEK,
        opensAt: 9,
        closesAt: 18,
      },
      {
        city: "Dubai",
        hours: "Mon–Fri · 09:00–18:00",
        timeZone: "Asia/Dubai",
        days: WESTERN_WEEK,
        opensAt: 9,
        closesAt: 18,
      },
      {
        city: "Mumbai",
        hours: "Mon–Fri · 10:00–18:00",
        timeZone: "Asia/Kolkata",
        days: WESTERN_WEEK,
        opensAt: 10,
        closesAt: 18,
      },
      {
        city: "London",
        hours: "Mon–Fri · 09:00–17:30",
        timeZone: "Europe/London",
        days: WESTERN_WEEK,
        opensAt: 9,
        closesAt: 17.5,
      },
      {
        city: "Manama",
        hours: "Sun–Thu · 09:00–18:00",
        timeZone: "Asia/Bahrain",
        days: GULF_WEEK,
        opensAt: 9,
        closesAt: 18,
      },
    ] satisfies Desk[],
  },

  /** The consultation form, reused from the home page with its own framing. */
  form: {
    headline: "Thirty minutes, the right specialist.",
  },

  direct: {
    eyebrow: "Direct lines",
    headline: "Or skip the form.",
    note: "Number and handles pending client confirmation",
    pendingLabel: "Pending",
    email: { kicker: "Email", note: "Answered within one business day" },
    phone: { kicker: "Phone", note: "Riyadh office, Sun–Thu 09:00–18:00 AST" },
    whatsapp: {
      kicker: "WhatsApp",
      note: "Fastest for quick questions",
      value: "Chat on WhatsApp",
    },
    social: { kicker: "Follow", note: "Regulatory updates as they land" },
  },

  offices: {
    eyebrow: "Offices",
    headline: "Three Saudi offices, four desks abroad.",
    note: "Addresses are placeholders pending client data",
    hoursLabel: "Hours",
    hoursNote:
      "Saudi Arabia and Bahrain run Sunday to Thursday; Dubai, Mumbai and London Monday to Friday. The clocks above are live.",
    /** The site's own photo for an office with none uploaded in the CMS. */
    images: {
      Riyadh: "/images/countries/saudi-arabia-riyadh.jpg",
      Jeddah: "/images/regional/jeddah-corniche.jpg",
      Dammam: "/images/regional/dammam-waterfront.jpg",
      Dubai: "/images/countries/uae-dubai.jpg",
      London: "/images/countries/uk-london.jpg",
      Manama: "/images/countries/bahrain-manama.jpg",
      Mumbai: "/images/india/mumbai-business-district.jpg",
    } as Record<string, string>,
    defaultImage: "/images/home/riyadh-skyline-kafd-dusk.jpg",
    remote: [
      { city: "Dubai", market: "UAE desk", timeZone: "Asia/Dubai" },
      { city: "Mumbai", market: "India desk", timeZone: "Asia/Kolkata" },
      { city: "London", market: "UK desk", timeZone: "Europe/London" },
      { city: "Manama", market: "Bahrain desk", timeZone: "Asia/Bahrain" },
    ],
  },

  faq: {
    eyebrow: "Before you write",
    headline: "Questions we answer on the first call.",
    lede: "Short answers here; the full set lives on the FAQ page.",
    link: { label: "All FAQs", href: ROUTES.faq },
  },

  cta: {
    eyebrow: "Prefer to talk first?",
    headline: "We're one message away.",
    lede: "WhatsApp is fastest for a quick question; the form is best when you want a written scope.",
    /** Links to WhatsApp; left out when no number is set. */
    secondary: { label: "Chat on WhatsApp" },
    primary: { label: "Book the call", href: "#form" },
  },
} as const
