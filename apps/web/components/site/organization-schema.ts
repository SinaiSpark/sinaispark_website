import { SITE } from "@/lib/site-config"

/**
 * LocalBusiness / ProfessionalService schema for the Home page (SEO checklist):
 * three office locations (Riyadh, Jeddah, Dammam) with sameAs social references.
 */
export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: SITE.name,
    slogan: SITE.tagline,
    url: SITE.url,
    email: SITE.email,
    telephone: SITE.phone,
    description: SITE.description,
    areaServed: ["SA", "AE", "GB", "IN", "BH"],
    sameAs: [SITE.socials.instagram, SITE.socials.linkedin, SITE.socials.youtube],
    location: SITE.offices.map((office) => ({
      "@type": "Place",
      name: `${SITE.name} — ${office.label}`,
      address: {
        "@type": "PostalAddress",
        addressLocality: office.city,
        addressCountry: "SA",
      },
    })),
  }
}
