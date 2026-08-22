import type { Metadata } from "next"

import { faqs } from "@/lib/content/faqs"
import { Breadcrumbs } from "@/components/site/breadcrumbs"
import { JsonLd } from "@/components/site/jsonld"
import { CTASection } from "@/components/site/cta-section"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion"

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Common questions about business setup, licensing, PRO services and compliance across Saudi Arabia and Sinai Spark Global's other markets.",
  alternates: { canonical: "/faqs/" },
}

export default function FaqsPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  }

  return (
    <>
      <JsonLd data={schema} />
      <div className="bg-background-alt">
        <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          <Breadcrumbs pathname="/faqs/" />
        </div>
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
          <p className="mb-2 text-xs font-semibold tracking-[0.14em] text-gold-strong uppercase">
            FAQs
          </p>
          <h1 className="max-w-2xl text-3xl font-semibold tracking-[-0.02em] text-balance md:text-4xl">
            Common questions, answered plainly
          </h1>
          <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">
            The questions we hear most from founders and investors entering new
            markets.
            {/* PENDING_CLIENT_DATA — general FAQ set pending client sign-off; seeded from service content. */}
          </p>
        </div>
      </div>

      <section
        aria-label="Frequently asked questions"
        className="bg-background"
      >
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
          <Accordion>
            {faqs.map((faq) => (
              <AccordionItem key={faq.question} value={faq.question}>
                <AccordionTrigger className="text-base">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <CTASection
        title="Still Have Questions?"
        subheadline="Speak to our experts for personalized guidance — the consultation is free."
        buttons={[{ label: "Contact Us", href: "/contact/", variant: "gold" }]}
      />
    </>
  )
}
