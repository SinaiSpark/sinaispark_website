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
      <div
        className="relative border-b border-border/60 bg-primary bg-cover bg-center"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop")',
        }}
      >
        <div className="absolute inset-0 bg-primary-deep/90" />
        <div className="relative mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          <Breadcrumbs pathname="/services/" tone="navy" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-bold tracking-[0.15em] text-gold uppercase">
              Global Market Entry & Corporate Advisory Practices
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl lg:text-5xl">
              End-to-end corporate capabilities across Saudi Arabia & key global
              markets
            </h1>
            <p className="mt-4 text-base leading-relaxed text-white/80 sm:text-lg">
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
                className="inline-flex h-11 items-center gap-2 rounded-md border border-white/20 bg-white/5 px-5 text-xs font-semibold text-white backdrop-blur-sm transition-colors hover:border-gold hover:text-gold"
              >
                Explore India Cross-Border Gateway →
              </Link>
            </div>
          </div>

          {/* Institutional Highlights Grid */}
          <div className="mt-12 grid grid-cols-2 gap-4 border-t border-white/10 pt-8 sm:grid-cols-4">
            <div className="flex items-start gap-3">
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-gold/15 text-gold">
                <Building2Icon className="size-4" />
              </span>
              <div>
                <p className="text-lg font-bold text-white">10 Practices</p>
                <p className="text-xs text-white/70">
                  Setup, Licensing & Operations
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-gold/15 text-gold">
                <Globe2Icon className="size-4" />
              </span>
              <div>
                <p className="text-lg font-bold text-white">5 Key Markets</p>
                <p className="text-xs text-white/70">
                  Saudi Arabia, UAE, UK, India, Bahrain
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-gold/15 text-gold">
                <ShieldCheckIcon className="size-4" />
              </span>
              <div>
                <p className="text-lg font-bold text-white">100% Ownership</p>
                <p className="text-xs text-white/70">
                  Foreign Investment Law Compliant
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-gold/15 text-gold">
                <FileTextIcon className="size-4" />
              </span>
              <div>
                <p className="text-lg font-bold text-white">Turnkey Liaison</p>
                <p className="text-xs text-white/70">
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
