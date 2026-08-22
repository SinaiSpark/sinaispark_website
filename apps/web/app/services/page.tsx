import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRightIcon } from "lucide-react"

import { getAllServices } from "@/lib/content/services"
import { Breadcrumbs } from "@/components/site/breadcrumbs"
import { SectionHeading } from "@/components/site/section-heading"
import { CTASection } from "@/components/site/cta-section"
import { Reveal } from "@/components/motion/reveal"

export const metadata: Metadata = {
  title: "Services: Business Setup, Licensing, Legal & Compliance",
  description:
    "Explore Sinai Spark Global's services across Saudi Arabia and four more markets: company formation, licensing, legal advisory, PRO & visa, compliance and property management.",
}

export default function ServicesHubPage() {
  const services = getAllServices()
  // Licenses render as a grouped sub-list under their own heading (Decision #2).
  const core = services.filter((s) => !s.slug.includes("license"))
  const licenses = services.filter((s) => s.slug.includes("license"))

  return (
    <>
      <div className="bg-background-alt">
        <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          <Breadcrumbs pathname="/services/" />
        </div>
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
          <SectionHeading
            eyebrow="Our Services"
            title="Everything market entry requires, under one partnership"
            lede="Six core practices covering formation through to ongoing operation, plus the full range of Saudi license types. Saudi Arabia is our flagship market; every service below is delivered there first."
          />
        </div>
      </div>

      <section aria-label="Core services" className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
          <Reveal stagger className="grid gap-5 md:grid-cols-2">
            {core.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}/`}
                className="group relative flex flex-col rounded-lg border border-border p-6 transition-colors outline-none hover:border-gold/60 focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <h2 className="text-xl font-semibold tracking-tight transition-colors group-hover:text-primary">
                  {service.title}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {service.intro[0]}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-gold-strong">
                  Learn more
                  <ArrowUpRightIcon
                    aria-hidden="true"
                    className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </span>
              </Link>
            ))}
          </Reveal>

          <div className="mt-14">
            <h2 className="mb-6 flex items-center gap-3 text-xl font-semibold tracking-tight">
              Business Licensing
              <span aria-hidden="true" className="h-px flex-1 bg-gold" />
            </h2>
            <Reveal
              stagger
              className="grid gap-px overflow-hidden rounded-lg border sm:grid-cols-2 lg:grid-cols-3"
            >
              {licenses.map((license) => (
                <Link
                  key={license.slug}
                  href={`/services/${license.slug}/`}
                  className="group bg-background p-5 transition-colors outline-none focus-visible:bg-accent"
                >
                  <span className="block font-medium">{license.title}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                    {license.intro[0]?.split(".")[0]}.
                  </span>
                </Link>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      <CTASection
        eyebrow="Next Step"
        title="Not sure which route fits your business?"
        subheadline="Tell us your goals and we will recommend the right structure, license and next steps, free of charge."
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
