import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowRightIcon,
  Building2Icon,
  FileTextIcon,
  Globe2Icon,
  ShieldCheckIcon,
} from "lucide-react"

import { Breadcrumbs } from "@/components/site/breadcrumbs"
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
      {/* 1 · Prestigious Editorial Hero Header */}
      <div className="border-b border-border/60 bg-background-alt">
        <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          <Breadcrumbs pathname="/services/" />
        </div>

        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-bold tracking-[0.15em] text-gold-strong uppercase">
              Global Market Entry & Corporate Advisory Practices
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl lg:text-5xl">
              End-to-end corporate capabilities across Saudi Arabia & key global
              markets
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              From foundational company formation and ministerial MISA licensing
              to full-scale government liaison, legal advisory, and operational
              property management.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/contact/"
                className="inline-flex h-11 items-center gap-2 rounded-md bg-gold px-6 text-xs font-bold text-primary-deep shadow-sm transition-all hover:-translate-y-px hover:bg-gold/90"
              >
                Schedule Practice Consultation
                <ArrowRightIcon className="size-4" />
              </Link>
              <Link
                href="/sinai-spark-india/"
                className="inline-flex h-11 items-center gap-2 rounded-md border border-border bg-background px-5 text-xs font-semibold text-foreground transition-colors hover:border-gold hover:text-primary"
              >
                Explore India Cross-Border Gateway →
              </Link>
            </div>
          </div>

          {/* Institutional Highlights Grid */}
          <div className="mt-12 grid grid-cols-2 gap-4 border-t border-border/80 pt-8 sm:grid-cols-4">
            <div className="flex items-start gap-3">
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-gold/15 text-gold-strong">
                <Building2Icon className="size-4" />
              </span>
              <div>
                <p className="text-lg font-bold text-foreground">
                  10 Practices
                </p>
                <p className="text-xs text-muted-foreground">
                  Setup, Licensing & Operations
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-gold/15 text-gold-strong">
                <Globe2Icon className="size-4" />
              </span>
              <div>
                <p className="text-lg font-bold text-foreground">
                  5 Key Markets
                </p>
                <p className="text-xs text-muted-foreground">
                  Saudi Arabia, UAE, UK, India, Bahrain
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-gold/15 text-gold-strong">
                <ShieldCheckIcon className="size-4" />
              </span>
              <div>
                <p className="text-lg font-bold text-foreground">
                  100% Ownership
                </p>
                <p className="text-xs text-muted-foreground">
                  Foreign Investment Law Compliant
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-gold/15 text-gold-strong">
                <FileTextIcon className="size-4" />
              </span>
              <div>
                <p className="text-lg font-bold text-foreground">
                  Turnkey Liaison
                </p>
                <p className="text-xs text-muted-foreground">
                  MISA, MoC, ZATCA & MHRSD
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2 · Main Interactive Practice Directory */}
      <section
        aria-label="Advisory Practices Directory"
        className="bg-background"
      >
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20 lg:px-8">
          <ServicesDirectory />
        </div>
      </section>

      {/* 3 · Bottom Advisory Assessment CTA */}
      <CTASection
        eyebrow="Advisory Assessment"
        title="Need guidance selecting the right entity structure or license?"
        subheadline="Schedule a consultation with our market-entry directors. We evaluate your commercial model, capital requirements, and timelines, free of charge."
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
