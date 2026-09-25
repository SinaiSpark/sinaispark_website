import Link from "next/link"

import { CtaSection } from "@/components/chrome/cta-section"
import { PageMotion } from "@/components/motion/page-motion"
import { PageHero } from "@/components/pages/page-hero"
import { ServiceSection } from "@/components/pages/service-section"
import { SpyNav } from "@/components/pages/spy-nav"
import { ButtonArrow } from "@/components/ui/icons"
import { SplitText } from "@/components/ui/split-text"
import { CLOSING_CTA } from "@/content/home"
import {
  CORE_SLUGS,
  LICENCE_SLUGS,
  SERVICES_PAGE,
  SHORT_TITLES,
} from "@/content/pages"
import { getService } from "@/content/services"
import { ROUTES } from "@/content/site"
import { PageJsonLd } from "@/components/seo/json-ld"
import { pageMetadata } from "@/lib/seo"

export function generateMetadata() {
  return pageMetadata({
    title: "Services",
    description: SERVICES_PAGE.lede,
    path: ROUTES.services,
  })
}

/** Services hub: the five core services in full, then a teaser for licensing. */
export default function ServicesPage() {
  const services = CORE_SLUGS.flatMap((slug) => getService(slug) ?? [])
  const licences = LICENCE_SLUGS.flatMap((slug) => getService(slug) ?? [])

  return (
    <PageMotion variant="inner">
      <PageJsonLd path={ROUTES.services} />
      <PageHero
        image={SERVICES_PAGE.hero}
        crumbs={[{ label: "Home", href: ROUTES.home }, { label: "Services" }]}
        headline={SERVICES_PAGE.headline}
        lede={SERVICES_PAGE.lede}
        stats={SERVICES_PAGE.meta.map((m) => ({
          value: m.value,
          label: m.label,
        }))}
      />

      <SpyNav
        items={CORE_SLUGS.map((slug) => ({
          id: slug,
          label: SHORT_TITLES[slug] ?? slug,
        }))}
        extra={SERVICES_PAGE.spyExtra}
      />

      {services.map((service, i) => (
        <ServiceSection
          key={service.slug}
          service={service}
          index={i}
          crumb={SERVICES_PAGE.crumb}
          flag={i === 0}
          fullPageHref={ROUTES.service(service.slug)}
        />
      ))}

      <section className="lic-teaser" data-surface="dark">
        <div className="wrap">
          <div>
            <p className="eyebrow" data-reveal>
              {SERVICES_PAGE.teaser.eyebrow}
            </p>
            <SplitText
              as="h2"
              className="h2"
              text={SERVICES_PAGE.teaser.headline}
            />
          </div>
          <Link
            className="btn"
            href={SERVICES_PAGE.teaser.cta.href}
            data-magnetic
            data-reveal
          >
            {SERVICES_PAGE.teaser.cta.label} <ButtonArrow />
          </Link>
        </div>
        <div className="lic-marq">
          <div className="track">
            {[...licences, ...licences].map((licence, i) => (
              <Link
                className="lic-chip"
                href={ROUTES.licence(licence.slug)}
                key={`${licence.slug}-${i}`}
              >
                <b>{String((i % licences.length) + 1).padStart(2, "0")}</b>
                {licence.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaSection
        eyebrow={CLOSING_CTA.eyebrow}
        headline={CLOSING_CTA.headline}
        lede={CLOSING_CTA.lede}
        secondary={{ label: CLOSING_CTA.secondary.label, href: ROUTES.faq }}
        primary={{ label: CLOSING_CTA.primary.label, href: ROUTES.consult }}
      />
    </PageMotion>
  )
}
