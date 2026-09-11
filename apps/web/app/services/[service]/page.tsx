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
import { SITE } from "@/lib/site-config"
import { ImageHero } from "@/components/site/image-hero"
import { CtaLink } from "@/components/site/cta-link"
import { CTASection } from "@/components/site/cta-section"

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
  const all = getAllServices()
  const related = all.filter((s) => s.slug !== service.slug).slice(0, 3)
  const practiceLabel =
    service.category === "core" ? "Strategic Advisory" : "Commercial Licensing"

  return (
    <>
      {/* 1 · Hero */}
      <ImageHero
        asset={asset}
        size="compact"
        breadcrumbPath={pathname}
        eyebrow={`Saudi Arabia & GCC Practice · ${practiceLabel}`}
        title={service.title}
        priority
      />

      {/* 2 · Assurance strip */}
      <div className="border-b border-border/80 bg-background-alt">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {service.assurances.map((assurance) => (
              <li
                key={assurance}
                className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-background px-4 py-3.5"
              >
                <ShieldCheckIcon
                  className="size-4 shrink-0 text-brand"
                  aria-hidden="true"
                />
                <span className="text-xs font-semibold text-foreground">
                  {assurance}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 3 · Main content */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[8fr_4fr] lg:gap-16">
            {/* Narrative, mandates, roadmap */}
            <div className="flex flex-col gap-14">
              <div>
                <h2 className="text-xs font-semibold tracking-[0.16em] text-brand uppercase">
                  Practice Overview
                </h2>
                <div className="mt-5 flex flex-col gap-5 text-base leading-relaxed text-muted-foreground md:text-lg">
                  {service.intro.map((paragraph, index) => (
                    <p
                      key={paragraph.slice(0, 24)}
                      className={
                        index === 0
                          ? "text-lg leading-relaxed font-medium text-foreground md:text-xl"
                          : ""
                      }
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-border/80 bg-background-alt p-7 sm:p-9">
                <div className="flex items-center justify-between gap-4 border-b border-border/60 pb-5">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.16em] text-brand uppercase">
                      Engagement Scope
                    </p>
                    <h3 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
                      What This Practice Delivers
                    </h3>
                  </div>
                  <FileCheckIcon
                    className="size-6 shrink-0 text-brand"
                    aria-hidden="true"
                  />
                </div>

                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {service.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex items-start gap-3 rounded-xl border border-border bg-background p-4"
                    >
                      <CheckCircle2Icon
                        className="mt-0.5 size-4 shrink-0 text-brand"
                        aria-hidden="true"
                      />
                      <span className="text-sm leading-relaxed text-foreground">
                        {bullet}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {service.phases && service.phases.length > 0 ? (
                <div>
                  <p className="text-xs font-semibold tracking-[0.16em] text-brand uppercase">
                    Delivery Roadmap
                  </p>
                  <h3 className="mt-1 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                    How We Execute This Practice
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    Our standard execution framework ensures complete compliance
                    and ministry alignment at each milestone.
                  </p>

                  <ol className="mt-7 flex flex-col gap-3">
                    {service.phases.map((phase, idx) => (
                      <li
                        key={phase.title}
                        className="flex flex-col gap-3 rounded-2xl border border-border bg-background p-6 transition-[border-color,transform] duration-200 ease-out hover:border-brand/60 sm:flex-row sm:items-start sm:gap-6"
                      >
                        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-brand bg-primary text-sm font-semibold text-primary-foreground tabular-nums">
                          {idx + 1}
                        </span>
                        <div>
                          <h4 className="text-base font-semibold text-foreground">
                            {phase.title}
                          </h4>
                          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                            {phase.description}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              ) : null}

              {service.disputeSupport ? (
                <div className="rounded-2xl border border-brand/40 bg-brand-soft/50 p-6 sm:p-8">
                  <div className="flex items-start gap-4">
                    <ShieldAlertIcon
                      className="size-6 shrink-0 text-brand"
                      aria-hidden="true"
                    />
                    <div>
                      <h4 className="text-base font-semibold text-foreground">
                        Dispute Support & Ministry Mediation (Saudi Practice
                        Only)
                      </h4>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
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

            {/* Sticky advisory sidebar */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-2xl border border-border/80 bg-background p-6 shadow-[0_8px_30px_-12px_rgba(0,56,102,0.18)]">
                <span className="inline-flex rounded-full bg-brand px-2.5 py-1 text-[0.68rem] font-bold tracking-[0.12em] text-brand-foreground uppercase">
                  Direct Advisory Desk
                </span>
                <h3 className="mt-4 text-xl font-semibold tracking-tight text-foreground">
                  Consult with a{" "}
                  {service.category === "core"
                    ? "Practice Director"
                    : "Licensing Specialist"}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Get a definitive evaluation of statutory requirements, capital
                  obligations, and execution timelines for your business.
                </p>

                <div className="mt-6 flex flex-col gap-3">
                  <CtaLink href="/contact/" variant="brand" arrow>
                    Request Free Consultation
                  </CtaLink>
                  <a
                    href={`https://wa.me/${SITE.whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#25D366]/40 bg-[#25D366]/10 px-4 text-sm font-semibold text-[#128C7E] transition-[background-color,transform] duration-200 ease-out outline-none hover:bg-[#25D366]/20 focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-[0.97]"
                  >
                    <MessageSquareIcon className="size-4" aria-hidden="true" />
                    WhatsApp Advisory Desk
                  </a>
                </div>

                <dl className="mt-6 flex flex-col gap-2 border-t border-border/60 pt-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <PhoneCallIcon
                      className="size-4 text-brand"
                      aria-hidden="true"
                    />
                    <dt className="sr-only">Phone</dt>
                    <dd>
                      Riyadh Office:{" "}
                      <a
                        href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                        className="text-foreground hover:text-primary"
                      >
                        {SITE.phone}
                      </a>
                    </dd>
                  </div>
                  <div className="flex items-start gap-2">
                    <Globe2Icon
                      className="mt-0.5 size-4 shrink-0 text-brand"
                      aria-hidden="true"
                    />
                    <dt className="sr-only">Jurisdictions</dt>
                    <dd>Jurisdictions: {service.jurisdictions.join(", ")}</dd>
                  </div>
                </dl>

                <div className="mt-8 border-t border-border/80 pt-6">
                  <h4 className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                    Complementary Practices
                  </h4>
                  <ul className="mt-3 flex flex-col divide-y divide-border/60">
                    {related.map((item) => (
                      <li key={item.slug}>
                        <Link
                          href={`/services/${item.slug}/`}
                          className="group flex items-center justify-between py-3 text-sm font-medium text-foreground transition-colors outline-none hover:text-primary focus-visible:text-primary"
                        >
                          <span>{item.navTitle}</span>
                          <ArrowRightIcon
                            className="size-4 text-muted-foreground transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:text-primary"
                            aria-hidden="true"
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/services/"
                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand outline-none hover:underline focus-visible:underline"
                  >
                    View all {all.length} corporate practices
                    <ArrowRightIcon className="size-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* 4 · Closing CTA */}
      <CTASection
        eyebrow="Next Step"
        title={`Ready to initiate ${service.title.toLowerCase()}?`}
        subheadline="Speak with our directors today for a clear breakdown of documentation, fees, and government processing windows."
        buttons={[
          {
            label: "Book a Free Consultation",
            href: "/contact/",
            variant: "brand",
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
