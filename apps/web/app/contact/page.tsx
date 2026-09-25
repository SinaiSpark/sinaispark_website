import { CtaSection } from "@/components/chrome/cta-section"
import {
  DeskCard,
  DirectLines,
  Offices,
} from "@/components/company/contact-sections"
import { ConsultForm } from "@/components/home/consult-form"
import { Faq } from "@/components/home/faq"
import { PageMotion } from "@/components/motion/page-motion"
import { PageHero } from "@/components/pages/page-hero"
import { SpyNav } from "@/components/pages/spy-nav"
import { ButtonArrow } from "@/components/ui/icons"
import { SmartLink } from "@/components/ui/smart-link"
import { CONTACT } from "@/content/contact"
import { ROUTES } from "@/content/site"
import { PageJsonLd } from "@/components/seo/json-ld"
import { pageMetadata } from "@/lib/seo"

export function generateMetadata() {
  return pageMetadata({
    title: "Contact",
    description: CONTACT.hero.lede,
    path: ROUTES.contact,
  })
}

/**
 * Contact page. The form is the same component the home page carries, given
 * the page's own framing; everything after it is for people who would rather
 * not fill anything in.
 */
export default function ContactPage() {
  return (
    <PageMotion variant="company">
      <PageJsonLd path={ROUTES.contact} />
      <PageHero
        className="dhero ct-hero"
        image={CONTACT.hero.image}
        crumbs={[
          { label: "Home", href: ROUTES.home },
          { label: CONTACT.hero.crumb },
        ]}
        headline={CONTACT.hero.headline}
        lede={CONTACT.hero.lede}
        actions={
          <div className="d-actions">
            <SmartLink
              className="btn"
              href={CONTACT.hero.primary.href}
              data-magnetic
            >
              {CONTACT.hero.primary.label} <ButtonArrow down />
            </SmartLink>
            <a
              className="btn btn--ghost"
              href={CONTACT.hero.secondary.href}
              target="_blank"
              rel="noreferrer noopener"
              data-magnetic
            >
              {CONTACT.hero.secondary.label} <ButtonArrow />
            </a>
          </div>
        }
        side={<DeskCard />}
      />

      <SpyNav items={[...CONTACT.spy]} extra={CONTACT.spyExtra} />

      <ConsultForm
        id="form"
        className="ct-form"
        headline={CONTACT.form.headline}
        spy
      />

      <DirectLines />
      <Offices />

      <Faq
        className="faq dfaq"
        eyebrow={CONTACT.faq.eyebrow}
        headline={CONTACT.faq.headline}
        lede={CONTACT.faq.lede}
        link={CONTACT.faq.link}
        items={CONTACT.faq.items.map((item) => ({
          question: item.question,
          answer: item.answer,
        }))}
        spy
      />

      <CtaSection
        eyebrow={CONTACT.cta.eyebrow}
        headline={CONTACT.cta.headline}
        lede={CONTACT.cta.lede}
        secondary={CONTACT.cta.secondary}
        primary={CONTACT.cta.primary}
      />
    </PageMotion>
  )
}
