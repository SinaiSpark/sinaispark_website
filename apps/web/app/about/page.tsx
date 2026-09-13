import type { Metadata } from "next"

import { CtaSection } from "@/components/chrome/cta-section"
import {
  AboutApart,
  AboutValues,
  AboutWhere,
} from "@/components/company/about-sections"
import { ProcessTrack } from "@/components/detail/detail-sections"
import { MissionVision } from "@/components/home/mission-vision"
import { Team } from "@/components/home/team"
import { Who } from "@/components/home/who"
import { PageMotion } from "@/components/motion/page-motion"
import { PageHero } from "@/components/pages/page-hero"
import { SpyNav } from "@/components/pages/spy-nav"
import { ButtonArrow } from "@/components/ui/icons"
import { SmartLink } from "@/components/ui/smart-link"
import { ABOUT } from "@/content/about"
import { ROUTES } from "@/content/site"

export const metadata: Metadata = {
  title: "About",
  description: ABOUT.hero.lede,
}

/**
 * About page. The firm's own story, then the three shared sections that say
 * what it stands for — mission and vision, the team, and the markets it covers
 * — so those stay in one place and cannot drift from the home page.
 */
export default function AboutPage() {
  return (
    <PageMotion variant="company">
      <PageHero
        className="dhero ab-hero"
        image={ABOUT.hero.image}
        crumbs={[
          { label: "Home", href: ROUTES.home },
          { label: ABOUT.hero.crumb },
        ]}
        headline={ABOUT.hero.headline}
        lede={ABOUT.hero.lede}
        stats={[...ABOUT.hero.stats]}
        actions={
          <div className="d-actions">
            <SmartLink
              className="btn"
              href={ABOUT.hero.primary.href}
              data-magnetic
            >
              {ABOUT.hero.primary.label} <ButtonArrow />
            </SmartLink>
            <SmartLink
              className="btn btn--ghost"
              href={ABOUT.hero.secondary.href}
              data-magnetic
            >
              {ABOUT.hero.secondary.label} <ButtonArrow down />
            </SmartLink>
          </div>
        }
      />

      <SpyNav items={[...ABOUT.spy]} extra={ABOUT.spyExtra} />

      <Who content={ABOUT.story} id="story" className="ab-story" spy />

      <ProcessTrack
        id="chapters"
        spy={false}
        eyebrow={ABOUT.chapters.eyebrow}
        headline={ABOUT.chapters.headline}
        stepLabel={ABOUT.chapters.stepLabel}
        note={ABOUT.chapters.note}
        cta={ABOUT.chapters.cta}
        phases={ABOUT.chapters.steps.map((step) => ({
          title: step.title,
          body: step.body,
        }))}
      />

      <MissionVision spy />
      <AboutApart />
      <AboutValues />
      <Team className="ab-team" spy />
      <AboutWhere />

      <CtaSection
        eyebrow={ABOUT.cta.eyebrow}
        headline={ABOUT.cta.headline}
        lede={ABOUT.cta.lede}
        secondary={ABOUT.cta.secondary}
        primary={ABOUT.cta.primary}
      />
    </PageMotion>
  )
}
