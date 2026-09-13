import { faqs } from "@/content/faqs"
import { ROUTES } from "@/content/site"

/**
 * Contact page copy.
 *
 * PENDING_CLIENT_DATA: the phone number is the one on the current live site
 * and the street addresses are placeholders. Both are flagged on the page
 * itself rather than presented as confirmed.
 */

const WHATSAPP = "https://wa.me/966510013160"

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
    secondary: { label: "WhatsApp us", href: WHATSAPP },
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
    email: {
      kicker: "Email",
      note: "Answered within one business day",
      value: "info@sinaispark.com",
      href: "mailto:info@sinaispark.com",
    },
    phone: {
      kicker: "Phone",
      note: "Riyadh office, Sun–Thu 09:00–18:00 AST",
      value: "+966 51 001 3160",
      href: "tel:+966510013160",
      pending: true,
    },
    whatsapp: {
      kicker: "WhatsApp",
      note: "Fastest for quick questions",
      value: "Chat on WhatsApp",
      href: WHATSAPP,
    },
    social: {
      kicker: "Follow",
      note: "Regulatory updates as they land",
      links: [
        { label: "LinkedIn", href: "https://linkedin.com/company/sinaispark" },
        { label: "Instagram", href: "https://instagram.com/sinaispark" },
        { label: "YouTube", href: "https://youtube.com/@sinaispark" },
      ],
    },
  },

  offices: {
    eyebrow: "Offices",
    headline: "Three Saudi offices, four desks abroad.",
    note: "Addresses are placeholders pending client data",
    hoursLabel: "Hours",
    hoursNote:
      "Saudi Arabia and Bahrain run Sunday to Thursday; Dubai, Mumbai and London Monday to Friday. The clocks above are live.",
    items: [
      {
        name: "Riyadh",
        kicker: "Capital · HQ",
        image: "/images/countries/saudi-arabia-riyadh.jpg",
        timeZone: "Asia/Riyadh",
        body: "The Kingdom's capital and economic centre. Licensing, PRO and GRO, project support.",
        address: "King Fahd Road, Olaya District",
      },
      {
        name: "Jeddah",
        kicker: "Trade gateway",
        image: "/images/regional/jeddah-corniche.jpg",
        timeZone: "Asia/Riyadh",
        body: "Tax, compliance and corporate advisory for import- and export-facing businesses.",
        address: "Tahlia Street, Al Ruwais District",
      },
      {
        name: "Dammam",
        kicker: "Industrial hub",
        image: "/images/regional/dammam-waterfront.jpg",
        timeZone: "Asia/Riyadh",
        body: "The Eastern Province's industrial hub. Complete legal and operational support.",
        address: "Corniche Road, Al Shati District",
      },
    ],
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
    lede: "Short answers here; the full set lives on the homepage FAQ.",
    link: { label: "All FAQs", href: ROUTES.faq },
    /** One question specific to this page, then three from the approved set. */
    items: [
      {
        question: "What happens on the free consultation call?",
        answer:
          "Thirty minutes with the specialist for your market. We map the structure, the licence class and a realistic timeline, then follow up in writing with a clear scope and clear pricing. No obligation.",
      },
      ...[1, 0, 6].flatMap((i) => faqs[i] ?? []),
    ],
  },

  cta: {
    eyebrow: "Prefer to talk first?",
    headline: "We're one message away.",
    lede: "WhatsApp is fastest for a quick question; the form is best when you want a written scope.",
    secondary: { label: "Chat on WhatsApp", href: WHATSAPP },
    primary: { label: "Book the call", href: "#form" },
  },
} as const
