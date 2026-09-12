import type { Metadata } from "next"

import { CtaSection } from "@/components/chrome/cta-section"
import { LicenceFinder } from "@/components/home/licence-finder"
import { PageMotion } from "@/components/motion/page-motion"
import { ComparisonMatrix } from "@/components/pages/comparison-matrix"
import { LicenceFan } from "@/components/pages/licence-fan"
import { PageHero } from "@/components/pages/page-hero"
import { ServiceSection } from "@/components/pages/service-section"
import { SpyNav } from "@/components/pages/spy-nav"
import { ButtonArrow } from "@/components/ui/icons"
import { CLOSING_CTA } from "@/content/home"
import { LICENCE_SLUGS, LICENCES_PAGE, SHORT_TITLES } from "@/content/pages"
import { getService } from "@/content/services"
import { ROUTES } from "@/content/site"

export const metadata: Metadata = {
  title: "Licences",
  description: LICENCES_PAGE.lede,
}

/**
 * Licences hub: the fanned hero, the finder, the comparison matrix, then each
 * licence in full.
 */
export default function LicencesPage() {
  const licences = LICENCE_SLUGS.flatMap((slug) => getService(slug) ?? [])

  return (
    <>
      <PageHero
        className="phero--lic"
        crumbs={[
          { label: "Home", href: ROUTES.home },
          { label: "Services", href: ROUTES.services },
          { label: "Licences" },
        ]}
        headline={LICENCES_PAGE.headline}
        lede={LICENCES_PAGE.lede}
        actions={
          <div className="hero-ctas" style={{ marginTop: 32 }}>
            <a className="btn" href={LICENCES_PAGE.primary.href} data-magnetic>
              {LICENCES_PAGE.primary.label} <ButtonArrow />
            </a>
            <a
              className="btn btn--ghost"
              href={LICENCES_PAGE.secondary.href}
              data-magnetic
            >
              {LICENCES_PAGE.secondary.label} <ButtonArrow down />
            </a>
          </div>
        }
        side={
          <div className="phero-side">
            <LicenceFan licences={licences} />
          </div>
        }
      />

      <SpyNav
        items={LICENCE_SLUGS.map((slug) => ({
          id: slug,
          label: SHORT_TITLES[slug] ?? slug,
        }))}
        extra={LICENCES_PAGE.spyExtra}
      />

      <LicenceFinder
        variant="licences"
        style={{ background: "var(--mist-2)" }}
      />
      <ComparisonMatrix licences={licences} />

      {licences.map((licence, i) => (
        <ServiceSection
          key={licence.slug}
          service={licence}
          index={i}
          crumb={LICENCES_PAGE.crumb}
          fullPageHref={ROUTES.licence(licence.slug)}
        />
      ))}

      <CtaSection
        eyebrow={CLOSING_CTA.eyebrow}
        headline={CLOSING_CTA.headline}
        lede={CLOSING_CTA.lede}
        secondary={{ label: CLOSING_CTA.secondary.label, href: ROUTES.faq }}
        primary={{ label: CLOSING_CTA.primary.label, href: ROUTES.consult }}
      />
      <PageMotion variant="inner" />
    </>
  )
}
