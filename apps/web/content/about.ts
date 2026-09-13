import { ROUTES } from "@/content/site"

/**
 * About page copy.
 *
 * The story, the values and "what sets us apart" are drawn from the approved
 * content document; the four chapters are the same history told as a sequence,
 * which is what the page's scrubbed rail needs. Mission, vision and the team
 * are the shared sections and keep their own content files.
 */

export const ABOUT = {
  hero: {
    image: "/images/about/sinaispark-handshake.jpg",
    crumb: "About",
    headline: "Built to close the gap between ambition and regulation.",
    lede: "A business advisory and corporate solutions firm for market entry. Saudi Arabia is the flagship; the UAE, the UK, India and Bahrain are where the same team goes next.",
    primary: { label: "Meet the team", href: "#team" },
    secondary: { label: "Our story", href: "#story" },
    stats: [
      { value: 5, label: "Markets" },
      { value: 3, label: "Saudi offices" },
      { value: 1, label: "Point of contact" },
    ],
  },

  spy: [
    { id: "story", label: "Story" },
    { id: "mission", label: "Mission" },
    { id: "values", label: "Values" },
    { id: "team", label: "Team" },
    { id: "where", label: "Where" },
  ],
  spyExtra: { label: "Talk to us", href: ROUTES.consult },

  /**
   * Same shape as HOME's "who we are", so the two share one component: a
   * parallax stack of three photographs beside the positioning statement.
   */
  story: {
    eyebrow: "Our story",
    headline:
      "From a Saudi formation service to a global corporate solutions firm.",
    lede: "Sinai Spark Global was founded to close the gap between international ambition and the fast-evolving regulatory landscape of the markets our clients want to enter. What began as a company formation service focused on Saudi Arabia has grown into a full corporate solutions firm with active reach across the UAE, the UK, India and Bahrain, supporting clients from their first registration through years of ongoing operation.",
    quote:
      "“We work as a local partner in each market rather than a paperwork processor, translating an unfamiliar regulatory system into a clear, predictable path to market entry.”",
    images: [
      {
        src: "/images/about/sinaispark-meeting.jpg",
        alt: "Sinai Spark team in a client meeting",
        speed: "0.9",
      },
      {
        src: "/images/home/riyadh-skyline-kafd-dusk.jpg",
        alt: "The Riyadh skyline at dusk",
        speed: "1.15",
      },
      {
        src: "/images/about/team-strategy-meeting.jpg",
        alt: "Strategy session",
        speed: "1.05",
      },
    ],
    chip: { badge: "KSA", text: "Flagship market since day one" },
  },

  /** How the firm grew — a real sequence, so the rail's numbering earns itself. */
  chapters: {
    eyebrow: "How the firm grew",
    headline: "Four chapters, in the order clients needed them.",
    stepLabel: "Chapter",
    note: "Every chapter is still a live practice today.",
    cta: { label: "See the five services", href: ROUTES.services },
    steps: [
      {
        title: "A formation service in Riyadh",
        body: "Company formation and MISA registration for foreign investors, done properly the first time.",
      },
      {
        title: "Licensing, PRO and the ministries",
        body: "The five licence classes, work visas and daily government liaison, so clients stopped needing three vendors.",
      },
      {
        title: "Legal, compliance and property",
        body: "Contracts read in their own language, renewals tracked, premises managed: the full life of a company, not just its birth.",
      },
      {
        title: "Five markets, one team",
        body: "The UAE, the UK, India and Bahrain joined the Kingdom, with Sinai Spark India serving NRI founders entirely online.",
      },
    ],
  },

  apart: {
    eyebrow: "What sets us apart",
    headline: "A partner, not a paperwork processor.",
    lede: "Three things clients tell us they could not get from a formation agent.",
    link: { label: "Talk to us", href: ROUTES.consult },
    rows: [
      {
        title: "One point of contact",
        body: "A single team across formation, licensing, legal and compliance — nothing falls between departments.",
      },
      {
        title: "On the ground in the Kingdom",
        body: "Hands-on experience across Riyadh, Jeddah and Dammam, with the ministry relationships that come from doing the work locally.",
      },
      {
        title: "A cross-border perspective",
        body: "Active operations spanning Saudi Arabia, the UAE, the UK, India and Bahrain, so structures are designed with the next market in mind.",
      },
    ],
  },

  values: {
    eyebrow: "Our values",
    headline: "What we hold ourselves to.",
    lede: "Written down so a client can hold us to them too.",
    items: [
      {
        name: "Trust",
        kicker: "Clear, honest guidance at every stage",
        body: "If a timeline is unrealistic we say so before you sign, not after.",
      },
      {
        name: "Precision",
        kicker: "No shortcuts on regulatory detail",
        body: "An attestation missed in week one costs a month in week six. We read every line.",
      },
      {
        name: "Partnership",
        kicker: "Success measured by client outcomes",
        body: "The engagement ends when you are operating, not when the certificate is issued.",
      },
    ],
  },

  where: {
    eyebrow: "Where we work",
    headline: "Five markets, one accountable team.",
    link: { label: "See Sinai Spark India", href: ROUTES.india },
  },

  cta: {
    eyebrow: "Start the conversation",
    headline: "Let's build your market entry together.",
    lede: "A free thirty-minute call with the specialist for your market, then a clear scope in writing.",
    secondary: { label: "See the services", href: ROUTES.services },
    primary: { label: "Book a free consultation", href: ROUTES.consult },
  },
} as const
