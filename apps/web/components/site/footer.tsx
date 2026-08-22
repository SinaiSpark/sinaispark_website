import Link from "next/link"

import { NAV_LINKS, SERVICE_GROUPS, SITE } from "@/lib/site-config"
import { LogoLockup } from "@/components/site/logo"
import {
  InstagramGlyph,
  LinkedInGlyph,
  YouTubeGlyph,
} from "@/components/site/social-icons"

const socials = [
  { label: "Instagram", href: SITE.socials.instagram, Glyph: InstagramGlyph },
  { label: "LinkedIn", href: SITE.socials.linkedin, Glyph: LinkedInGlyph },
  { label: "YouTube", href: SITE.socials.youtube, Glyph: YouTubeGlyph },
]

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-primary-deep text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div className="flex flex-col gap-5">
            <LogoLockup tone="navy" />
            <p className="max-w-xs text-sm leading-relaxed text-primary-foreground/70">
              A global business setup partner with active operations across
              Saudi Arabia, the UAE, the UK, India and Bahrain — Saudi Arabia as
              our flagship market.
            </p>
            <div className="flex items-center gap-3">
              {socials.map(({ label, href, Glyph }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="inline-flex size-10 items-center justify-center rounded-md border border-primary-foreground/20 text-primary-foreground/80 transition-colors outline-none hover:border-gold hover:text-gold focus-visible:ring-3 focus-visible:ring-gold/40"
                >
                  <Glyph className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Footer services" className="flex flex-col gap-2.5">
            {SERVICE_GROUPS.map((group) => (
              <div key={group.label} className="flex flex-col gap-1">
                <p className="mb-0.5 text-xs font-semibold tracking-[0.14em] text-gold uppercase">
                  {group.label}
                </p>
                {group.items.map((service) => (
                  <Link
                    key={service.href}
                    href={service.href}
                    className="w-fit py-1 text-sm text-primary-foreground/75 transition-colors outline-none hover:text-gold focus-visible:text-gold"
                  >
                    {service.title}
                  </Link>
                ))}
              </div>
            ))}
          </nav>

          <nav aria-label="Footer company" className="flex flex-col gap-2.5">
            <p className="mb-1 text-xs font-semibold tracking-[0.14em] text-gold uppercase">
              Company
            </p>
            {NAV_LINKS.filter((l) => l.href !== "/").map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="w-fit text-sm text-primary-foreground/75 transition-colors outline-none hover:text-gold focus-visible:text-gold"
              >
                {link.title === "India" ? "Sinai Spark India" : link.title}
              </Link>
            ))}
            <Link
              href="/contact/"
              className="w-fit text-sm text-primary-foreground/75 transition-colors outline-none hover:text-gold focus-visible:text-gold"
            >
              Contact Us
            </Link>
          </nav>

          <div className="flex flex-col gap-2.5">
            <p className="mb-1 text-xs font-semibold tracking-[0.14em] text-gold uppercase">
              Offices
            </p>
            {SITE.offices.map((office) => (
              <div key={office.city} className="text-sm">
                <span className="font-medium text-primary-foreground">
                  {office.label}
                </span>
                <span className="block text-xs text-primary-foreground/60">
                  {office.note}
                </span>
              </div>
            ))}
            {/* PENDING_CLIENT_DATA — office street addresses pending. */}
            <div className="mt-3 flex flex-col gap-1 text-sm text-primary-foreground/75">
              <a
                href={`mailto:${SITE.email}`}
                className="transition-colors hover:text-gold"
              >
                {SITE.email}
              </a>
              <a
                href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                className="transition-colors hover:text-gold"
              >
                {SITE.phone}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-primary-foreground/15 pt-6 text-xs text-primary-foreground/60 sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/privacy-policy/"
              className="transition-colors hover:text-gold"
            >
              Privacy Policy
            </Link>
            <Link href="/terms/" className="transition-colors hover:text-gold">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
