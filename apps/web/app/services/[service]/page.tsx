import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { CheckIcon } from "lucide-react"

import { getAllServices, getService } from "@/lib/content/services"
import { IMAGES } from "@/lib/images"
import { Breadcrumbs } from "@/components/site/breadcrumbs"
import { ImageHero } from "@/components/site/image-hero"
import { CTASection } from "@/components/site/cta-section"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/alert"
import { Reveal } from "@/components/motion/reveal"

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
    .filter((s) => s.slug !== service.slug && !s.slug.includes("license"))
    .slice(0, 3)

  return (
    <>
      {/* Hero — imagery when available, navy band otherwise (§13). */}
      <div className="relative">
        <ImageHero
          asset={asset}
          size="compact"
          title={service.title}
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

      <section className="bg-background">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-12 sm:px-6 md:py-16 lg:grid-cols-[7fr_5fr] lg:gap-16 lg:px-8">
          <Reveal>
            {service.intro.map((paragraph) => (
              <p
                key={paragraph.slice(0, 24)}
                className="mb-5 text-lg leading-relaxed text-muted-foreground first:text-foreground"
              >
                {paragraph}
              </p>
            ))}

            <h2 className="mt-10 mb-4 text-xl font-semibold tracking-tight">
              What this service covers
            </h2>
            <ul className="flex flex-col divide-y divide-border rounded-lg border">
              {service.bullets.map((bullet) => (
                <li
                  key={bullet}
                  className="flex items-start gap-3 p-4 text-sm leading-relaxed"
                >
                  <span
                    aria-hidden="true"
                    className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold-strong"
                  >
                    <CheckIcon className="size-3" />
                  </span>
                  {bullet}
                </li>
              ))}
            </ul>

            {/* Dispute-support scope guard — renders ONLY on Business Setup KSA. */}
            {service.disputeSupport ? (
              <Alert variant="gold" className="mt-8">
                <AlertTitle>
                  Dispute support, scoped to the Saudi practice
                </AlertTitle>
                <AlertDescription>
                  Dispute support guidance and referrals are offered within our
                  Saudi Arabia practice specifically and are not implied as
                  available in every market we operate in.
                </AlertDescription>
              </Alert>
            ) : null}
          </Reveal>

          <aside className="lg:border-l lg:border-border lg:pl-12">
            <h2 className="mb-4 text-sm font-semibold tracking-[0.14em] uppercase">
              Other services
            </h2>
            <nav
              aria-label="Related services"
              className="flex flex-col divide-y divide-border"
            >
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/services/${item.slug}/`}
                  className="group py-3 outline-none"
                >
                  <span className="block text-sm font-medium transition-colors group-hover:text-primary group-focus-visible:text-primary">
                    {item.navTitle}
                  </span>
                </Link>
              ))}
              <Link
                href="/services/"
                className="mt-3 w-fit text-sm font-medium text-gold-strong transition-colors hover:text-primary"
              >
                View all services →
              </Link>
            </nav>
          </aside>
        </div>
      </section>

      <CTASection
        title="Ready to move forward?"
        subheadline={`Speak to our team about ${service.title.toLowerCase()} — the consultation is free.`}
        buttons={[
          {
            label: "Book a Free Consultation",
            href: "/contact/",
            variant: "gold",
          },
          { label: "View FAQs", href: "/faqs/", variant: "secondary" },
        ]}
      />
    </>
  )
}
