import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { COUNTRIES, getCountry } from "@/lib/content/markets"
import { IMAGES } from "@/lib/images"
import { ImageHero } from "@/components/site/image-hero"
import { CtaLink } from "@/components/site/cta-link"
import { CTASection } from "@/components/site/cta-section"

interface Props {
  params: Promise<{ country: string }>
}

export function generateStaticParams() {
  return Object.keys(COUNTRIES).map((country) => ({ country }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country } = await params
  const data = getCountry(country)
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
  const data = getCountry(country)
  if (!data) notFound()

  return (
    <>
      <ImageHero
        asset={IMAGES[data.imageKey]}
        size="compact"
        breadcrumbPath={`/where-we-work/${country}/`}
        eyebrow="Where we work"
        title={`Business Setup in ${data.name}`}
        subtitle={data.summary}
        priority
      >
        {/* India gets its own landing page (Decision #6); KSA links into its service. */}
        <CtaLink href={data.relatedService} variant="brand" size="lg" arrow>
          Explore our services in {data.name}
        </CtaLink>
        <CtaLink href="/where-we-work/" variant="secondary" size="lg">
          All markets
        </CtaLink>
      </ImageHero>

      <CTASection
        title={`Ready to enter ${data.name}?`}
        buttons={[
          {
            label: "Book a Free Consultation",
            href: "/contact/",
            variant: "brand",
          },
        ]}
      />
    </>
  )
}
