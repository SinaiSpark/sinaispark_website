import type { ImageKey } from "@/lib/images"

/**
 * Country landing pages under /where-we-work/ (Decision #6 — placeholders,
 * expandable to full landing pages). India has its own landing page and is
 * deliberately absent here; the hub links it via HOME.globalPresence.
 */
export interface CountryPage {
  name: string
  imageKey: ImageKey
  summary: string
  /** Which approved service best represents this market today. */
  relatedService: string
}

export const COUNTRIES: Record<string, CountryPage> = {
  "saudi-arabia": {
    name: "Saudi Arabia",
    imageKey: "countrySaudiArabia",
    summary:
      "Our flagship market. Complete business setup, licensing, PRO and compliance support across Riyadh, Jeddah and Dammam.",
    relatedService: "/services/administrative-solutions/",
  },
  uae: {
    name: "United Arab Emirates",
    imageKey: "countryUae",
    summary:
      "Market entry across the Gulf's commercial hub. A full UAE practice page is in preparation.",
    relatedService: "/services/",
  },
  uk: {
    name: "United Kingdom",
    imageKey: "countryUk",
    summary:
      "UK expansion and compliance support for international businesses. A dedicated UK page is in preparation.",
    relatedService: "/services/legal-services/",
  },
  bahrain: {
    name: "Bahrain",
    imageKey: "countryBahrain",
    summary:
      "GCC market entry with local insight. A dedicated Bahrain page is in preparation.",
    relatedService: "/services/compliance/",
  },
}

export function getCountry(slug: string): CountryPage | null {
  return COUNTRIES[slug] ?? null
}
