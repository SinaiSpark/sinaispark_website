import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import Image from "next/image"

import { HOME } from "@/lib/content/home"
import { IMAGES } from "@/lib/images"
import { Breadcrumbs } from "@/components/site/breadcrumbs"
import { CTASection } from "@/components/site/cta-section"

const COUNTRIES: Record<
  string,
  {
    name: string
    imageKey: keyof typeof IMAGES
    summary: string
    /** Which approved service best represents this market today. */
    relatedService?: string
  }
> = {
  "saudi-arabia": {
    name: "Saudi Arabia",
    imageKey: "countrySaudiArabia",
    summary:
      "Our flagship market. Complete business setup, licensing, PRO and compliance support across Riyadh, Jeddah and Dammam.",
    relatedService: "/services/administrative-solutions/",
  },
  uae: {
    name: "United Arab Emirates",
    imageKey: "countryUae",
    summary:
      "Market entry across the Gulf's commercial hub. A full UAE practice page is in preparation.",
    relatedService: "/services/",
  },
  uk: {
    name: "United Kingdom",
    imageKey: "countryUk",
    summary:
      "UK expansion and compliance support for international businesses. A dedicated UK page is in preparation.",
    relatedService: "/services/legal-services/",
  },
  bahrain: {
    name: "Bahrain",
    imageKey: "countryBahrain",
    summary:
      "GCC market entry with local insight. A dedicated Bahrain page is in preparation.",
    relatedService: "/services/compliance/",
  },
}

interface Props {
  params: Promise<{ country: string }>
}

export function generateStaticParams() {
  return Object.keys(COUNTRIES).map((country) => ({ country }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country } = await params
  const data = COUNTRIES[country]
  if (!data) return {}
  return {
    title: `Business Setup in ${data.name}`,
    description: data.summary,
    alternates: { canonical: `/where-we-work/${country}/` },
  }
}

/**
 * Placeholder country pages (Decision #6) — expandable to full landing pages.
 */
export default async function CountryPage({ params }: Props) {
  const { country } = await params
  const data = COUNTRIES[country]
  if (!data) notFound()

  const asset = IMAGES[data.imageKey]

  return (
    <>
      <div className="relative min-h-[46svh]">
        <Image
          src={asset.src}
          alt={asset.alt}
          fill
          priority
          sizes="100vw"
          quality={80}
          className="object-cover"
          style={asset.focal ? { objectPosition: asset.focal } : undefined}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-primary-deep/95 via-primary/60 to-transparent"
        />
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
            <Breadcrumbs
              pathname={`/where-we-work/${country}/`}
              tone="navy"
              className="mb-3"
            />
            <h1 className="max-w-2xl text-4xl font-semibold tracking-[-0.02em] text-primary-foreground md:text-5xl">
              Business Setup in {data.name}
            </h1>
          </div>
        </div>
      </div>

      <section className="bg-background">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-lg leading-relaxed text-muted-foreground">
            {data.summary}
          </p>

          {/* India gets its own landing page (Decision #6); KSA links into its service. */}
          <Link
            href={data.relatedService ?? "/contact/"}
            className="mt-8 inline-flex h-11 items-center rounded-md border border-border px-5 text-sm font-medium transition-colors outline-none hover:border-gold/60 focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            Explore our services in {data.name}
          </Link>
        </div>
      </section>

      <CTASection
        title={`Ready to enter ${data.name}?`}
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
