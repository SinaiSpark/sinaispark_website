import { CtaSection } from "@/components/chrome/cta-section"
import { Loader } from "@/components/chrome/loader"
import { BrandInterlude } from "@/components/home/brand-interlude"
import { Faq } from "@/components/home/faq"
import { GovBand } from "@/components/home/gov-band"
import { Hero } from "@/components/home/hero"
import { IndiaSpotlight } from "@/components/home/india-spotlight"
import { Insights } from "@/components/home/insights"
import { LicenceFinder } from "@/components/home/licence-finder"
import { Markets } from "@/components/home/markets"
import { MissionVision } from "@/components/home/mission-vision"
import { Process } from "@/components/home/process"
import { Regions } from "@/components/home/regions"
import { ServicesStack } from "@/components/home/services-stack"
import { Stats } from "@/components/home/stats"
import { Team } from "@/components/home/team"
import { Testimonials } from "@/components/home/testimonials"
import { Who } from "@/components/home/who"
import { Why } from "@/components/home/why"
import { PageMotion } from "@/components/motion/page-motion"
import { PageJsonLd } from "@/components/seo/json-ld"
import { CLOSING_CTA } from "@/content/home"
import { faqs, HOME_FAQ } from "@/content/faqs"
import { ROUTES } from "@/content/site"
import { pageMetadata } from "@/lib/seo"
import { getSiteSettings } from "@/lib/settings"
import { SITE } from "@/lib/site-config"

export function generateMetadata() {
  return pageMetadata({
    // The full name, not run through the "%s | Sinai Spark Global" template.
    title: `${SITE.name}: Business Setup Services in Saudi Arabia and Beyond`,
    absoluteTitle: true,
    description: SITE.description,
    path: ROUTES.home,
  })
}

/**
 * Home page — the section order is the approved design's, top to bottom.
 * Every string comes from the content folder; every animation from lib/motion.
 * The Insights section only shows once an admin switches Insights on.
 */
export default async function HomePage() {
  const { insightsEnabled } = await getSiteSettings()
  const faqItems = HOME_FAQ.pick.flatMap((i) => faqs[i] ?? [])

  return (
    <PageMotion variant="home">
      <PageJsonLd path={ROUTES.home} />
      <Loader />
      <Hero />
      <GovBand />
      <Markets />
      <Who />
      <BrandInterlude />
      <MissionVision />
      <Team />
      <Stats />
      <ServicesStack />
      <LicenceFinder variant="home" />
      <Process />
      <Why />
      <Testimonials />
      <Regions />
      <IndiaSpotlight />
      {insightsEnabled ? <Insights /> : null}
      <Faq
        eyebrow={HOME_FAQ.eyebrow}
        headline={HOME_FAQ.headline}
        lede={HOME_FAQ.lede}
        link={HOME_FAQ.link}
        items={faqItems}
      />
      <CtaSection
        eyebrow={CLOSING_CTA.eyebrow}
        headline={CLOSING_CTA.headline}
        lede={CLOSING_CTA.lede}
        secondary={CLOSING_CTA.secondary}
        primary={CLOSING_CTA.primary}
      />
    </PageMotion>
  )
}
