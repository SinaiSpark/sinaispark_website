import type { Metadata } from "next"

import { Breadcrumbs } from "@/components/site/breadcrumbs"
import { CTASection } from "@/components/site/cta-section"
import { SectionHeading } from "@/components/site/section-heading"
import { Reveal } from "@/components/motion/reveal"

export const metadata: Metadata = {
  title: "About Sinai Spark Global: Global Business Setup Advisors",
  description:
    "Sinai Spark Global is a business setup and corporate solutions firm supporting company formation, licensing and compliance for investors expanding into new markets.",
  alternates: { canonical: "/about-us/" },
}

const apart = [
  "A single point of contact across formation, licensing, legal and compliance",
  "Hands on experience across Riyadh, Jeddah and Dammam",
  "A cross border perspective spanning Saudi Arabia, the UAE, the UK, India and Bahrain",
]

const values = [
  { title: "Trust", body: "Clear, honest guidance at every stage." },
  { title: "Precision", body: "No shortcuts on regulatory detail." },
  {
    title: "Partnership",
    body: "Success measured by client outcomes, not transactions.",
  },
]

export default function AboutPage() {
  return (
    <>
      <div className="bg-background-alt">
        <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          <Breadcrumbs pathname="/about-us/" />
        </div>
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
          <SectionHeading
            eyebrow="About Us"
            title={
              <span className="contents">
                From a Saudi formation service to a global corporate solutions
                firm
              </span>
            }
          />
        </div>
      </div>

      <section aria-label="Our story" className="bg-background">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
          <Reveal>
            <h2 className="text-xl font-semibold tracking-tight">Our Story</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Sinai Spark Global was founded to close the gap between
              international ambition and the fast evolving regulatory landscape
              of the markets our clients want to enter. What began as a company
              formation service focused on Saudi Arabia has grown into a full
              corporate solutions firm with active reach across the UAE, the UK,
              India and Bahrain, supporting clients from their first
              registration through years of ongoing operation.
            </p>
          </Reveal>

          <Reveal delay={0.05} className="mt-12">
            <h2 className="text-xl font-semibold tracking-tight">
              What Sets Us Apart
            </h2>
            <ul className="mt-4 flex flex-col divide-y divide-border rounded-lg border">
              {apart.map((point) => (
                <li key={point} className="p-4 text-sm leading-relaxed">
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1} className="mt-12">
            <h2 className="text-xl font-semibold tracking-tight">Our Values</h2>
            <div className="mt-4 grid gap-px overflow-hidden rounded-lg border sm:grid-cols-3">
              {values.map((value) => (
                <div key={value.title} className="bg-background p-5">
                  <h3 className="inline-block border-t-2 border-gold pt-2 font-semibold">
                    {value.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {value.body}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Team section intentionally omitted pending client team data (Conflict log #3). */}
        </div>
      </section>

      <CTASection
        title="Let's build your market entry together"
        buttons={[
          {
            label: "Book a Free Consultation",
            href: "/contact/",
            variant: "gold",
          },
        ]}
      />
    </>
  )
}
