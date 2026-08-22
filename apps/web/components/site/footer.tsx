import Link from "next/link"

import { NAV_LINKS, SERVICES, SITE } from "@/lib/site-config"
import { LogoLockup } from "@/components/site/logo"
import { InstagramGlyph, LinkedInGlyph, YouTubeGlyph } from "@/components/site/social-icons"

const socials = [
  { label: "Instagram", href: SITE.socials.instagram, Glyph: InstagramGlyph },
  { label: "LinkedIn", href: SITE.socials.linkedin, Glyph: LinkedInGlyph },
  { label: "YouTube", href: SITE.socials.youtube, Glyph: YouTubeGlyph },
]

export function SiteFooter() {
  const coreServices = SERVICES.filter((s) =>
    [
      "/services/administrative-solutions/",
      "/services/legal-services/",
      "/services/pro-visa-services/",
      "/services/compliance/",
      "/services/property-management/",
    ].includes(s.href)
  )
  const licenses = SERVICES.filter((s) => s.href.startsWith("/services/") && s.href.includes("license"))

  return (
    <footer className="bg-primary-deep text-primary-foreground mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div className="flex flex-col gap-5">
            <LogoLockup tone="navy" />
            <p className="text-primary-foreground/70 max-w-xs text-sm leading-relaxed">
              A global business setup partner with active operations across Saudi
              Arabia, the UAE, the UK, India and Bahrain — Saudi Arabia as our
              flagship market.
            </p>
            <div className="flex items-center gap-3">
              {socials.map(({ label, href, Glyph }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="border-primary-foreground/20 text-primary-foreground/80 hover:border-gold hover:text-gold inline-flex size-10 items-center justify-center rounded-md border transition-colors outline-none focus-visible:ring-3 focus-visible:ring-gold/40"
                >
                  <Glyph className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Footer services" className="flex flex-col gap-2.5">
            <p className="text-gold mb-1 text-xs font-semibold tracking-[0.14em] uppercase">
              Services
            </p>
            {coreServices.map((service) => (
              <Link
                key={service.href}
                href={service.href}
                className="text-primary-foreground/75 hover:text-gold w-fit text-sm transition-colors outline-none focus-visible:text-gold"
              >
                {service.title}
              </Link>
            ))}
            {licenses.map((license) => (
              <Link
                key={license.href}
                href={license.href}
                className="text-primary-foreground/75 hover:text-gold w-fit text-sm transition-colors outline-none focus-visible:text-gold"
              >
                {license.title}
              </Link>
            ))}
          </nav>

          <nav aria-label="Footer company" className="flex flex-col gap-2.5">
            <p className="text-gold mb-1 text-xs font-semibold tracking-[0.14em] uppercase">
              Company
            </p>
            {NAV_LINKS.filter((l) => l.href !== "/").map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-primary-foreground/75 hover:text-gold w-fit text-sm transition-colors outline-none focus-visible:text-gold"
              >
                {link.title === "India" ? "Sinai Spark India" : link.title}
              </Link>
            ))}
            <Link
              href="/contact/"
              className="text-primary-foreground/75 hover:text-gold w-fit text-sm transition-colors outline-none focus-visible:text-gold"
            >
              Contact Us
            </Link>
          </nav>

          <div className="flex flex-col gap-2.5">
            <p className="text-gold mb-1 text-xs font-semibold tracking-[0.14em] uppercase">
              Offices
            </p>
            {SITE.offices.map((office) => (
              <div key={office.city} className="text-sm">
                <span className="text-primary-foreground font-medium">{office.label}</span>
                <span className="text-primary-foreground/60 block text-xs">{office.note}</span>
              </div>
            ))}
            {/* PENDING_CLIENT_DATA — office street addresses pending. */}
            <div className="text-primary-foreground/75 mt-3 flex flex-col gap-1 text-sm">
              <a href={`mailto:${SITE.email}`} className="hover:text-gold transition-colors">
                {SITE.email}
              </a>
              <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="hover:text-gold transition-colors">
                {SITE.phone}
              </a>
            </div>
          </div>
        </div>

        <div className="border-primary-foreground/15 text-primary-foreground/60 mt-14 flex flex-col items-start justify-between gap-3 border-t pt-6 text-xs sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy/" className="hover:text-gold transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms/" className="hover:text-gold transition-colors">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
