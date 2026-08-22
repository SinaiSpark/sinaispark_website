import type { Metadata } from "next"
import Link from "next/link"
import { CheckIcon } from "lucide-react"

import { INDIA } from "@/lib/content/india"
import { IMAGES } from "@/lib/images"
import { JsonLd } from "@/components/site/jsonld"
import { ImageHero } from "@/components/site/image-hero"
import { CTASection } from "@/components/site/cta-section"
import { SectionHeading } from "@/components/site/section-heading"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/alert"
import { Reveal } from "@/components/motion/reveal"

export const metadata: Metadata = {
  title:
    "Sinai Spark Global India: Register a Private Limited Company, LLP or OPC Online",
  description:
    "Sinai Spark Global India helps NRIs and entrepreneurs register a Private Limited Company, LLP or OPC in India from anywhere in the world, fully online.",
  alternates: { canonical: "/sinai-spark-india/" },
}

export default function IndiaLandingPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: INDIA.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  }

  return (
    <>
      <JsonLd data={faqSchema} />

      {/* Hero — standalone landing page treatment (§13). */}
      <ImageHero
        asset={IMAGES.indiaMumbai}
        eyebrow={INDIA.hero.eyebrow}
        title={INDIA.hero.headline}
        subtitle={INDIA.hero.subheadline}
        priority
      >
        <Link
          href={INDIA.hero.primaryCta.href}
          className="inline-flex h-11 items-center rounded-md bg-gold px-6 text-sm font-semibold text-primary-deep transition-all outline-none hover:-translate-y-px hover:bg-gold/90 focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {INDIA.hero.primaryCta.label}
        </Link>
        <Link
          href={INDIA.hero.secondaryCta.href}
          className="inline-flex h-11 items-center rounded-md border border-primary-foreground/40 px-6 text-sm text-primary-foreground transition-colors outline-none hover:border-gold hover:text-gold focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {INDIA.hero.secondaryCta.label}
        </Link>
        <div className="flex w-full flex-wrap gap-2 pt-2">
          {INDIA.hero.trustStrip.map((item) => (
            <span
              key={item}
              className="rounded-full border border-primary-foreground/25 px-3 py-1 text-xs font-medium text-primary-foreground/85"
            >
              ✓ {item}
            </span>
          ))}
        </div>
      </ImageHero>

      {/* Who this page is for */}
      <section aria-labelledby="india-audiences" className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20 lg:px-8">
          <SectionHeading eyebrow="Audience" title={INDIA.audiences.title} />
          <Reveal
            stagger
            className="mt-8 grid gap-px overflow-hidden rounded-lg border md:grid-cols-2 lg:grid-cols-3"
          >
            {INDIA.audiences.items.map((item, index) => (
              <p
                key={index}
                className="bg-background p-5 text-sm leading-relaxed text-muted-foreground"
              >
                {item}
              </p>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Choosing a structure — comparison table (stacked cards <md per §16) */}
      <section aria-labelledby="india-structures" className="bg-background-alt">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20 lg:px-8">
          <SectionHeading eyebrow="Structures" title={INDIA.structures.title} />
          <Reveal delay={0.05}>
            {/* Table on md+, stacked cards below (§16). */}
            <div className="mt-8 hidden overflow-hidden rounded-lg border md:block">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/70">
                  <tr>
                    {INDIA.structures.headers.map((header) => (
                      <th key={header} className="p-4 font-semibold">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {INDIA.structures.rows.map((row) => (
                    <tr key={row.structure} className="bg-background align-top">
                      <td className="p-4 font-medium">
                        {row.structure}
                        {row.popular ? (
                          <span className="ml-2 rounded-full bg-gold/15 px-2 py-0.5 text-[0.65rem] font-semibold tracking-wide text-gold-strong uppercase">
                            Most popular
                          </span>
                        ) : null}
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {row.bestFor}
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {row.keyPoints}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-8 flex flex-col gap-4 md:hidden">
              {INDIA.structures.rows.map((row) => (
                <div
                  key={row.structure}
                  className="rounded-lg border bg-background p-4"
                >
                  <p className="font-medium">
                    {row.structure}
                    {row.popular ? (
                      <span className="ml-2 rounded-full bg-gold/15 px-2 py-0.5 text-[0.65rem] font-semibold tracking-wide text-gold-strong uppercase">
                        Most popular
                      </span>
                    ) : null}
                  </p>
                  <p className="mt-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Best for
                  </p>
                  <p className="text-sm text-muted-foreground">{row.bestFor}</p>
                  <p className="mt-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Key points
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {row.keyPoints}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Our India services + process */}
      <section aria-label="India services" className="bg-background">
        <div
          className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-2 lg:gap-16 lg:px-8"
          id="how-it-works"
        >
          <div>
            <SectionHeading eyebrow="Services" title="Our India Services" />
            <ul className="mt-6 flex flex-col divide-y divide-border rounded-lg border">
              {INDIA.servicesList.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 p-4 text-sm leading-relaxed"
                >
                  <span
                    aria-hidden="true"
                    className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold-strong"
                  >
                    <CheckIcon className="size-3" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading eyebrow="Process" title={INDIA.process.title} />
            <ol className="mt-6 flex flex-col gap-0">
              {INDIA.process.steps.map((step, index) => (
                <li
                  key={step.title}
                  className="relative flex gap-4 pb-8 last:pb-0"
                >
                  {index < INDIA.process.steps.length - 1 ? (
                    <span
                      aria-hidden="true"
                      className="absolute top-9 left-[1.06rem] h-full w-px bg-border"
                    />
                  ) : null}
                  <span
                    aria-hidden="true"
                    className="relative z-10 inline-flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-gold bg-primary font-mono text-sm font-semibold text-primary-foreground"
                  >
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold">{step.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* NRI / FEMA callout */}
      <section aria-labelledby="india-nri" className="bg-background-alt">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20 lg:px-8">
          <Alert variant="gold" className="max-w-4xl p-6 md:p-8 [&>svg]:size-5">
            <AlertTitle id="india-nri" className="mb-2 text-lg">
              {INDIA.nri.title}
            </AlertTitle>
            <AlertDescription className="text-base">
              {INDIA.nri.intro}
              <ul className="mt-4 flex flex-col gap-2">
                {INDIA.nri.points.map((point) => (
                  <li key={point} className="flex items-start gap-2.5">
                    <CheckIcon
                      aria-hidden="true"
                      className="mt-0.5 size-4 shrink-0 text-gold-strong"
                    />
                    {point}
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>

          <div className="mt-12 grid gap-px overflow-hidden rounded-lg border sm:grid-cols-2 lg:grid-cols-3">
            {INDIA.whyUs.map((point) => (
              <p
                key={point}
                className="bg-background p-5 text-sm leading-relaxed text-muted-foreground"
              >
                {point}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing packages — PENDING_CLIENT_DATA, never published with placeholder fees */}
      {INDIA.pricing.published ? (
        <section aria-labelledby="india-pricing" className="bg-background">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20 lg:px-8">
            <SectionHeading
              eyebrow="Pricing"
              title="Transparent package pricing"
            />
            <div className="mt-8 grid gap-5 md:grid-cols-3">…</div>
          </div>
        </section>
      ) : null}

      {/* FAQs */}
      <section aria-labelledby="india-faqs" className="bg-background">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 md:py-20 lg:px-8">
          <SectionHeading
            eyebrow="FAQs"
            title={
              <span id="india-faqs" className="contents">
                India registration questions
              </span>
            }
          />
          <Accordion className="mt-6">
            {INDIA.faqs.map((faq) => (
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

      {/* Closing CTA */}
      <CTASection
        title={INDIA.closingCta.title}
        subheadline={INDIA.closingCta.subheadline}
        buttons={[
          {
            label: INDIA.hero.primaryCta.label,
            href: "/contact/",
            variant: "gold",
          },
        ]}
      />
      <section aria-label="Contact options" className="bg-primary-deep">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {INDIA.trustStrip2.map((item) => (
              <span
                key={item}
                className="text-sm font-medium text-primary-foreground/70"
              >
                ✓ {item}
              </span>
            ))}
            <a
              href={`https://wa.me/${"966510013160"}?text=${encodeURIComponent(
                "Hello Sinai Spark Global India, I want to register my Indian company."
              )}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 items-center rounded-md bg-[#25D366] px-5 text-sm font-medium text-white transition-transform outline-none hover:-translate-y-px focus-visible:ring-3 focus-visible:ring-gold/50"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
