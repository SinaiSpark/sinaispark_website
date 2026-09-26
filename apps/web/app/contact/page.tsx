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
import { getContactDetails, getFaqsFor } from "@/lib/site-content"

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
 * not fill anything in. The details and FAQs come from the CMS.
 */
export default async function ContactPage() {
  const [details, faqs] = await Promise.all([
    getContactDetails(),
    getFaqsFor(ROUTES.contact),
  ])
  const whatsapp = details.whatsapp

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
            {whatsapp ? (
              <a
                className="btn btn--ghost"
                href={whatsapp}
                target="_blank"
                rel="noreferrer noopener"
                data-magnetic
              >
                {CONTACT.hero.secondary.label} <ButtonArrow />
              </a>
            ) : null}
          </div>
        }
        side={<DeskCard />}
      />

      <SpyNav
        items={CONTACT.spy.filter((s) => s.id !== "faq" || faqs.length)}
        extra={CONTACT.spyExtra}
      />

      <ConsultForm
        id="form"
        className="ct-form"
        headline={CONTACT.form.headline}
        spy
      />

      <DirectLines details={details} />
      <Offices details={details} />

      {faqs.length ? (
        <Faq
          className="faq dfaq"
          eyebrow={CONTACT.faq.eyebrow}
          headline={CONTACT.faq.headline}
          lede={CONTACT.faq.lede}
          link={CONTACT.faq.link}
          items={faqs.map(({ question, answer }) => ({ question, answer }))}
          spy
        />
      ) : null}

      <CtaSection
        eyebrow={CONTACT.cta.eyebrow}
        headline={CONTACT.cta.headline}
        lede={CONTACT.cta.lede}
        secondary={
          whatsapp ? { ...CONTACT.cta.secondary, href: whatsapp } : undefined
        }
        primary={CONTACT.cta.primary}
      />
    </PageMotion>
  )
}
