import { CtaSection } from "@/components/chrome/cta-section"
import { Faq } from "@/components/home/faq"
import { PageMotion } from "@/components/motion/page-motion"
import { PageHero } from "@/components/pages/page-hero"
import { SpyNav } from "@/components/pages/spy-nav"
import { PageJsonLd } from "@/components/seo/json-ld"
import { ButtonArrow } from "@/components/ui/icons"
import { SmartLink } from "@/components/ui/smart-link"
import { FAQ_PAGE } from "@/content/faqs"
import { ROUTES } from "@/content/site"
import { pageMetadata } from "@/lib/seo"
import { FAQ_CATEGORIES, getFaqs } from "@/lib/site-content"

export function generateMetadata() {
  return pageMetadata({
    title: "FAQs",
    description: FAQ_PAGE.hero.lede,
    path: ROUTES.faq,
  })
}

/**
 * Every published question from the CMS, one section per category in
 * FAQ_CATEGORIES order. A category with no questions has no section and no
 * entry in the sub-nav.
 */
export default async function FaqPage() {
  const faqs = await getFaqs()
  const sections = FAQ_CATEGORIES.map((category) => ({
    ...FAQ_PAGE.sections[category],
    category,
    items: faqs.filter((faq) => faq.category === category),
  })).filter((section) => section.items.length > 0)

  return (
    <PageMotion variant="company">
      <PageJsonLd path={ROUTES.faq} />
      <PageHero
        className="dhero"
        image={FAQ_PAGE.hero.image}
        crumbs={[
          { label: "Home", href: ROUTES.home },
          { label: FAQ_PAGE.hero.crumb },
        ]}
        headline={FAQ_PAGE.hero.headline}
        lede={FAQ_PAGE.hero.lede}
        stats={[
          { value: faqs.length, label: "Questions" },
          { value: sections.length, label: "Topics" },
        ]}
        actions={
          <div className="d-actions">
            <SmartLink
              className="btn"
              href={FAQ_PAGE.hero.primary.href}
              data-magnetic
            >
              {FAQ_PAGE.hero.primary.label} <ButtonArrow />
            </SmartLink>
            <SmartLink
              className="btn btn--ghost"
              href={FAQ_PAGE.hero.secondary.href}
              data-magnetic
            >
              {FAQ_PAGE.hero.secondary.label} <ButtonArrow />
            </SmartLink>
          </div>
        }
      />

      <SpyNav
        items={sections.map((s) => ({ id: s.id, label: s.category }))}
        extra={FAQ_PAGE.spyExtra}
      />

      {sections.map((section, i) => (
        <Faq
          key={section.id}
          id={section.id}
          className={i % 2 ? "faq" : "faq dfaq"}
          eyebrow={section.category}
          headline={section.headline}
          lede={section.lede}
          link={FAQ_PAGE.link}
          items={section.items.map(({ question, answer }) => ({
            question,
            answer,
          }))}
          spy
        />
      ))}

      <CtaSection
        eyebrow={FAQ_PAGE.cta.eyebrow}
        headline={FAQ_PAGE.cta.headline}
        lede={FAQ_PAGE.cta.lede}
        secondary={FAQ_PAGE.cta.secondary}
        primary={FAQ_PAGE.cta.primary}
      />
    </PageMotion>
  )
}
