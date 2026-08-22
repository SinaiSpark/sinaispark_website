/**
 * ASSET_MANIFEST — single source of truth for site imagery (IMPLEMENTATION_PLAN.md §12).
 *
 * Every image used in the UI must be registered here with alt text, focal point,
 * and license status. Placeholder assets are royalty-free (Wikimedia Commons)
 * and must be replaced with client-provided or purchased photography before launch.
 */

export type ImageAssetStatus = "placeholder" | "licensed" | "client"

export interface ImageAsset {
  src: string
  /** Descriptive alt text per SEO checklist — natural keyword use, no stuffing. */
  alt: string
  /** CSS object-position value documenting the focal point. */
  focal?: string
  credit?: string
  license?: string
  status: ImageAssetStatus
}

export const IMAGES = {
  homeHero: {
    src: "/images/home/riyadh-skyline-kafd-dusk.jpg",
    alt: "Riyadh skyline at dusk featuring the King Abdullah Financial District and Kingdom Tower",
    focal: "center 60%",
    credit: "B.alotaby",
    license: "CC BY-SA 4.0 via Wikimedia Commons",
    status: "placeholder",
  },
  countrySaudiArabia: {
    src: "/images/countries/saudi-arabia-riyadh.jpg",
    alt: "Al Faisaliah Tower in Riyadh, Saudi Arabia",
    focal: "center 40%",
    credit: "Hamza A. Durrani",
    license: "CC BY-SA 4.0 via Wikimedia Commons",
    status: "placeholder",
  },
  countryUae: {
    src: "/images/countries/uae-dubai.jpg",
    alt: "Dubai skyline with Burj Khalifa, United Arab Emirates",
    focal: "center",
    credit: "Tim Reckmann",
    license: "CC BY 2.0 via Wikimedia Commons",
    status: "placeholder",
  },
  countryUk: {
    src: "/images/countries/uk-london.jpg",
    alt: "Canary Wharf financial district skyline, London, United Kingdom",
    focal: "center",
    credit: "King of Hearts",
    license: "CC BY-SA 4.0 via Wikimedia Commons",
    status: "placeholder",
  },
  countryBahrain: {
    src: "/images/countries/bahrain-manama.jpg",
    alt: "Bahrain World Trade Center towers, Manama",
    focal: "center",
    credit: "B.alotaby",
    license: "CC BY-SA 4.0 via Wikimedia Commons",
    status: "placeholder",
  },
  indiaMumbai: {
    src: "/images/india/mumbai-business-district.jpg",
    alt: "Bandra-Worli Sea Link and Mumbai business district skyline, India",
    focal: "center",
    credit: "Arjuncm3",
    license: "CC BY-SA 3.0 via Wikimedia Commons",
    status: "placeholder",
  },
  serviceBusinessSetup: {
    src: "/images/services/business-setup-meeting.jpg",
    alt: "Consultants and clients discussing a company formation plan in a business meeting",
    focal: "center",
    credit: "Dannel Malloy",
    license: "CC BY 2.0 via Wikimedia Commons",
    status: "placeholder",
  },
  serviceLegal: {
    src: "/images/services/legal-contract-review.jpg",
    alt: "Reviewing and signing a legal contract document",
    focal: "center",
    credit: "Blogtrepreneur",
    license: "CC BY 2.0 via Wikimedia Commons",
    status: "placeholder",
  },
  serviceLicensing: {
    src: "/images/services/licensing-documents.jpg",
    alt: "Passport pages with official entry stamps and licensing documentation",
    focal: "center",
    credit: "Evan",
    license: "CC BY 2.0 via Wikimedia Commons",
    status: "placeholder",
  },
  serviceProVisa: {
    src: "/images/services/pro-visa-passport.jpg",
    alt: "Stack of international passports prepared for visa processing",
    focal: "center",
    credit: "Sharon Hahn Darlin",
    license: "CC BY 2.0 via Wikimedia Commons",
    status: "placeholder",
  },
  serviceProperty: {
    src: "/images/services/property-commercial-building.jpg",
    alt: "Bahrain Financial Harbour commercial towers on the waterfront",
    focal: "center",
    credit: "ChinitoBoy",
    license: "CC BY 2.0 via Wikimedia Commons",
    status: "placeholder",
  },
  regionalJeddah: {
    src: "/images/regional/jeddah-corniche.jpg",
    alt: "Jeddah Corniche waterfront at night, Saudi Arabia's trade gateway on the Red Sea",
    focal: "center",
    credit: "Joseph Azrak",
    license: "CC BY-SA 4.0 via Wikimedia Commons",
    status: "placeholder",
  },
  regionalDammam: {
    src: "/images/regional/dammam-waterfront.jpg",
    alt: "King Fahd Causeway bridge connecting the Eastern Province to Bahrain",
    focal: "center",
    credit: "Greens n cornbread",
    license: "CC BY 2.0 via Wikimedia Commons",
    status: "placeholder",
  },
  aboutTeam: {
    src: "/images/about/team-strategy-meeting.jpg",
    alt: "Advisor presenting a market-entry strategy to an audience of professionals",
    focal: "center",
    credit: "ITS International Conference",
    license: "CC BY-SA 2.0 via Wikimedia Commons",
    status: "placeholder",
  },
  aboutHandshake: {
    src: "/images/about/sinaispark-handshake.jpg",
    alt: "Two business professionals shaking hands in a modern Riyadh office",
    focal: "center",
    credit: "AI Generated",
    license: "Proprietary",
    status: "approved",
  },
  aboutMeeting: {
    src: "/images/about/sinaispark-meeting.jpg",
    alt: "Corporate strategy meeting in a sleek boardroom",
    focal: "center",
    credit: "AI Generated",
    license: "Proprietary",
    status: "approved",
  },
  aboutDocument: {
    src: "/images/about/sinaispark-document.jpg",
    alt: "Signing a corporate document with a gold pen",
    focal: "center",
    credit: "AI Generated",
    license: "Proprietary",
    status: "approved",
  },
} as const satisfies Record<string, ImageAsset>

export type ImageKey = keyof typeof IMAGES

/** Lookup helper returning null when an asset slot has no approved asset yet. */
export function getImage(key: ImageKey): ImageAsset | null {
  return (IMAGES as Record<ImageKey, ImageAsset>)[key] ?? null
}

/**
 * Slots still awaiting imagery (Commons search found nothing suitable).
 * Components must degrade gracefully when these are absent.
 */
export const PENDING_IMAGE_SLOTS = [
  "services/compliance-planning",
  "research/reports-analysis-desk",
] as const
