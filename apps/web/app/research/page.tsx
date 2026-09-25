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
import { getReports } from "@/lib/content-api"
import { requireInsights } from "@/lib/insights"
import { pageMetadata } from "@/lib/seo"

export function generateMetadata() {
  return pageMetadata({
    title: "Research & insights",
    description: RESEARCH.hero.lede,
    path: ROUTES.research,
  })
}

/**
 * Research. Longer-form work than the blog: one featured article, the
 * library filtered by market and topic, and how the research gets written.
 */
export default async function ResearchPage() {
  await requireInsights()
  const reports = await getReports()
  const [featured] = reports
  const labels = RESEARCH.hero.stats
  const stats = [
    { value: reports.length, label: labels.articles },
    {
      value: new Set(reports.map((report) => report.market)).size,
      label: labels.markets,
    },
    {
      value: reports.reduce((total, report) => total + report.readMinutes, 0),
      label: labels.minutes,
    },
  ]
  // No featured section until something is published, so no link to it either.
  const spy = RESEARCH.spy.filter((item) => featured || item.id !== "featured")

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
        stats={stats}
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

      <SpyNav items={spy} extra={RESEARCH.spyExtra} />

      {featured ? (
        <FeaturedReport report={featured} total={reports.length} />
      ) : null}
      <ReportLibrary reports={reports} />
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
