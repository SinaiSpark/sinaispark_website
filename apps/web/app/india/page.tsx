import type { Metadata } from "next"

import { CtaSection } from "@/components/chrome/cta-section"
import { ProcessTrack } from "@/components/detail/detail-sections"
import { Faq } from "@/components/home/faq"
import {
  IndiaAudiences,
  IndiaBridge,
  IndiaHero,
  IndiaIncluded,
  IndiaPricing,
  IndiaTicker,
  IndiaWhy,
} from "@/components/india/india-sections"
import { StructurePicker } from "@/components/india/structure-picker"
import { PageMotion } from "@/components/motion/page-motion"
import { INDIA } from "@/content/india"
import { INDIA_PAGE } from "@/content/india-page"

export const metadata: Metadata = {
  title: "Sinai Spark India",
  description: INDIA.hero.subheadline,
}

/**
 * India landing page. The client supplied this copy verbatim, so the sections
 * follow their document: who it is for, choosing a structure, what we handle,
 * how it works, the NRI case, why us, packages and FAQs.
 */
export default function IndiaPage() {
  return (
    <PageMotion variant="india">
      <IndiaHero />
      <IndiaTicker />
      <IndiaAudiences />
      <StructurePicker />
      <IndiaIncluded />

      <ProcessTrack
        id="how"
        eyebrow={INDIA.process.title}
        headline={INDIA_PAGE.process.headline}
        note={INDIA_PAGE.process.note}
        phases={INDIA.process.steps.map((step) => ({
          title: step.title,
          body: step.body,
        }))}
      />

      <IndiaBridge />
      <IndiaWhy />
      <IndiaPricing />

      <Faq
        eyebrow={INDIA_PAGE.faq.eyebrow}
        headline={INDIA_PAGE.faq.headline}
        lede={INDIA_PAGE.faq.lede}
        link={INDIA_PAGE.faq.link}
        items={INDIA.faqs.map((f) => ({
          question: f.question,
          answer: f.answer,
        }))}
        style={{ background: "#fff" }}
      />

      <CtaSection
        eyebrow={INDIA_PAGE.cta.eyebrow}
        headline={INDIA.closingCta.title}
        lede={INDIA.closingCta.subheadline}
        secondary={INDIA_PAGE.cta.secondary}
        primary={INDIA_PAGE.cta.primary}
      >
        <ul className="trust cta-trust" data-reveal>
          {INDIA.trustStrip2.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </CtaSection>
    </PageMotion>
  )
}
