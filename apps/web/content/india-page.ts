/**
 * Presentation copy for the India landing page.
 *
 * The client's own words live in content/india.ts and are rendered verbatim.
 * What sits here is the framing the design added around them: the short titles
 * the audience rows and why-us tiles are headed with, the certificate mock-up
 * in the hero, and the two-city bridge.
 */

export const INDIA_PAGE = {
  /** Short headings for the five audience rows, in the order india.ts lists them. */
  audienceTitles: [
    "NRIs in Saudi Arabia",
    "Saudi businesses entering India",
    "First-time Indian founders",
    "Freelancers going formal",
    "India–Gulf cross-border businesses",
  ],
  audiences: {
    headline: "Built for founders who are not in India.",
    lede: "Five situations we see every week, all handled without a single visit to a government office.",
    link: { label: "Choose a structure", href: "#structure" },
  },

  /** Short headings for the six why-us tiles. The second is rendered as a stat. */
  whyTitles: [
    "100% online",
    "7–10 working days",
    "Hindi & English",
    "Always MCA compliant",
    "One account manager",
    "India + Saudi expertise",
  ],
  why: {
    eyebrow: "Why Sinai Spark India",
    headline: "Fast, compliant and in your language.",
    /** The highlighted tile splits its title so the figure can be coloured. */
    featureIndex: 1,
    featureFigure: "7–10",
    featureRest: "working days",
  },

  structures: {
    headline: "Four structures. Pick by what you plan to do.",
    lede: "Investment-ready, partnership-friendly, solo, or the cheapest way to test an idea.",
    popularLabel: "Most popular",
    kicker: "Structure",
    bestForLabel: "Best for",
    keyPointsLabel: "Key points",
    ctaPrefix: "Register as",
    footnote: "The right structure is confirmed at the free consultation.",
    /** Abbreviations used on the panel's button. */
    short: ["Pvt Ltd", "LLP", "OPC", "Proprietorship"],
    dwell: 4500,
  },

  included: {
    eyebrow: "What we handle",
    headline: "Everything from incorporation to the bank account.",
    cta: { label: "Get the document checklist", href: "/#consult" },
  },

  process: {
    headline: "Four steps, fully online.",
    note: "Private Limited companies are typically incorporated in 7 to 10 working days.",
  },

  /** The incorporation certificate that types itself out in the hero. */
  certificate: {
    authority: "Ministry of Corporate Affairs",
    form: "Form INC-11",
    title: "Certificate of Incorporation",
    company: "Your Company Private Limited",
    /** Illustrative number; it is animated character by character. */
    cin: "U74999MH2026PTC412807",
    rows: [
      { label: "Status", value: "Active · Registered from the Gulf, online" },
      { label: "Directors", value: "NRI, resident in Saudi Arabia" },
    ],
    cinLabel: "CIN",
    kit: ["DIN", "DSC", "MOA / AOA", "PAN", "GST", "IEC"],
    stamp: "Issued",
  },

  /** The Riyadh-to-Mumbai route pill under the certificate. */
  route: {
    from: { city: "Riyadh", timeZone: "Asia/Riyadh" },
    to: { city: "Mumbai", timeZone: "Asia/Kolkata" },
    note: "· 0 flights",
  },

  bridge: {
    headline: "Own an Indian company from the Gulf.",
    from: {
      label: "Riyadh · KSA",
      title: "You are here",
      timeZone: "Asia/Riyadh",
    },
    to: {
      label: "Mumbai · MCA",
      title: "Company registered",
      timeZone: "Asia/Kolkata",
    },
    zero: { figure: "0", label: "Visits to India" },
  },

  pricing: {
    eyebrow: "Packages",
    headline: "Simple packages, clear scope.",
    /** The fees in india.ts are placeholders, and the page says so. */
    mockBadge: "Indicative fees · final pricing pending client",
    feeSuffix: "+ govt fees",
    choosePrefix: "Choose",
  },

  faq: {
    eyebrow: "FAQ",
    headline: "Questions NRIs ask us.",
    lede: "Client-supplied answers for Gulf-based founders.",
    link: { label: "Ask your own", href: "/#consult" },
  },

  cta: {
    eyebrow: "Sinai Spark India",
    secondary: { label: "See the FAQs", href: "#faq" },
    primary: { label: "Register my Indian company", href: "/#consult" },
  },

  hero: {
    /** Where the two hero buttons point. */
    primary: "/#consult",
    secondary: "#how",
  },
} as const

/**
 * The globe behind the NRI bridge: one arc from each market we operate in
 * into Mumbai, which is the whole point of the section — the company gets
 * registered in India without the client leaving the Gulf.
 *
 * Riyadh leads in the India accent (--saff); the rest carry the brand teals.
 * `order` staggers the arcs so they draw one after another rather than all at
 * once, and `arcAlt` is how high each one bows — the London arc is the long
 * one, so it rides highest.
 */
const MUMBAI = { lat: 19.076, lng: 72.8777 }

export const BRIDGE_GLOBE = {
  config: {
    pointSize: 4,
    globeColor: "#0E2A4E",
    showAtmosphere: true,
    atmosphereColor: "#3CC9D2",
    atmosphereAltitude: 0.12,
    emissive: "#071528",
    emissiveIntensity: 0.14,
    shininess: 0.9,
    polygonColor: "rgba(238, 243, 244, 0.78)",
    ambientLight: "#16959F",
    directionalLeftLight: "#ffffff",
    directionalTopLight: "#ffffff",
    pointLight: "#ffffff",
    arcTime: 3000,
    /*
     * With a single route there is nothing else on screen to cover the gap in
     * the dash, so a break reads as the line being broken rather than as
     * movement. Keep the gap tiny: the arc is drawn ~92% of the time and the
     * short break glides along it.
     */
    arcLength: 0.92,
    arcDashGap: 0.08,
    arcStroke: 0.55,
    rings: 1,
    maxRings: 3,
    /**
     * Held still, facing the Gulf and India. Left spinning, the corridor the
     * section is about drifts off the front within a few seconds and the
     * sphere reads as decoration rather than as the route being described.
     */
    initialPosition: { lat: 21, lng: 60 },
    autoRotate: false,
    autoRotateSpeed: 0.3,
  },
  /**
   * One route, because the section labels exactly two places: the card that
   * says "You are here" and the card that says "Company registered". Adding
   * Dubai, Manama and London put three more arcs and six more points within a
   * few degrees of Riyadh, which read as a blob rather than as a journey.
   */
  arcs: [
    {
      order: 1,
      startLat: 24.7136,
      startLng: 46.6753,
      endLat: MUMBAI.lat,
      endLng: MUMBAI.lng,
      arcAlt: 0.28,
      color: "#F4A340",
    },
  ],
}
