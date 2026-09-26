import { CtaSection } from "@/components/chrome/cta-section"
import { Loader } from "@/components/chrome/loader"
import { BrandInterlude } from "@/components/home/brand-interlude"
import { GovBand } from "@/components/home/gov-band"
import { Hero } from "@/components/home/hero"
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
import { ROUTES } from "@/content/site"
import { pageMetadata } from "@/lib/seo"
import { getTeam, getTestimonials } from "@/lib/site-content"
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
 * Copy comes from the content folder, the team and testimonials from the CMS;
 * every animation from lib/motion. FAQs, India, the licence finder and
 * Insights have their own pages and are deliberately not repeated here.
 */
export default async function HomePage() {
  const [team, testimonials] = await Promise.all([getTeam(), getTestimonials()])

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
      <Team members={team} />
      <Stats />
      <ServicesStack />
      <Process />
      <Why />
      <Testimonials items={testimonials} />
      <Regions />
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
