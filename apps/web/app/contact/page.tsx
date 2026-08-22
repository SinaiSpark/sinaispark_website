import type { Metadata } from "next"

import { Breadcrumbs } from "@/components/site/breadcrumbs"
import { ContactForm } from "@/components/forms/contact-form"
import { WhatsAppButton } from "@/components/site/whatsapp-button"
import { SITE } from "@/lib/site-config"
import {
  InstagramGlyph,
  LinkedInGlyph,
  YouTubeGlyph,
} from "@/components/site/social-icons"
import { Reveal } from "@/components/motion/reveal"

export const metadata: Metadata = {
  title: "Contact Sinai Spark Global: Free Business Setup Consultation",
  description:
    "Get in touch with Sinai Spark Global for a free consultation on company formation, licensing and compliance in Saudi Arabia and beyond.",
  alternates: { canonical: "/contact/" },
}

const socials = [
  { label: "Instagram", href: SITE.socials.instagram, Glyph: InstagramGlyph },
  { label: "LinkedIn", href: SITE.socials.linkedin, Glyph: LinkedInGlyph },
  { label: "YouTube", href: SITE.socials.youtube, Glyph: YouTubeGlyph },
]

export default function ContactPage() {
  return (
    <>
      <div className="bg-background-alt">
        <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          <Breadcrumbs pathname="/contact/" />
        </div>
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
          <p className="mb-2 text-xs font-semibold tracking-[0.14em] text-gold-strong uppercase">
            Free Consultation
          </p>
          {/* One H1 per page — matches the revised document's headline. */}
          <h1 className="max-w-2xl text-3xl font-semibold tracking-[-0.02em] text-balance md:text-4xl">
            Let&apos;s Start Your Market Entry
          </h1>
          <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">
            Tell us about your business and we will recommend the right
            structure, license and next steps, free of charge.
          </p>
        </div>
      </div>

      <section className="bg-background">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-12 sm:px-6 md:py-16 lg:grid-cols-[7fr_5fr] lg:gap-16 lg:px-8">
          <Reveal>
            <ContactForm />
          </Reveal>

          <Reveal delay={0.08}>
            <aside className="flex flex-col gap-6 rounded-lg bg-background-alt p-6 md:p-8">
              <div>
                <h2 className="text-sm font-semibold tracking-[0.14em] uppercase">
                  Direct contact
                </h2>
                <div className="mt-3 flex flex-col gap-1.5 text-sm">
                  <a
                    href={`mailto:${SITE.email}`}
                    className="transition-colors outline-none hover:text-primary focus-visible:text-primary"
                  >
                    {SITE.email}
                  </a>
                  <a
                    href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                    className="transition-colors outline-none hover:text-primary focus-visible:text-primary"
                  >
                    {SITE.phone} (phone / WhatsApp)
                    {/* PENDING_CLIENT_DATA — confirm current KSA number. */}
                  </a>
                </div>
                <a
                  href={`https://wa.me/${SITE.whatsappNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex h-11 w-fit items-center gap-2 rounded-md bg-[#25D366] px-5 text-sm font-medium text-white transition-transform outline-none hover:-translate-y-px focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <WhatsAppGlyph /> Chat on WhatsApp
                </a>
              </div>

              <div>
                <h2 className="text-sm font-semibold tracking-[0.14em] uppercase">
                  Offices
                </h2>
                <ul className="mt-3 flex flex-col gap-2 text-sm">
                  {SITE.offices.map((office) => (
                    <li key={office.city}>
                      <span className="font-medium">{office.label}</span>
                      <span className="block text-xs text-muted-foreground">
                        {office.note} — address available shortly.
                      </span>
                      {/* PENDING_CLIENT_DATA — office street addresses pending. */}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-sm font-semibold tracking-[0.14em] uppercase">
                  Follow us
                </h2>
                <div className="mt-3 flex items-center gap-2">
                  {socials.map(({ label, href, Glyph }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={label}
                      className="inline-flex size-10 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors outline-none hover:border-gold hover:text-gold-strong focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      <Glyph className="size-4" />
                    </a>
                  ))}
                </div>
              </div>
            </aside>
          </Reveal>
        </div>
      </section>

      <WhatsAppButton message="Hello Sinai Spark Global, I would like a free consultation." />
    </>
  )
}

function WhatsAppGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="size-4"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  )
}
