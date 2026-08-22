import type { Metadata } from "next"

import { Breadcrumbs } from "@/components/site/breadcrumbs"
import { SectionHeading } from "@/components/site/section-heading"
import { CTASection } from "@/components/site/cta-section"
import { ServicesDirectory } from "@/components/services/services-directory"

export const metadata: Metadata = {
  title: "Corporate Advisory & Licensing Practices",
  description:
    "Explore Sinai Spark Global's corporate practices across Saudi Arabia, UAE, the UK, India, and Bahrain: company formation, MISA registration, licensing, legal advisory, PRO & visa, compliance, and property management.",
  alternates: { canonical: "/services/" },
}

export default function ServicesHubPage() {
  return (
    <>
      <div className="border-b border-border/60 bg-background-alt">
        <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          <Breadcrumbs pathname="/services/" />
        </div>
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
          <SectionHeading
            eyebrow="Our Practices & Licensing"
            title="Everything foreign market entry requires, under one institutional partnership"
            lede="From initial corporate structuring and ministerial licensing to ongoing government liaison, compliance, and facility management across five strategic territories."
          />
        </div>
      </div>

      <section
        aria-label="Advisory Practices Directory"
        className="bg-background"
      >
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
          <ServicesDirectory />
        </div>
      </section>

      <CTASection
        eyebrow="Advisory Assessment"
        title="Need guidance selecting the right entity structure or license?"
        subheadline="Schedule a consultation with our market-entry directors. We evaluate your activities, capital requirements, and timelines, free of charge."
        buttons={[
          {
            label: "Book a Free Consultation",
            href: "/contact/",
            variant: "gold",
          },
          {
            label: "Explore Research Reports",
            href: "/research/",
            variant: "secondary",
          },
        ]}
      />
    </>
  )
}
