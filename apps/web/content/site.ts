/**
 * Site-wide copy: brand line, navigation, mega menu, mobile sheet, footer and
 * the live clock strip. Everything the chrome renders is here, so wording and
 * link targets can be changed without touching a component.
 *
 * Lifted from the approved design (home.html nav / nav-sheet / footer).
 */

export interface NavLink {
  label: string
  href: string
}

export interface MegaItem extends NavLink {
  /** Second line inside the mega menu. Licences deliberately have none. */
  description?: string
}

/** Canonical routes, referenced everywhere instead of raw strings. */
export const ROUTES = {
  home: "/",
  services: "/services/",
  licences: "/licences/",
  india: "/india/",
  about: "/about/",
  blog: "/blog/",
  events: "/events/",
  research: "/research/",
  contact: "/contact/",
  faq: "/faqs/",
  service: (slug: string) => `/services/${slug}/`,
  licence: (slug: string) => `/licences/${slug}/`,
  blogPost: (slug: string) => `/blog/${slug}/`,
  event: (slug: string) => `/events/${slug}/`,
  researchArticle: (slug: string) => `/research/${slug}/`,
  /**
   * Anchors. `consult` is the consultation form, the site's only one, on the
   * contact page. Every "book a consultation" leads there; the form records
   * the page the visitor came from and preselects its service.
   */
  consult: "/contact/#form",
  team: "/about/#team",
  markets: "/#markets",
} as const

/**
 * The consultation form with fields preselected, for buttons that know more
 * than their page does (an India package, a market tile). Values must match
 * the form's options in content/home.ts (CONSULT); anything else is ignored.
 */
export function consultHref(prefill: {
  service?: string
  market?: string
  plan?: string
}) {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(prefill)) {
    if (value) params.set(key, value)
  }
  const query = params.toString()
  return `${ROUTES.contact}${query ? `?${query}` : ""}#form`
}

export const BRAND = {
  name: "Sinai Spark Global",
  homeAriaLabel: "Sinai Spark Global home",
  /** Footer blurb under the logo. */
  blurb:
    "Business advisory and corporate solutions for market entry. Saudi Arabia flagship, footprint across five markets.",
  copyright: "© 2026 Sinai Spark Global",
  officeLine: "Riyadh · Dubai · Mumbai · London · Manama",
} as const

export const NAV = {
  /** Top-level links to the right of the Services dropdown. */
  links: [
    { label: "Where we work", href: ROUTES.markets },
    { label: "India", href: ROUTES.india },
    { label: "About", href: ROUTES.about },
    { label: "Team", href: ROUTES.team },
    { label: "Blog", href: ROUTES.blog },
    { label: "Events", href: ROUTES.events },
    { label: "Research", href: ROUTES.research },
  ] satisfies NavLink[],
  cta: { label: "Book a consultation", href: ROUTES.consult },
  burger: { open: "Menu", close: "Close" },
} as const

/** The Services dropdown: two link columns and a feature tile. */
export const MEGA: {
  trigger: NavLink
  columns: { heading: string; items: MegaItem[] }[]
  feature: { image: string; title: string; body: string; cta: NavLink }
} = {
  trigger: { label: "Services", href: ROUTES.services },
  columns: [
    {
      heading: "Services",
      items: [
        {
          label: "Business setup in Saudi Arabia",
          href: ROUTES.service("administrative-solutions"),
          description:
            "Company formation, MISA registration and dispute support.",
        },
        {
          label: "Legal & regulatory advisory",
          href: ROUTES.service("legal-services"),
          description:
            "Contracts, regulatory interpretation and structuring advice.",
        },
        {
          label: "PRO & visa services",
          href: ROUTES.service("pro-visa-services"),
          description:
            "Government liaison, work visas and labour documentation.",
        },
        {
          label: "Compliance",
          href: ROUTES.service("compliance"),
          description:
            "Renewals, annual filings and ongoing regulatory upkeep.",
        },
        {
          label: "Property management",
          href: ROUTES.service("property-management"),
          description: "Commercial and residential property, fully managed.",
        },
      ] satisfies MegaItem[],
    },
    {
      heading: "Business licensing",
      items: [
        {
          label: "Commercial license",
          href: ROUTES.licence("commercial-license"),
        },
        {
          label: "Industrial license",
          href: ROUTES.licence("industrial-license"),
        },
        {
          label: "Entrepreneurial license",
          href: ROUTES.licence("entrepreneurial-license"),
        },
        { label: "Service license", href: ROUTES.licence("service-license") },
        {
          label: "Real estate license",
          href: ROUTES.licence("real-estate-license"),
        },
      ] satisfies MegaItem[],
    },
  ],
  feature: {
    image: "/images/services/service-licensing.jpg",
    title: "Not sure which licence fits your activity?",
    body: "A 30-minute call is enough to tell you the class, the capital and the timeline.",
    cta: { label: "Book a free consultation", href: ROUTES.consult },
  },
}

/** Mobile sheet: oversized primary links, then two compact link grids. */
export const SHEET = {
  primary: [
    { label: "Where we work", href: ROUTES.markets },
    { label: "India", href: ROUTES.india },
    { label: "About", href: ROUTES.about },
    { label: "Team", href: ROUTES.team },
    { label: "Blog", href: ROUTES.blog },
    { label: "Events", href: ROUTES.events },
    { label: "Research", href: ROUTES.research },
    { label: "Contact", href: ROUTES.contact },
  ] satisfies NavLink[],
  groups: [
    {
      heading: "Services",
      items: [
        {
          label: "Business setup",
          href: ROUTES.service("administrative-solutions"),
        },
        { label: "Legal advisory", href: ROUTES.service("legal-services") },
        { label: "PRO & visa", href: ROUTES.service("pro-visa-services") },
        { label: "Compliance", href: ROUTES.service("compliance") },
        {
          label: "Property management",
          href: ROUTES.service("property-management"),
        },
      ] satisfies NavLink[],
    },
    {
      heading: "Business licensing",
      items: [
        { label: "Commercial", href: ROUTES.licence("commercial-license") },
        { label: "Industrial", href: ROUTES.licence("industrial-license") },
        {
          label: "Entrepreneurial",
          href: ROUTES.licence("entrepreneurial-license"),
        },
        { label: "Service", href: ROUTES.licence("service-license") },
        { label: "Real estate", href: ROUTES.licence("real-estate-license") },
      ] satisfies NavLink[],
    },
  ],
  cta: { label: "Book a free consultation", href: ROUTES.consult },
} as const

/**
 * Live clocks. Rendered as `--:--` on the server and filled in on the client,
 * so the markup never disagrees with the server render.
 */
export interface Clock {
  city: string
  timeZone: string
}

export const CLOCKS: Clock[] = [
  { city: "Riyadh", timeZone: "Asia/Riyadh" },
  { city: "Dubai", timeZone: "Asia/Dubai" },
  { city: "Mumbai", timeZone: "Asia/Kolkata" },
  { city: "London", timeZone: "Europe/London" },
  { city: "Manama", timeZone: "Asia/Bahrain" },
]

export const FOOTER = {
  columns: [
    {
      heading: "Services",
      items: [
        {
          label: "Business setup",
          href: ROUTES.service("administrative-solutions"),
        },
        { label: "Legal advisory", href: ROUTES.service("legal-services") },
        { label: "Licensing", href: ROUTES.licences },
        { label: "PRO & visa", href: ROUTES.service("pro-visa-services") },
        { label: "Compliance", href: ROUTES.service("compliance") },
      ] satisfies NavLink[],
    },
    {
      heading: "Markets",
      items: [
        { label: "Saudi Arabia", href: ROUTES.markets },
        { label: "United Arab Emirates", href: ROUTES.markets },
        { label: "India", href: ROUTES.india },
        { label: "United Kingdom", href: ROUTES.markets },
        { label: "Bahrain", href: ROUTES.markets },
      ] satisfies NavLink[],
    },
    {
      heading: "Company",
      items: [
        { label: "About us", href: ROUTES.about },
        { label: "Research", href: ROUTES.research },
        { label: "Blog", href: ROUTES.blog },
        { label: "Events", href: ROUTES.events },
        { label: "FAQs", href: ROUTES.faq },
        { label: "Contact", href: ROUTES.contact },
      ] satisfies NavLink[],
    },
  ],
  legal: [
    { label: "Privacy", href: ROUTES.contact },
    { label: "Terms", href: ROUTES.contact },
  ] satisfies NavLink[],
}
