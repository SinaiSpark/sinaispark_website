import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowRightIcon,
  CheckCircle2Icon,
  FileCheckIcon,
  Globe2Icon,
  MessageSquareIcon,
  PhoneCallIcon,
  ShieldAlertIcon,
  ShieldCheckIcon,
} from "lucide-react"

import { getAllServices, getService } from "@/lib/content/services"
import { IMAGES } from "@/lib/images"
import { Breadcrumbs } from "@/components/site/breadcrumbs"
import { ImageHero } from "@/components/site/image-hero"
import { CTASection } from "@/components/site/cta-section"
import { Badge } from "@workspace/ui/components/badge"

interface Props {
  params: Promise<{ service: string }>
}

export function generateStaticParams() {
  return getAllServices().map((service) => ({ service: service.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { service: slug } = await params
  const service = getService(slug)
  if (!service) return {}
  return {
    title: `${service.title} | Sinai Spark Global`,
    description: service.metaDescription,
    keywords: service.keywords,
    alternates: { canonical: `/services/${service.slug}/` },
  }
}

export default async function ServiceDetailPage({ params }: Props) {
  const { service: slug } = await params
  const service = getService(slug)
  if (!service) notFound()

  const asset = service.imageKey ? IMAGES[service.imageKey] : null
  const pathname = `/services/${service.slug}/`
  const related = getAllServices()
    .filter((s) => s.slug !== service.slug)
    .slice(0, 3)

  return (
    <>
      {/* 1 · Hero Section with Media and Breadcrumbs */}
      <div className="relative">
        <ImageHero
          asset={asset}
          size="compact"
          title={service.title}
          eyebrow={`SAUDI ARABIA & GCC PRACTICE · ${service.category === "core" ? "STRATEGIC ADVISORY" : "COMMERCIAL LICENSING"}`}
          priority
          className={asset ? "" : "bg-primary"}
        />
        <div className="absolute inset-x-0 bottom-0 hidden md:block">
          <div className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
            <Breadcrumbs pathname={pathname} tone="navy" />
          </div>
        </div>
      </div>
      <div className="border-b bg-background">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 md:hidden lg:px-8">
          <Breadcrumbs pathname={pathname} />
        </div>
      </div>

      {/* 2 · Key Assurance Metrics Strip */}
      <div className="border-b border-border/80 bg-background-alt">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {service.assurances.map((assurance) => (
              <div
                key={assurance}
                className="flex items-center gap-2.5 rounded-lg border border-border/60 bg-background p-3.5 shadow-xs"
              >
                <ShieldCheckIcon className="size-4 shrink-0 text-gold-strong" />
                <span className="text-xs font-semibold text-foreground">
                  {assurance}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3 · Main Content Architecture */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[8fr_4fr] lg:gap-16">
            {/* Left Main Column: Narrative, Mandates, Roadmap */}
            <div className="flex flex-col gap-12">
              {/* Executive Overview */}
              <div>
                <h2 className="text-sm font-bold tracking-[0.14em] text-gold-strong uppercase">
                  Practice Overview
                </h2>
                <div className="mt-4 flex flex-col gap-4 text-base leading-relaxed text-muted-foreground">
                  {service.intro.map((paragraph, index) => (
                    <p
                      key={paragraph.slice(0, 24)}
                      className={
                        index === 0
                          ? "text-lg leading-relaxed font-medium text-foreground"
                          : ""
                      }
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Core Mandates & Deliverables Grid */}
              <div className="rounded-xl border border-border/80 bg-background-alt p-7 sm:p-8">
                <div className="flex items-center justify-between border-b border-border/60 pb-4">
                  <div>
                    <p className="text-xs font-bold tracking-wider text-gold-strong uppercase">
                      Engagement Scope
                    </p>
                    <h3 className="text-xl font-bold tracking-tight text-foreground">
                      What This Practice Delivers
                    </h3>
                  </div>
                  <FileCheckIcon className="size-6 text-gold" />
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {service.bullets.map((bullet) => (
                    <div
                      key={bullet}
                      className="flex items-start gap-3 rounded-lg border border-border bg-background p-4 shadow-xs"
                    >
                      <CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-gold-strong" />
                      <span className="text-xs leading-relaxed font-medium text-foreground">
                        {bullet}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Phased Roadmap Sequence */}
              {service.phases && service.phases.length > 0 ? (
                <div>
                  <h3 className="text-sm font-bold tracking-[0.14em] text-gold-strong uppercase">
                    Delivery Roadmap
                  </h3>
                  <h4 className="mt-1 text-2xl font-bold tracking-tight text-foreground">
                    How We Execute This Practice
                  </h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Our standard execution framework ensures complete compliance
                    and ministry alignment at each milestone.
                  </p>

                  <div className="mt-6 flex flex-col gap-4">
                    {service.phases.map((phase, idx) => (
                      <div
                        key={phase.title}
                        className="relative flex flex-col gap-2 rounded-xl border border-border bg-background p-6 transition-all hover:border-gold/60 sm:flex-row sm:items-start sm:gap-6"
                      >
                        <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
                          0{idx + 1}
                        </span>
                        <div>
                          <h5 className="text-base font-bold text-foreground">
                            {phase.title}
                          </h5>
                          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                            {phase.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Dispute Support Scope Guard (Scoped to Saudi Business Setup only) */}
              {service.disputeSupport ? (
                <div className="rounded-xl border border-gold/40 bg-gold/5 p-6 sm:p-8">
                  <div className="flex items-start gap-4">
                    <ShieldAlertIcon className="size-6 shrink-0 text-gold-strong" />
                    <div>
                      <h4 className="text-base font-bold text-foreground">
                        Dispute Support & Ministry Mediation (Saudi Practice
                        Only)
                      </h4>
                      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                        Dispute support guidance and legal mediation referrals
                        are offered specifically within our Saudi Arabia
                        corporate practice to resolve contractual ambiguities or
                        licensing conflicts that emerge during market entry.
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Right Sticky Sidebar: Specialist Advisory Box & Navigation */}
            <div className="flex flex-col gap-8">
              {/* Specialist Action Box */}
              <div className="sticky top-24 rounded-xl border border-border/80 bg-background p-6 shadow-md">
                <span className="rounded bg-gold px-2 py-0.5 text-[0.68rem] font-bold tracking-wider text-primary-deep uppercase">
                  Direct Advisory Desk
                </span>
                <h3 className="mt-3 text-lg font-bold text-foreground">
                  Consult with a{" "}
                  {service.category === "core"
                    ? "Practice Director"
                    : "Licensing Specialist"}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Get a definitive evaluation of statutory requirements, capital
                  obligations, and execution timelines for your business.
                </p>

                <div className="mt-6 flex flex-col gap-3">
                  <Link
                    href="/contact/"
                    className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-gold px-4 text-xs font-bold text-primary-deep shadow-sm transition-all hover:-translate-y-px hover:bg-gold/90"
                  >
                    Request Free Consultation
                    <ArrowRightIcon className="size-3.5" />
                  </Link>
                  <a
                    href="https://wa.me/966510013160"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-[#25D366]/40 bg-[#25D366]/10 px-4 text-xs font-semibold text-[#128C7E] transition-colors hover:bg-[#25D366]/20"
                  >
                    <MessageSquareIcon className="size-3.5" />
                    WhatsApp Advisory Desk
                  </a>
                </div>

                <div className="mt-6 border-t border-border/60 pt-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <PhoneCallIcon className="size-3.5 text-gold-strong" />
                    <span>Riyadh Office: +966 51 001 3160</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <Globe2Icon className="size-3.5 text-gold-strong" />
                    <span>
                      Jurisdictions: {service.jurisdictions.join(", ")}
                    </span>
                  </div>
                </div>

                {/* Related Practices */}
                <div className="mt-8 border-t border-border/80 pt-6">
                  <h4 className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                    Complementary Practices
                  </h4>
                  <div className="mt-3 flex flex-col divide-y divide-border/60">
                    {related.map((item) => (
                      <Link
                        key={item.slug}
                        href={`/services/${item.slug}/`}
                        className="group flex items-center justify-between py-2.5 text-xs font-semibold text-foreground transition-colors hover:text-primary"
                      >
                        <span>{item.navTitle}</span>
                        <ArrowRightIcon className="size-3 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                      </Link>
                    ))}
                  </div>
                  <Link
                    href="/services/"
                    className="mt-4 block text-xs font-bold text-gold-strong hover:text-gold"
                  >
                    View all 10 corporate practices →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 · Bottom Closing CTA */}
      <CTASection
        eyebrow="Next Step"
        title={`Ready to initiate ${service.title.toLowerCase()}?`}
        subheadline="Speak with our directors today for a clear breakdown of documentation, fees, and government processing windows."
        buttons={[
          {
            label: "Book a Free Consultation",
            href: "/contact/",
            variant: "gold",
          },
          {
            label: "View All Practices",
            href: "/services/",
            variant: "secondary",
          },
        ]}
      />
    </>
  )
}
