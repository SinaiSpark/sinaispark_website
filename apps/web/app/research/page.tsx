import type { Metadata } from "next"

import { CtaSection } from "@/components/chrome/cta-section"
import { Newsletter } from "@/components/company/newsletter"
import {
  FeaturedReport,
  ReportLibrary,
  ResearchMethod,
} from "@/components/company/research-sections"
import { PageMotion } from "@/components/motion/page-motion"
import { PageHero } from "@/components/pages/page-hero"
import { SpyNav } from "@/components/pages/spy-nav"
import { ButtonArrow } from "@/components/ui/icons"
import { SmartLink } from "@/components/ui/smart-link"
import { RESEARCH } from "@/content/research"
import { ROUTES } from "@/content/site"

export const metadata: Metadata = {
  title: "Research & insights",
  description: RESEARCH.hero.lede,
}

/**
 * Research. Longer-form work than the blog: one featured report, the library
 * filtered by market and topic, and how the reports get written.
 */
export default function ResearchPage() {
  return (
    <PageMotion variant="company">
      <PageHero
        className="dhero rs-hero"
        image={RESEARCH.hero.image}
        crumbs={[
          { label: "Home", href: ROUTES.home },
          { label: RESEARCH.hero.crumb },
        ]}
        headline={RESEARCH.hero.headline}
        lede={RESEARCH.hero.lede}
        stats={[...RESEARCH.hero.stats]}
        actions={
          <div className="d-actions">
            <SmartLink
              className="btn"
              href={RESEARCH.hero.primary.href}
              data-magnetic
            >
              {RESEARCH.hero.primary.label} <ButtonArrow down />
            </SmartLink>
            <SmartLink
              className="btn btn--ghost"
              href={RESEARCH.hero.secondary.href}
              data-magnetic
            >
              {RESEARCH.hero.secondary.label} <ButtonArrow />
            </SmartLink>
          </div>
        }
      />

      <SpyNav items={[...RESEARCH.spy]} extra={RESEARCH.spyExtra} />

      <FeaturedReport />
      <ReportLibrary />
      <ResearchMethod />

      <Newsletter
        eyebrow={RESEARCH.newsletter.eyebrow}
        headline={RESEARCH.newsletter.headline}
        lede={RESEARCH.newsletter.lede}
        picks={RESEARCH.newsletter.picks}
      />

      <CtaSection
        eyebrow={RESEARCH.cta.eyebrow}
        headline={RESEARCH.cta.headline}
        lede={RESEARCH.cta.lede}
        secondary={RESEARCH.cta.secondary}
        primary={RESEARCH.cta.primary}
      />
    </PageMotion>
  )
}
