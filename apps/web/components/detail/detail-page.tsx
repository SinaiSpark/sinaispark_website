import { CtaSection } from "@/components/chrome/cta-section"
import {
  Overview,
  ServiceProcess,
  UpNext,
  WhereWeDeliver,
} from "@/components/detail/detail-sections"
import { Faq } from "@/components/home/faq"
import { PageMotion } from "@/components/motion/page-motion"
import { PageHero } from "@/components/pages/page-hero"
import { SpyNav } from "@/components/pages/spy-nav"
import { ButtonArrow } from "@/components/ui/icons"
import { SmartLink } from "@/components/ui/smart-link"
import { CLOSING_CTA } from "@/content/home"
import { faqs } from "@/content/faqs"
import {
  DETAIL_PAGE,
  FAQ_PICK,
  LICENCE_FACTS,
  SHORT_TITLES,
  SLUG_IMAGE,
} from "@/content/pages"
import type { ServiceContent } from "@/content/services"
import { ROUTES } from "@/content/site"

/**
 * One template for all ten per-service and per-licence pages.
 *
 * The two kinds differ only in framing: licences show their regulators and
 * ownership rule and cycle within the licence set, services cycle within the
 * core five. Everything else — hero, spy bar, overview, process, markets, FAQ,
 * up next — is identical, which is how the design drew them.
 */
export function DetailPage({
  service,
  siblings,
  kind,
}: {
  service: ServiceContent
  /** All items in this set, in order, including the current one. */
  siblings: ServiceContent[]
  kind: "service" | "licence"
}) {
  const isLicence = kind === "licence"
  const hrefFor = isLicence ? ROUTES.licence : ROUTES.service
  const hubHref = isLicence ? ROUTES.licences : ROUTES.services
  const crumb = isLicence ? "Business licensing" : "Core service"

  const index = siblings.findIndex((s) => s.slug === service.slug)
  const next = siblings[(index + 1) % siblings.length]!
  const rest = siblings.filter(
    (s) => s.slug !== service.slug && s.slug !== next.slug
  )
  const indexOf = (slug: string) => siblings.findIndex((s) => s.slug === slug)

  const facts = LICENCE_FACTS[service.slug]
  const stats = isLicence
    ? [
        { value: service.phases.length, label: "Steps to issue" },
        { value: facts?.regulators.length ?? 0, label: "Regulators" },
        { text: facts?.ownership ?? "", label: "Ownership" },
      ]
    : [
        { value: service.phases.length, label: "Steps" },
        {
          value: service.jurisdictions.length,
          label: service.jurisdictions.length === 1 ? "Market" : "Markets",
        },
        { value: service.bullets.length, label: "Deliverables" },
      ]

  const faqItems = (FAQ_PICK[service.slug] ?? []).flatMap((i) => faqs[i] ?? [])
  const faqSubject = isLicence
    ? `the ${service.title.toLowerCase()}`
    : (SHORT_TITLES[service.slug] ?? service.title)
        .toLowerCase()
        .replace("pro &", "PRO &")

  return (
    <>
      <PageHero
        className="dhero"
        image={SLUG_IMAGE[service.slug]}
        crumbs={[
          { label: "Home", href: ROUTES.home },
          { label: "Services", href: ROUTES.services },
          ...(isLicence ? [{ label: "Licences", href: ROUTES.licences }] : []),
          { label: SHORT_TITLES[service.slug] ?? service.title },
        ]}
        headline={service.title}
        lede={service.tagline}
        stats={stats}
        actions={
          <div className="d-actions">
            <SmartLink className="btn" href={ROUTES.contact} data-magnetic>
              Book a free consultation <ButtonArrow />
            </SmartLink>
            <a className="btn btn--ghost" href="#overview" data-magnetic>
              Read on <ButtonArrow down />
            </a>
          </div>
        }
      />

      <SpyNav
        items={DETAIL_PAGE.spy.map((s) => ({ id: s.id, label: s.label }))}
        extra={{
          label: `All ${isLicence ? "licences" : "services"}`,
          href: hubHref,
        }}
      />

      <Overview
        service={service}
        index={index}
        crumb={crumb}
        isLicence={isLicence}
      />
      <ServiceProcess service={service} />
      <WhereWeDeliver service={service} />

      <Faq
        className="faq dfaq"
        eyebrow={DETAIL_PAGE.faq.eyebrow}
        headline={DETAIL_PAGE.faq.headline(faqSubject)}
        lede={DETAIL_PAGE.faq.lede}
        link={DETAIL_PAGE.faq.link}
        items={faqItems}
      />

      <UpNext
        next={next}
        siblings={rest}
        isLicence={isLicence}
        hubHref={hubHref}
        hrefFor={hrefFor}
        indexOf={indexOf}
      />

      <CtaSection
        eyebrow={CLOSING_CTA.eyebrow}
        headline={CLOSING_CTA.headline}
        lede={CLOSING_CTA.lede}
        secondary={{ label: CLOSING_CTA.secondary.label, href: ROUTES.faq }}
        primary={{ label: CLOSING_CTA.primary.label, href: ROUTES.consult }}
      />
      <PageMotion variant="detail" />
    </>
  )
}
