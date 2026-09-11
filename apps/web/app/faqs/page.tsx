import type { Metadata } from "next"

import { faqs } from "@/lib/content/faqs"
import { PageHeader } from "@/components/site/page-header"
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
      <PageHeader
        pathname="/faqs/"
        eyebrow="FAQs"
        title="Common questions, answered plainly"
        lede="The questions we hear most from founders and investors entering new markets."
        // PENDING_CLIENT_DATA — general FAQ set pending client sign-off; seeded from service content.
      />

      <section
        aria-label="Frequently asked questions"
        className="bg-background"
      >
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 md:py-20 lg:px-8">
          <Accordion className="rounded-2xl border border-border px-6 md:px-8">
            {faqs.map((faq) => (
              <AccordionItem key={faq.question} value={faq.question}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <CTASection
        title="Still Have Questions?"
        subheadline="Speak to our experts for personalized guidance — the consultation is free."
        buttons={[{ label: "Contact Us", href: "/contact/", variant: "brand" }]}
      />
    </>
  )
}
