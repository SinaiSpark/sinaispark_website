import { CtaSection } from "@/components/chrome/cta-section"
import { BlogPosts, DeeperReading } from "@/components/company/blog-sections"
import { Newsletter } from "@/components/company/newsletter"
import { PageMotion } from "@/components/motion/page-motion"
import { PageHero } from "@/components/pages/page-hero"
import { ButtonArrow } from "@/components/ui/icons"
import { SmartLink } from "@/components/ui/smart-link"
import { BLOG } from "@/content/blog"
import { ROUTES } from "@/content/site"
import { getPosts } from "@/lib/content-api"
import { pageMetadata } from "@/lib/seo"
import { getSiteSettings } from "@/lib/settings"

export function generateMetadata() {
  return pageMetadata({
    title: "Blog",
    description: BLOG.hero.lede,
    path: ROUTES.blog,
  })
}

/**
 * Blog. The sticky bar under the hero filters by format rather than jumping
 * between sections, so this page has no spy nav of its own — the bar is it.
 *
 * Always public. Its links into research only show while Insights is on.
 */
export default async function BlogPage() {
  const [posts, { insightsEnabled }] = await Promise.all([
    getPosts(),
    getSiteSettings(),
  ])

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
            {insightsEnabled ? (
              <SmartLink
                className="btn btn--ghost"
                href={BLOG.hero.secondary.href}
                data-magnetic
              >
                {BLOG.hero.secondary.label} <ButtonArrow />
              </SmartLink>
            ) : null}
          </div>
        }
      />

      <BlogPosts posts={posts} />

      <Newsletter
        eyebrow={BLOG.newsletter.eyebrow}
        headline={BLOG.newsletter.headline}
        lede={BLOG.newsletter.lede}
        picks={BLOG.newsletter.picks}
      />

      {insightsEnabled ? <DeeperReading /> : null}

      <CtaSection
        eyebrow={BLOG.cta.eyebrow}
        headline={BLOG.cta.headline}
        lede={BLOG.cta.lede}
        secondary={insightsEnabled ? BLOG.cta.secondary : undefined}
        primary={BLOG.cta.primary}
      />
    </PageMotion>
  )
}
