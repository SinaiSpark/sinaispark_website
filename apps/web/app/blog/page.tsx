import type { Metadata } from "next"

import { CtaSection } from "@/components/chrome/cta-section"
import { BlogPosts, DeeperReading } from "@/components/company/blog-sections"
import { Newsletter } from "@/components/company/newsletter"
import { PageMotion } from "@/components/motion/page-motion"
import { PageHero } from "@/components/pages/page-hero"
import { ButtonArrow } from "@/components/ui/icons"
import { SmartLink } from "@/components/ui/smart-link"
import { BLOG } from "@/content/blog"
import { ROUTES } from "@/content/site"

export const metadata: Metadata = {
  title: "Blog",
  description: BLOG.hero.lede,
}

/**
 * Blog. The sticky bar under the hero filters by format rather than jumping
 * between sections, so this page has no spy nav of its own — the bar is it.
 */
export default function BlogPage() {
  return (
    <PageMotion variant="company">
      <PageHero
        className="dhero bl-hero"
        image={BLOG.hero.image}
        crumbs={[
          { label: "Home", href: ROUTES.home },
          { label: BLOG.hero.crumb },
        ]}
        headline={BLOG.hero.headline}
        lede={BLOG.hero.lede}
        stats={[...BLOG.hero.stats]}
        actions={
          <div className="d-actions">
            <SmartLink
              className="btn"
              href={BLOG.hero.primary.href}
              data-magnetic
            >
              {BLOG.hero.primary.label} <ButtonArrow />
            </SmartLink>
            <SmartLink
              className="btn btn--ghost"
              href={BLOG.hero.secondary.href}
              data-magnetic
            >
              {BLOG.hero.secondary.label} <ButtonArrow />
            </SmartLink>
          </div>
        }
      />

      <BlogPosts />

      <Newsletter
        eyebrow={BLOG.newsletter.eyebrow}
        headline={BLOG.newsletter.headline}
        lede={BLOG.newsletter.lede}
        picks={BLOG.newsletter.picks}
      />

      <DeeperReading />

      <CtaSection
        eyebrow={BLOG.cta.eyebrow}
        headline={BLOG.cta.headline}
        lede={BLOG.cta.lede}
        secondary={BLOG.cta.secondary}
        primary={BLOG.cta.primary}
      />
    </PageMotion>
  )
}
