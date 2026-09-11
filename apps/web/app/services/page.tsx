import type { Metadata } from "next"
import {
  Building2Icon,
  FileTextIcon,
  Globe2Icon,
  ShieldCheckIcon,
} from "lucide-react"

import { IMAGES } from "@/lib/images"
import { getAllServices } from "@/lib/content/services"
import { ImageHero } from "@/components/site/image-hero"
import { CtaLink } from "@/components/site/cta-link"
import { CTASection } from "@/components/site/cta-section"
import { GlassCard } from "@/components/site/glass-card"
import { ServicesDirectory } from "@/components/services/services-directory"

export const metadata: Metadata = {
  title: "Corporate Advisory & Licensing Practices",
  description:
    "Explore Sinai Spark Global's corporate practices across Saudi Arabia, UAE, the UK, India, and Bahrain: company formation, MISA registration, licensing, legal advisory, PRO & visa, compliance, and property management.",
  alternates: { canonical: "/services/" },
}

const highlights = [
  {
    icon: Building2Icon,
    value: `${getAllServices().length} Practices`,
    label: "Setup, Licensing & Operations",
  },
  {
    icon: Globe2Icon,
    value: "5 Key Markets",
    label: "Saudi Arabia, UAE, UK, India, Bahrain",
  },
  {
    icon: ShieldCheckIcon,
    value: "100% Ownership",
    label: "Foreign Investment Law Compliant",
  },
  {
    icon: FileTextIcon,
    value: "Turnkey Liaison",
    label: "MISA, MoC, ZATCA & MHRSD",
  },
]

export default function ServicesHubPage() {
  return (
    <>
      {/* 1 · Hero */}
      <ImageHero
        asset={IMAGES.serviceBusinessSetup}
        size="compact"
        breadcrumbPath="/services/"
        eyebrow="Global Market Entry & Corporate Advisory Practices"
        title="End-to-end corporate capabilities across Saudi Arabia & key global markets"
        subtitle="From foundational company formation and ministerial MISA licensing to full-scale government liaison, legal advisory, and operational property management."
        priority
      >
        <CtaLink href="/contact/" variant="brand" size="lg">
          Schedule Practice Consultation
        </CtaLink>
        <CtaLink href="/sinai-spark-india/" variant="secondary" size="lg" arrow>
          Explore India Cross-Border Gateway
        </CtaLink>
      </ImageHero>

      {/* 2 · Institutional highlights — closes the dark opening */}
      <section
        aria-label="Practice highlights"
        data-surface="navy"
        className="border-t border-white/10 bg-primary-deep"
      >
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-12 lg:px-8">
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {highlights.map(({ icon: Icon, value, label }) => (
              <GlassCard key={value} className="flex items-start gap-4 p-5">
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand/15 text-brand">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-lg font-semibold tracking-tight text-primary-foreground">
                    {value}
                  </p>
                  <p className="mt-0.5 text-xs leading-snug text-primary-foreground/70">
                    {label}
                  </p>
                </div>
              </GlassCard>
            ))}
          </ul>
        </div>
      </section>

      {/* 3 · Interactive practice directory */}
      <section
        aria-label="Advisory Practices Directory"
        className="bg-background"
      >
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <ServicesDirectory />
        </div>
      </section>

      {/* 4 · Closing CTA */}
      <CTASection
        eyebrow="Advisory Assessment"
        title="Need guidance selecting the right entity structure or license?"
        subheadline="Schedule a consultation with our market-entry directors. We evaluate your commercial model, capital requirements, and timelines, free of charge."
        buttons={[
          {
            label: "Book a Free Consultation",
            href: "/contact/",
            variant: "brand",
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
